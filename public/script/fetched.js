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

let currentAudio;

document.addEventListener("DOMContentLoaded", async () => {
  const isFetchedPage = window.location.pathname === '/fetched/stock';

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = isFetchedPage 
    ? new Audio('../audio/brazil.mp3') 
    : new Audio('../audio/tesla.mp3');

  currentAudio.play();

  if (isFetchedPage) {
    const symbol = localStorage.getItem('sharedValue');
    const pricetag = document.getElementById('price');
    const change = document.getElementById('change');

    try {
      const response = await fetch(`/api/request/${symbol}`);
      const data = await response.json();
      pricetag.textContent = `$${data.price}`;
      change.textContent = `${data.change}`;
    } catch (err) {
      pricetag.textContent = "Error loading price";
      change.textContent = "Error loading change";
    }

    const time = new Date();
    const centralTime = time.toLocaleString("en-US", { timeZone: "America/Chicago" });
    const clock = document.getElementById('timeupd');
    const trim = centralTime.split(',');
    clock.textContent = `${trim[0]} at ${trim[1]}`;
  }
});

window.addEventListener('popstate', () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio('../audio/tesla.mp3');
  currentAudio.play();
});

function reloadAfter(delay) {
  setTimeout(() => {
    window.location.reload();
  }, delay);
}

reloadAfter(300000);

