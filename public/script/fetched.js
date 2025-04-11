async function fetchStockPrice(symbol) {
  try {
    const response = await fetch(`http://localhost:8787/api/stock/${symbol}`);
    const { price, change } = await response.json();
    console.log(`${symbol}: $${price} (${change})`);
    return { price, change };
  } catch (err) {
    console.error('Unknown symbol');
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const symbol = localStorage.getItem('sharedValue');
  const pricetag = document.getElementById('price');
  const change = document.getElementById('change');

  try {
      const response = await fetch(`/api/request/${symbol}`);
      const data = await response.json();
      pricetag.textContent = `$${data.price}`;
      change.textContent = `${data.change}`;

    const response = fetch(`/api/stock/${symbol}`);
    const data = response.json();
    price.textContent = `$${data.price}`;
  } catch (error) {
      pricetag.textContent = "Error loading price";
      change.textContent = "Error loading change";
  }

  const time = new Date();
  const centralTime = time.toLocaleString("en-US", { timeZone: "America/Chicago" });
  const clock = document.getElementById('timeupd');
  const trim = centralTime.split(',');
  const trim1 = trim[0];
  const trim2 = trim1[1];
  console.log(trim);


  clock.textContent = `${trim2} at ${trim1}`;

});

function reloadAfter(delay) {
  setTimeout(function() {
    window.location.reload();
  }, delay
);
}

reloadAfter(300000);

});
>>>>>>> 2aea4c464eaaed9b19b8c02351acce1e941bad7d
