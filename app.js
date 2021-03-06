// Set our coin/currency options
// Could pull this from the API but would require 400+ icons...
const coins = [
    {
        Bitcoin: {
            short: "BTC",
            icon: "icons/white/btc.png",
            alt: "Bitcoin",
        },
    },
    {
        Etherium: {
            short: "ETH",
            icon: "icons/white/eth.png",
            alt: "Etherium",
        },
    },
    {
        Binance: {
            short: "BNB",
            icon: "icons/white/bnb.png",
            alt: "Binance",
        },
    },
    {
        Litecoin: {
            short: "LTC",
            icon: "icons/white/ltc.png",
            alt: "Litecoin",
        },
    },
    {
        Cardano: {
            short: "ADA",
            icon: "icons/white/ada.png",
            alt: "Cardano",
        },
    },
    {
        Polkadot: {
            short: "DOT",
            icon: "icons/white/dot.png",
            alt: "Polkadot",
        },
    },
    {
        "Bitcoin Cash": {
            short: "BCH",
            icon: "icons/white/bch.png",
            alt: "Bitcoin Cash",
        },
    },
    {
        Steller: {
            short: "XLM",
            icon: "icons/white/xlm.png",
            alt: "Steller",
        },
    },
    {
        Tether: {
            short: "USDT",
            icon: "icons/white/usdt.png",
            alt: "Tether",
        },
    },
    {
        Monero: {
            short: "XMR",
            icon: "icons/white/xmr.png",
            alt: "Monero",
        },
    },
    {
        Dogecoin: {
            short: "DOGE",
            icon: "icons/white/doge.png",
            alt: "Dogecoin",
        },
    },
];

const currency = [
    {
        DOLLAR: {
            short: "USD",
            icon: "icons/white/usd.png",
        },
    },
    {
        YEN: {
            short: "JPY",
            icon: "icons/white/jpy.png",
        },
    },
    {
        EURO: {
            short: "EUR",
            icon: "icons/white/eur.png",
        },
    },
    {
        POUND: {
            short: "GBP",
            icon: "icons/white/gbp.png",
        },
    },
    {
        RUBLE: {
            short: "RUB",
            icon: "icons/white/rub.png",
        },
    },
];

// Get elements
const coinHeader = document.querySelector("#coinHeader");
const timeHeader = document.querySelector("#time");
const currencyHeader = document.querySelector("#currency");
const volumeHeader = document.querySelector("#volume");
const changeHeader = document.querySelector("#change");
const priceContainer = document.querySelector(".price-container");
const baseUrl = "https://api.cryptonator.com/api/full/";

const buttons = {
    coin: {
        button: document.querySelector("#coinBtn"),
        current: 0,
        length: coins.length,
    },
    currency: {
        button: document.querySelector("#currencyBtn"),
        current: 0,
        length: currency.length,
    },
};

// Add button listeners
for (let key of Object.keys(buttons)) {
    let button = buttons[key].button;
    button.addEventListener("click", () => {
        buttons[key].current += 1;
        if (buttons[key].current >= buttons[key].length) {
            buttons[key].current = 0;
        }

        // Add event listener on click to handle opacity transitions.
        button.addEventListener("transitionend", function fadeInOut(evt) {
            if (!evt.propertyName === "opacity") return;

            if (button.classList.contains("transparent")) {
                button.classList.toggle("transparent");
                priceContainer.classList.toggle("transparent");
            }
            updateCoin();

            // Remove listener so it only triggers once(transitionend calls mutliple times in a transition)
            button.removeEventListener("transitionend", fadeInOut);
        });

        button.classList.toggle("transparent");
        priceContainer.classList.toggle("transparent");
    });
}

async function updateCoin() {
    const coinID = buttons.coin.current;
    const currentCoin = Object.keys(coins[coinID])[0];
    const currencyID = buttons.currency.current;
    const currentCurrency = Object.keys(currency[currencyID])[0];

    // Update button images
    buttons.coin.button.src = coins[coinID][currentCoin].icon;
    buttons.coin.button.alt = coins[coinID][currentCoin].alt;

    buttons.currency.button.src = currency[currencyID][currentCurrency].icon;
    buttons.currency.button.alt = currency[currencyID][currentCurrency].alt;

    // Update header
    coinHeader.innerText = currentCoin;

    // Update coin prices
    try {
        const res = await axios.get(
            baseUrl +
                `${coins[coinID][currentCoin].short}-${currency[currencyID][currentCurrency].short}`
        );
        updateData(res.data);
    } catch (err) {
        console.log(err);
        coinHeader.innerText = "Error When Pulling Data";
    }
}

function updateData(data) {
    // Update the header info
    let newDate = new Date(data.timestamp * 1000);
    timeHeader.innerText = newDate.toLocaleString();
    currencyHeader.innerText = data.ticker.target;
    volumeHeader.innerText = parseFloat(data.ticker.volume).toFixed(2);
    changeHeader.innerText = data.ticker.change;

    // Reset the container
    priceContainer.innerHTML = "";

    // Use the market to generate new divs
    for (let ticker of data.ticker.markets) {
        let newDiv = document.createElement("div");
        let newMarket = document.createElement("h3");
        let newPrice = document.createElement("p");
        let newVolumne = document.createElement("p");

        newMarket.append(ticker.market);
        newPrice.append(parseFloat(ticker.price).toFixed(2));
        newVolumne.append(parseFloat(ticker.volume).toFixed(2));

        // Change color of the text depending on the market change
        if (data.ticker.change > 0) {
            newPrice.classList.add("price-up");
            newPrice.classList.remove("price-down");
            changeHeader.classList.add("price-up");
            changeHeader.classList.remove("price-down");
        } else {
            newPrice.classList.add("price-down");
            newPrice.classList.remove("price-up");
            changeHeader.classList.add("price-down");
            changeHeader.classList.remove("price-up");
        }
        newDiv.append(newMarket, newPrice, newVolumne);
        priceContainer.append(newDiv);
    }
}

// Start and update every min
updateCoin();
setInterval(updateCoin, 60000);
