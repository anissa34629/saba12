let myChart;
let currentMonthIndex = 0;
let fuelData;
let selectedDate; // Variable to store the selected date

function updateChart(data) {
    myChart.data.labels = data.map(item => item.Month + ' ' + item['Year and dataset code row']);
    myChart.data.datasets.forEach((dataset, index) => {
        switch (index) {
            case 0: dataset.data = data.map(item => item['Current price indices: Solid fuels']); break;
            case 1: dataset.data = data.map(item => item['Current price indices: Gas ']); break;
            case 2: dataset.data = data.map(item => item['Current price indices: Electricity ']); break;
            case 3: dataset.data = data.map(item => item['Current price indices: Liquid fuels']); break;
        }
    });
    myChart.update();
}

function updateMode() {
    const modeSelect = document.getElementById('modeSelect');
    const selectedMode = modeSelect.value;

    if (selectedMode === 'historical') {
        myChart.config.type = 'bar'; // Set chart type to bar for historical mode
    } else if (selectedMode === 'forecaster') {
        myChart.config.type = 'line'; // Set chart type to line for forecaster mode
    }

    myChart.update();
}

function handleDateSelection() {
    const selectedDateInput = document.getElementById('selectedDate');
    selectedDate = new Date(selectedDateInput.value);

    const minDate = new Date('1996-01-01');
    const maxDate = new Date('2022-08-30');

    if (!isNaN(selectedDate.getTime()) && selectedDate >= minDate && selectedDate <= maxDate) {
        document.getElementById('errorMessage').innerText = '';

        // Set the selected date
        const formattedDate = selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        // Fetch data for the entire selected year
        const selectedYear = selectedDate.getFullYear();
        const selectedData = fuelData.filter(item => {
            const itemDate = new Date(item['Year and dataset code row'] + '-' + item.Month + '-01');
            return itemDate.getFullYear() === selectedYear;
        });

        // Update the chart with the data for the selected year
        updateChart(selectedData);
        currentMonthIndex = 0; // Reset month index when a new date is selected
    } else {
        document.getElementById('errorMessage').innerText = 'Invalid date selected or date is not within the range of 1996 to 2022.';
    }
}

function handleButtonClick(direction) {
    if (direction === 'prev' && currentMonthIndex > 0) {
        currentMonthIndex--;
    } else if (direction === 'next' && currentMonthIndex < fuelData.length - 12) {
        currentMonthIndex++;
    } else {
        document.getElementById('errorMessage').innerText = (direction === 'prev') ? 'Reached the start of the dataset.' : 'Reached the end of the dataset.';
        return;
    }

    updateChart(fuelData.slice(currentMonthIndex, currentMonthIndex + 12));
    document.getElementById('errorMessage').innerText = '';
}

function destroyChart() {
    if (myChart) {
        myChart.destroy();
    }
}

function createChart() {
    const ctx = document.getElementById('fuelChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: fuelData.slice(currentMonthIndex, currentMonthIndex + 12).map(item => item.Month + ' ' + item['Year and dataset code row']),
            datasets: [
                {
                    label: 'Solid Fuels',
                    data: fuelData.slice(currentMonthIndex, currentMonthIndex + 12).map(item => item['Current price indices: Solid fuels']),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Gas',
                    data: fuelData.slice(currentMonthIndex, currentMonthIndex + 12).map(item => item['Current price indices: Gas ']),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Electricity',
                    data: fuelData.slice(currentMonthIndex, currentMonthIndex + 12).map(item => item['Current price indices: Electricity ']),
                    backgroundColor: 'rgba(255, 206, 86, 0.5)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Liquid Fuels',
                    data: fuelData.slice(currentMonthIndex, currentMonthIndex + 12).map(item => item['Current price indices: Liquid fuels']),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function toggleMode() {
    const modeSelect = document.getElementById('modeSelect');
    if (modeSelect.value === 'historical') {
        modeSelect.value = 'forecaster';
    } else {
        modeSelect.value = 'historical';
    }
    updateMode();
    destroyChart();
    createChart();
    updateMode();
}

function updateDateByMonth(offset) {
    if (selectedDate) {
        selectedDate.setMonth(selectedDate.getMonth() + offset);
        document.getElementById('selectedDate').valueAsDate = selectedDate;
        handleDateSelection();
    }
}

function updateDateByYear(offset) {
    if (selectedDate) {
        selectedDate.setFullYear(selectedDate.getFullYear() + offset);
        document.getElementById('selectedDate').valueAsDate = selectedDate;
        handleDateSelection();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('JsonforForcaster.json')
        .then(response => response.json())
        .then(data => {
            fuelData = data;

            createChart();

            document.getElementById('prevBtn').addEventListener('click', function () {
                handleButtonClick('prev');
            });

            document.getElementById('nextBtn').addEventListener('click', function () {
                handleButtonClick('next');
            });

            document.getElementById('modeSelect').addEventListener('change', updateMode);

            document.getElementById('selectedDate').addEventListener('change', handleDateSelection);

            document.getElementById('toggleModeBtn').addEventListener('click', toggleMode);

            // Add event listeners for back and forward arrows
            document.getElementById('backMonthBtn').addEventListener('click', function () {
                updateDateByMonth(-1);
            });

            document.getElementById('forwardMonthBtn').addEventListener('click', function () {
                updateDateByMonth(1);
            });

            document.getElementById('backYearBtn').addEventListener('click', function () {
                updateDateByYear(-1);
            });

            document.getElementById('forwardYearBtn').addEventListener('click', function () {
                updateDateByYear(1);
            });

            updateChart(fuelData.slice(currentMonthIndex, currentMonthIndex + 12));
        })
        .catch(error => {
            console.error('Error fetching the JSON file:', error);
            document.getElementById('errorMessage').innerText = 'Failed to load data.';
        });
});
