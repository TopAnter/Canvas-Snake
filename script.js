

const rivit = 20;
const columnit = 20;
const cellSize = 25; // pixeliä

// 0 = nurmikko, 1 = omena, 2 = pelaaja
let grid = [];

// kaikista ruuduista nurmikko
for (let y = 0; y < rivit; y++) {
    let rivi = [];
    for (let x = 0; x < columnit; x++) {
        rivi.push(0);
    }
    grid.push(rivi);
}

// pelaajan aloitus paikka

let pelaajaX = Math.floor(Math.random() * (10) + 5);
let pelaajaY = Math.floor(Math.random() * (10) + 5);

grid[pelaajaX][pelaajaY] = 2;

//omenan sijoitus

let omenaX = Math.floor(Math.random() * (20));
let omenaY = Math.floor(Math.random() * (20));

grid[omenaX][omenaY] = 1;



function draw(){
    const canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "rgb(50 50 50)";
        ctx.fillRect(0, 500, 500, 100);

        for (let y = 0; y < rivit; y++) {
            for (let x = 0; x < columnit; x++) {
                let valittuRuutu = grid[y][x];

                // asetetaan ruutu tilan mukaa
                if (valittuRuutu === 0) {
                    ctx.fillStyle = "green";
                } else if (valittuRuutu === 1) {
                    ctx.fillStyle = "red";
                } else if (valittuRuutu === 2) {
                    ctx.fillStyle = "blue";
                }

                // Piirretään ruutu
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

                // ruudukon viivat
                ctx.strokeStyle = "black";
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
    
}
window.addEventListener("load", draw);