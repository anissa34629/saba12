// script.js

document.addEventListener('DOMContentLoaded', function() {
    const sourceCurrency = document.getElementById('sourceCurrency');
    const destinationCurrency = document.getElementById('destinationCurrency');
    const exchangeRate = document.getElementById('exchangeRate');
    const lastUpdate = document.getElementById('lastUpdate');
    const sourceAmount = document.getElementById('sourceAmount');
    const convertButton = document.getElementById('convert');
    const result = document.getElementById('result');
    const timestamp = document.getElementById('timestamp');
    const error = document.getElementById('error');
    let ratesData = {};

    const fetchRates = async () => {
        try {
            const response = await fetch('https://www.floatrates.com/daily/gbp.json');
            const data = await response.json();
            ratesData = data;
            populateCurrencies();
        } catch (err) {
            console.error('Error fetching exchange rates: ', err);
        }
    };

    const populateCurrencies = () => {
        for (const currency in ratesData) {
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');
            option1.value = option2.value = currency;
            option1.text = option2.text = ratesData[currency].name;
            if (currency === 'usd') {
                option1.selected = true;
            }
            if (currency === 'eur') {
                option2.selected = true;
            }
            sourceCurrency.appendChild(option1);
            destinationCurrency.appendChild(option2);
        }
        updateExchangeRate();
    };

    const updateExchangeRate = () => {
        const source = sourceCurrency.value;
        const destination = destinationCurrency.value;
        const rate = ratesData[destination].rate / ratesData[source].rate;
        exchangeRate.textContent = `1 ${source.toUpperCase()} = ${rate.toFixed(4)} ${destination.toUpperCase()}`;
        lastUpdate.textContent = `Last Update: ${new Date().toLocaleString('en-GB', { timeZone: 'GMT' })}`;
    };

    const convert = () => {
        const amount = parseFloat(sourceAmount.value);
        if (amount <= 0) {
            error.textContent = 'Amount must be greater than 0';
            result.textContent = '';
            return;
        }
        error.textContent = '';
        const source = sourceCurrency.value;
        const destination = destinationCurrency.value;
        const rate = ratesData[destination].rate / ratesData[source].rate;
        const convertedAmount = amount * rate;
        result.textContent = `${amount.toFixed(2)} ${source.toUpperCase()} = ${convertedAmount.toFixed(2)} ${destination.toUpperCase()}`;
        timestamp.textContent = `Calculation Timestamp: ${new Date().toLocaleString('en-GB', { timeZone: 'GMT' })}`;
    };

    sourceCurrency.addEventListener('change', updateExchangeRate);
    destinationCurrency.addEventListener('change', updateExchangeRate);
    convertButton.addEventListener('click', convert);

    fetchRates();
});
