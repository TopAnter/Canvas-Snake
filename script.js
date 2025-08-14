

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

// pelaajan aloituspaikka
let pelaajaX = Math.floor(Math.random() * (10) + 5);
let pelaajaY = Math.floor(Math.random() * (10) + 5);
grid[pelaajaY][pelaajaX] = 2;

// omenan sijoitus
let omenaX, omenaY;
do {
    omenaX = Math.floor(Math.random() * columnit);
    omenaY = Math.floor(Math.random() * rivit);
} while (omenaX === pelaajaX && omenaY === pelaajaY);
grid[omenaY][omenaX] = 1;

// Pisteet
let pisteet = 0;

// Madon liikesuunta (dx, dy)
let suuntaX = 1; // oikea
let suuntaY = 0; // ei y-suunnassa

// Kuunnellaan näppäimistöä suunnan vaihtamiseksi
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && suuntaY === 0) {
        suuntaX = 0; suuntaY = -1;
    }
    if (e.key === "ArrowDown" && suuntaY === 0) {
        suuntaX = 0; suuntaY = 1;
    }
    if (e.key === "ArrowLeft" && suuntaX === 0) {
        suuntaX = -1; suuntaY = 0;
    }
    if (e.key === "ArrowRight" && suuntaX === 0) {
        suuntaX = 1; suuntaY = 0;
    }
});

function draw() {
    const canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");

        // tausta
        ctx.fillStyle = "rgb(50 50 50)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < rivit; y++) {
            for (let x = 0; x < columnit; x++) {
                let valittuRuutu = grid[y][x];

                if (valittuRuutu === 0) ctx.fillStyle = "green";
                else if (valittuRuutu === 1) ctx.fillStyle = "red";
                else if (valittuRuutu === 2) ctx.fillStyle = "blue";

                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                ctx.strokeStyle = "black";
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }

        // näytetään pisteet
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Pisteet: " + pisteet, 10, canvas.height - 10);
    }
}

// Pelin päivitysfunktio
function update() {
    // poistetaan pelaaja vanhasta ruudusta
    grid[pelaajaY][pelaajaX] = 0;

    // päivitetään madon sijainti
    pelaajaX += suuntaX;
    pelaajaY += suuntaY;

    // ruutujen rajat (pelin loppu, jos osuu seinään)
    if (pelaajaX < 0) pelaajaX = 0;
    if (pelaajaX > columnit - 1) pelaajaX = columnit - 1;
    if (pelaajaY < 0) pelaajaY = 0;
    if (pelaajaY > rivit - 1) pelaajaY = rivit - 1;

    // tarkistetaan osuiko omenaa
    if (pelaajaX === omenaX && pelaajaY === omenaY) {
        pisteet++;
        // Luo uusi omena tyhjään ruutuun
        do {
            omenaX = Math.floor(Math.random() * columnit);
            omenaY = Math.floor(Math.random() * rivit);
        } while (grid[omenaY][omenaX] !== 0);
        grid[omenaY][omenaX] = 1;
    }

    // asetetaan pelaaja uuteen ruutuun
    grid[pelaajaY][pelaajaX] = 2;

    draw();
    setTimeout(update, 200);
}

// Käynnistys
window.addEventListener("load", () => {
    update();
});
