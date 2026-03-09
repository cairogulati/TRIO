const sheetURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQl2Kx3SpXSA3IyCQoLaalLjibwCh2f6nURBZU-qABgT6hA5eeGOaiKOfmOas93rwsgi4OlBr-ttbqp/pub?gid=0&single=true&output=csv";

async function loadData(){

const res = await fetch(sheetURL)
const text = await res.text()

const rows = text.split("\n").map(r=>r.split(","))

const headers = rows.shift()

const games = rows.map(row=>{
let obj={}
headers.forEach((h,i)=>obj[h]=row[i])
return obj
})

computeLeaderboard(games)

}

function computeLeaderboard(games){

let players={}

games.forEach(game=>{

let list=[
game.Player1,
game.Player2,
game.Player3,
game.Player4,
game.Player5,
game.Player6
]

list.forEach(p=>{

if(!players[p]){
players[p]={games:0,wins:0,points:0}
}

players[p].games++

if(game.Winner===p){

players[p].wins++
players[p].points+=6

}else{

players[p].points+=1

}

})

})

let arr=Object.keys(players).map(name=>{

let p=players[name]

return{
name,
games:p.games,
wins:p.wins,
points:p.points,
winrate:(p.wins/p.games)
}

})

arr.sort((a,b)=>b.points-a.points)

renderTable(arr)

renderChart(arr)

}

function renderTable(players){

const body=document.querySelector("#leaderboard tbody")

body.innerHTML=""

players.forEach((p,i)=>{

let row=`
<tr>
<td>${i+1}</td>
<td>${p.name}</td>
<td>${p.games}</td>
<td>${p.wins}</td>
<td>${p.points}</td>
<td>${(p.winrate*100).toFixed(1)}%</td>
</tr>
`

body.innerHTML+=row

})

}

function renderChart(players){

const ctx=document.getElementById("chart")

new Chart(ctx,{
type:"bar",
data:{
labels:players.map(p=>p.name),
datasets:[{
label:"Points",
data:players.map(p=>p.points)
}]
}
})

}

loadData()
