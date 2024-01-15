document.addEventListener("DOMContentLoaded", function () {
    const header = document.getElementById("main-header");

    // Change header color on click
    header.addEventListener("click", function () {
        // Generate a random color
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        header.style.backgroundColor = randomColor;
    });
});

















const fuelCostsChart = new Chart(document.getElementById('fuel-costs-chart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Solid Fuels (D7DW)',
                data: [],
                borderColor: '#FF0000'
            },
            {
                label: 'Gas (D7DU)',
                data: [],
                borderColor: '#00FF00'
            },
            {
                label: 'Electricity (D7DT)',
                data: [],
                borderColor: '#0000FF'
            },
            {
                label: 'Liquid Fuels (D7DV)',
                data: [],
                borderColor: '#008000'
            }
        ]
    },
    options: {
        title: {
            display: true,
            text: 'Heating Fuel Costs'
        },
        scales: {
            x: {
                type: 'time',
                title: {
                    text: 'Date'
                },
                display: true
            },
            y: {
                title: {
                    text: 'Cost (p)'
                }
            }
        }
    }
});

let selectedFuelTypes = ['all'];
let forecastingMode = 'historical';

const loadHistoricalData = () => {
    const request = new XMLHttpRequest();
    request.open('GET', 'data.json');
    request.onload = () => {
        if (request.status === 200) {
            const data = JSON.parse(request.responseText);
            for (const month of data) {
                if (selectedFuelTypes.includes('all') || selectedFuelTypes.includes(month.fuelType)) {
                    fuelCostsChart.data.labels.push(month.date);
                    for (const fuelType in month.costs) {
                        const fuelCost = month.costs[fuelType];
                        fuelCostsChart.data.datasets.find(dataset => dataset.label === fuelType).data.push(fuelCost);
                    }
                }
            }
            fuelCostsChart.update();
        } else {
            console.error('Failed to load historical data:', request.statusText);
        }
    };
    request.send();
};

const handleMonthChange = () => {
    if (forecastingMode === 'historical') {
        loadHistoricalData();
    } else {
        console.error('Forecasting mode does not support month change');
    }
};

const handleFilterChange = () => {
    selectedFuelTypes = [];
    const selectedOptions = document.getElementById('selected-fuel-types').querySelectorAll('option:checked');
    for (const option of selectedOptions) {
        selectedFuelTypes.push(option.value);
    }
    updateChart();
};

const handleModeSwitch = () => {
    const selectedMode = document.getElementById('forecasting-mode').value;
    forecastingMode = selectedMode;
    if (forecastingMode === 'historical') {
        loadHistoricalData();
    } else {
        document.getElementById('forecasting-mode-switch').removeEventListener('change', handleModeSwitch);
        console.log('Forecasting mode is enabled');
    }
};

const updateChart = () => {
    fuelCostsChart.data.labels = [];
    fuelCostsChart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });

    for (const month of data) {
        if (selectedFuelTypes.includes('all') || selectedFuelTypes.includes(month.fuelType)) {
            fuelCostsChart.data.labels.push(month.date);
            for (const fuelType in month.costs) {
                const fuelCost = month.costs[fuelType];
                fuelCostsChart.data.datasets.find(dataset => dataset.label === fuelType).data.push(fuelCost);
            }
        }
    }
    fuelCostsChart.update();
};

document.getElementById('month-selector').addEventListener('change', handleMonthChange);
document.getElementById('selected-fuel-types').addEventListener('change', handleFilterChange);
document.getElementById('forecasting-mode-switch').addEventListener('change', handleModeSwitch);


































$(document).ready(function () {
    // ... (your existing code)

    // owl carousel script
    $('.carousel').owlCarousel({
        margin: 20,
        loop: true,
        autoplay: true,
        autoplayTimeOut: 2000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            600: {
                items: 2,
                nav: false
            },
            1000: {
                items: 3, // Set the number of items to 3 for desktop view
                nav: false
            }
        }
    });
});
