const form = document.getElementById('riskForm');
const riskScoreEl = document.getElementById('riskScore');
const bottlenecksEl = document.getElementById('bottlenecks');
let riskHistory = [];

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const budget = parseFloat(document.getElementById('budget').value);

    // Convert selected date to number of days remaining
    const deadlineInput = document.getElementById('deadline').value;
    const deadlineDate = new Date(deadlineInput);
    const today = new Date();
    const deadline = Math.max(Math.round((deadlineDate - today) / (1000*60*60*24)), 0);

    const resources = parseFloat(document.getElementById('resources').value);

    const response = await fetch('http://127.0.0.1:5000/assess-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget, deadline, resources })
    });

    const data = await response.json();
    riskScoreEl.textContent = data.risk_score;

    bottlenecksEl.innerHTML = '';
    data.bottlenecks.forEach(b => {
        const li = document.createElement('li');
        li.textContent = b;
        bottlenecksEl.appendChild(li);
    });

    riskHistory.push(data.risk_score);
    updateChart();
});

let chart = null;
function updateChart() {
    const ctx = document.getElementById('riskChart').getContext('2d');
    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: { labels: riskHistory.map((_, i) => i+1), datasets: [{ label: 'Risk Trend', data: riskHistory, borderColor: 'red', fill: false, tension: 0.3 }] },
        options: { responsive: true, scales: { y: { beginAtZero: true, max: 100 } } }
    });
}
