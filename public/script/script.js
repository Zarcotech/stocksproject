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

    // if (submitBtn && input && result) {
    //     submitBtn.addEventListener('click', async () => {
    //         const symbol = input.value.trim();
    //         if (!symbol) return;

    //         try {
    //             const response = await fetch(`/api/stock/${symbol}`);
    //             if (!response.ok) throw new Error('API error');
    //             const data = await response.json();
    //             result.textContent = `$${data.price}`;
    //         } catch (error) {
    //             result.textContent = 'No such Symbol in NASDAQ Stock Market';
    //             console.error(error);
    //         }
    //     });
    // } else {
    //     console.error('Required elements not found');
    // }

    document.getElementById('submit').addEventListener('click', async () => {
        const symbol = document.getElementById('input').value.trim();
        const result = document.getElementById('result');
        
        try {
            const response = await fetch(`/api/stock/${symbol}`);
            const data = await response.json();
            result.textContent = `$${data.price}`;
            window.location.href = '/fetchstock';
        } catch (error) {
            result.textContent = "Error loading price";
        }
        window.location.href = '/fetched/stock';
    });
});
