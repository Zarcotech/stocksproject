async function fetchStockPrice(symbol) {
  try {
    const response = await fetch(`http://localhost:8787/api/stock/${symbol}`);
    const { price, change } = await response.json();
    console.log(`${symbol}: $${price} (${change})`);
    return { price, change };
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

const price = document.getElementById('price');

document.addEventListener("DOMContentLoaded", () => {
  const price = document.getElementById('price');
  try {
    const response = fetch(`/api/request/${symbol}`);
    const data = response.json();
    price.textContent = `$${data.price}`;
  } catch (error) {
    price.textContent = "Error loading price";
    console.error('Error loading price:', error);
  }
});