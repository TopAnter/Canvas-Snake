

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

// madon osat taulukossa (alkuun vain yksi pätkä)
let mato = [];
let pelaajaX = Math.floor(Math.random() * (10) + 5);
let pelaajaY = Math.floor(Math.random() * (10) + 5);
mato.push({x: pelaajaX, y: pelaajaY});
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
    // madon pää
    let head = {x: mato[0].x + suuntaX, y: mato[0].y + suuntaY};

    // rajat (seinään törmäys = peli loppuu)
    if (head.x < 0 || head.x >= columnit || head.y < 0 || head.y >= rivit) {
        alert("Peli ohi! Pisteet: " + pisteet);
        return;
    }

    // osuuko omaan häntään
    for (let osa of mato) {
        if (osa.x === head.x && osa.y === head.y) {
            alert("Peli ohi! Pisteet: " + pisteet);
            return;
        }
    }

    // lisätään uusi pää taulukkoon
    mato.unshift(head);

    // osuuko omenaa
    if (head.x === omenaX && head.y === omenaY) {
        pisteet++;
        // uusi omena
        do {
            omenaX = Math.floor(Math.random() * columnit);
            omenaY = Math.floor(Math.random() * rivit);
        } while (grid[omenaY][omenaX] !== 0);
        grid[omenaY][omenaX] = 1;
        // (EI poisteta häntää → mato kasvaa)
    } else {
        // poistetaan häntä jos ei syö omenaa
        let tail = mato.pop();
        grid[tail.y][tail.x] = 0;
    }

    // päivitetään ruudukko madon osille
    for (let osa of mato) {
        grid[osa.y][osa.x] = 2;
    }

    draw();
    setTimeout(update, 200);
}

// Käynnistys
window.addEventListener("load", () => {
    update();
});
