let next;

document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById('iframe');
  if (!iframe) {
    console.error('Iframe not found in the DOM.');
    return;
  }

  iframe.onload = function () {
    try {
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      if (!iframeDocument) {
        console.error('Unable to access iframe document.');
        return;
      }

      const inputElement = iframeDocument.getElementById('input');
      if (!inputElement) {
        console.error('Input element not found in iframe.');
        return;
      }

      console.log('Input element found:', inputElement);

      const inputValue = inputElement.value;
      console.log('Input value:', inputValue);

      if (inputValue) {
        next = inputValue;
        console.log(`Next value set to: ${next}`);
        loadPrice();
      } else {
        console.error('Input value is empty.');
      }
    } catch (error) {
      console.error('Error accessing iframe content:', error);
    }
  };
});

async function loadPrice() {
  if (!next) {
    console.error('Next is undefined. Cannot fetch stock price.');
    return;
  }

  const price = document.getElementById('price');
  if (!price) {
    console.error('Price element not found in the DOM.');
    return;
  }

  try {
    const response = await fetch(`/api/request/${next}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    price.textContent = `$${data.price}`;
  } catch (error) {
    price.textContent = "Error loading price";
    console.error('Error loading price:', error);
  }
}