let pointsChart
let winRateChart

function renderCharts(players){

const names = players.map(p => p.name)
const points = players.map(p => p.points)
const winrates = players.map(p => (p.winrate * 100).toFixed(1))

// POINTS CHART

const ctx1 = document.getElementById("pointsChart")

if(pointsChart) pointsChart.destroy()

pointsChart = new Chart(ctx1, {
type: "bar",
data: {
labels: names,
datasets: [{
label: "Points",
data: points
}]
},
options: {
responsive: true
}
})

// WIN RATE CHART

const ctx2 = document.getElementById("winRateChart")

if(winRateChart) winRateChart.destroy()

winRateChart = new Chart(ctx2, {
type: "bar",
data: {
labels: names,
datasets: [{
label: "Win Rate %",
data: winrates
}]
},
options: {
responsive: true
}
})

}
