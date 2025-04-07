document.addEventListener('DOMContentLoaded', async () => {
    const symbol = new URLSearchParams(window.location.search).get('symbol');
    if (!symbol) return showError('No stock symbol provided');

    const stockData = document.getElementById('stock-data');
    const errorDiv = document.getElementById('error');
    
    stockData.style.display = 'none';
    errorDiv.textContent = 'Loading...';

    try {
        const response = await fetch(`/api/stock/${symbol}`);
        if (!response.ok) throw new Error('Stock not found');
        
        const data = await response.json();
        displayStockData(data);
    } catch (error) {
        showError(error.message);
    }
});

function displayStockData(data) {
    document.getElementById('symbol').textContent = data.symbol;
    document.getElementById('price').textContent = `$${data.price}`;
    
    const changeElement = document.getElementById('change');
    changeElement.textContent = data.change;
    changeElement.className = data.change.includes('-') ? 'negative' : 'positive';
    
    document.getElementById('stock-data').style.display = 'block';
    document.getElementById('error').textContent = '';
}

function showError(message) {
    document.getElementById('error').textContent = message;
    document.getElementById('stock-data').style.display = 'none';
}