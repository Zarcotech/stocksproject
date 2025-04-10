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


class TypeWriter {
    constructor(element, words, period) {
        this.element = element;
        this.words = JSON.parse(words);
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = "";
        this.isDeleting = false;
        this.tick();
    }

    tick() {
        let i = this.loopNum % this.words.length;
        let fullTxt = this.words[i];

        this.txt = this.isDeleting
            ? fullTxt.substring(0, this.txt.length - 1)
            : fullTxt.substring(0, this.txt.length + 1);

        this.element.innerHTML = this.txt;

        let that = this;
        let delta = 200 - Math.random() * 100;

        if (this.isDeleting) {
            delta /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === "") {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(function () {
            that.tick();
        }, delta);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let elements = document.getElementsByClassName("typewrite");
    for (let i = 0; i < elements.length; i++) {
        let toRotate = elements[i].getAttribute("data-type");
        let period = elements[i].getAttribute("data-period");
        if (toRotate) {
            new TypeWriter(elements[i], toRotate, period);
        }
    }
    const submitBtn = document.getElementById('submit');
    const input = document.getElementById('input');
    const result = document.getElementById('result');

    document.getElementById('submit').addEventListener('click', async () => {
        const symbol = document.getElementById('input').value.trim();
        const result = document.getElementById('result');
        
        try {
            const response = await fetch(`/api/request/${symbol}`);
            const data = await response.json();
            result.textContent = `$${data.price}`;
            window.location.href = '/fetchstock';
        } catch (error) {
            result.textContent = "Error loading price";
        }
        window.location.href = '/fetchstock';
    });

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

            // Add an event listener to log the input value dynamically
            inputElement.addEventListener('input', () => {
                console.log('Updated input value:', inputElement.value);
            });

            const inputValue = inputElement.value;
            console.log('Input value:', inputValue);

            if (inputValue) {
                next = inputValue;
                console.log(`Next value set to: ${next}`);
                loadPrice();
            } else {
                console.error('Input value is empty. Waiting for user input...');
            }
        } catch (error) {
            console.error('Error accessing iframe content:', error);
        }
    };
});
