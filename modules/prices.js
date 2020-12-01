import('../scripts/currency.min.js');

var numberRegex = /[0-9,\.]+/;
var symbolRegex = /[^0-9,\.\s]/;

var currencyElements = document.getElementsByName('currency');
var avgElement = document.getElementById('avg');
var percentElement = document.getElementById('profitPercent');
var profitElement = document.getElementById('profit');

percentElement.addEventListener('change', calculateProfit)

export function calculateAverage(prices) {
    if (!prices || !prices.length) {
        return;
    }
    var total = currency(0);
    var count = 0;
    prices.forEach(price => {
        var numericPart = numberRegex.exec(price)[0];
        var options = numericPart[numericPart.length - 3] === ','
            ? { separator: '.', decimal: ',' }
            : { separator: ',', decimal: '.' };
        var value = currency(price, options);
        total = total.add(value);
        count++;
    });
    currencyElements.forEach(e => e.innerText = symbolRegex.exec(prices[0])[0]);
    avgElement.innerText = total.divide(count);

    calculateProfit();
}

function calculateProfit() {
    var average = +avgElement.innerText;
    var percent = +percentElement.value;
    profitElement.innerText = isNaN(percent) || isNaN(percent)
        ? '-'
        : `${percent * average / 100}`;

}