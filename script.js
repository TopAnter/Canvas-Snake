const rivit = 20; // ruudukon rivien määrä
const columnit = 20; // ruudun sarakkeiden määrä
const cellSize = 25; // ruudun koko pikseleinä

let grid = []; // ruudukko: 0 = nurmikko, 1 = omena, 2 = mato
let mato = []; // madon osat taulukossa (alkuun vain yksi pätkä)
let pisteet = 0; // pisteet
let suuntaX = 1; // madon liikesuunta X (1 = oikea)
let suuntaY = 0; // madon liikesuunta Y
let omenaX, omenaY; // omenan sijainti ruudukossa
let peliKaynnissa = false; // onko peli käynnissä
let pausella = false; // onko peli tauolla
let updateId; // päivityksen setTimeout ID

let startBtnClicked = false;
let pauseBtnClicked = false;

// Alusta ruudukko ja madon lähtöasema
function alustaRuudukko() {
    grid = [];
    for (let y = 0; y < rivit; y++) {
        let rivi = [];
        for (let x = 0; x < columnit; x++) {
            rivi.push(0);
        }
        grid.push(rivi);
    }

    let pelaajaX = Math.floor(Math.random() * 10 + 5);
    let pelaajaY = Math.floor(Math.random() * 10 + 5);
    mato = [];
    mato.push({ x: pelaajaX, y: pelaajaY });
    grid[pelaajaY][pelaajaX] = 2;

    do {
        omenaX = Math.floor(Math.random() * columnit);
        omenaY = Math.floor(Math.random() * rivit);
    } while (omenaX === pelaajaX && omenaY === pelaajaY);
    grid[omenaY][omenaX] = 1;

    pisteet = 0;
    suuntaX = 1;
    suuntaY = 0;

    draw();
}

// Alusta peli ja käynnistä päivitys
function alustaPeli() {
    if (!peliKaynnissa) {
        peliKaynnissa = true;
        pausella = false;
        update();
    }
}

// Näppäinkäsittely: suunnan vaihtaminen nuolinäppäimillä
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && suuntaY === 0) { suuntaX = 0; suuntaY = -1; }
    if (e.key === "ArrowDown" && suuntaY === 0) { suuntaX = 0; suuntaY = 1; }
    if (e.key === "ArrowLeft" && suuntaX === 0) { suuntaX = -1; suuntaY = 0; }
    if (e.key === "ArrowRight" && suuntaX === 0) { suuntaX = 1; suuntaY = 0; }
});

// Funktio piirtämään pyöristetty laatikko
function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// Piirrä ruudukko ja pelielementit
function draw() {
    const canvas = document.getElementById("canvas");
    if (!canvas.getContext) return;
    const ctx = canvas.getContext("2d");

    // tausta
    ctx.fillStyle = "rgb(50 50 50)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // piirretään ruudukko
    for (let y = 0; y < rivit; y++) {
        for (let x = 0; x < columnit; x++) {
            let valittuRuutu = grid[y][x];
            ctx.fillStyle = valittuRuutu === 0 ? "green" :
                            valittuRuutu === 1 ? "red" : "blue";
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            ctx.strokeStyle = "black";
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }

    // pisteet vasemmalle
    const btnY = canvas.height - 45;
    const btnH = 35;
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("Pisteet: " + pisteet, 10, btnY + btnH / 2);

    // --- BUTTONIT ---
    const startBtnX = canvas.width / 2 - 60;
    const startBtnW = 120;
    const pauseBtnW = 100;
    const pauseBtnX = canvas.width - pauseBtnW - 10;

    const mx = window._mouseX ?? -1;
    const my = window._mouseY ?? -1;
    const isHoverStart = mx >= startBtnX && mx <= startBtnX + startBtnW &&
                         my >= btnY && my <= btnY + btnH;
    const isHoverPause = mx >= pauseBtnX && mx <= pauseBtnX + pauseBtnW &&
                         my >= btnY && my <= btnY + btnH;

    // Start-painike
    ctx.fillStyle = startBtnClicked ? "#aaa" : (isHoverStart ? "#888" : "#666");
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 6;
    drawRoundedRect(ctx, startBtnX, btnY, startBtnW, btnH, 8);
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Aloita peli", startBtnX + startBtnW / 2, btnY + btnH / 2);

    // Pause-painike
    ctx.fillStyle = pauseBtnClicked ? "#aaa" : (isHoverPause ? "#888" : "#666");
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 6;
    drawRoundedRect(ctx, pauseBtnX, btnY, pauseBtnW, btnH, 8);
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "white";
    ctx.fillText(pausella ? "Jatka" : "Pause", pauseBtnX + pauseBtnW / 2, btnY + btnH / 2);

    // tallenna painikkeiden sijainnit canvas-elementtiin
    canvas._startButton = { x: startBtnX, y: btnY, w: startBtnW, h: btnH };
    canvas._pauseButton = { x: pauseBtnX, y: btnY, w: pauseBtnW, h: btnH };
}

// Peli-looppi: liike, törmäykset, omenan syönti
function update() {
    if (!peliKaynnissa || pausella) return;

    let head = { x: mato[0].x + suuntaX, y: mato[0].y + suuntaY };

    if (head.x < 0 || head.x >= columnit || head.y < 0 || head.y >= rivit) {
        alert("Peli ohi! Pisteet: " + pisteet);
        peliKaynnissa = false;
        clearTimeout(updateId);
        return;
    }

    for (let osa of mato) {
        if (osa.x === head.x && osa.y === head.y) {
            alert("Peli ohi! Pisteet: " + pisteet);
            peliKaynnissa = false;
            clearTimeout(updateId);
            return;
        }
    }

    mato.unshift(head);

    if (head.x === omenaX && head.y === omenaY) {
        pisteet++;
        do {
            omenaX = Math.floor(Math.random() * columnit);
            omenaY = Math.floor(Math.random() * rivit);
        } while (grid[omenaY][omenaX] !== 0);
        grid[omenaY][omenaX] = 1;
    } else {
        let tail = mato.pop();
        grid[tail.y][tail.x] = 0;
    }

    for (let osa of mato) grid[osa.y][osa.x] = 2;

    draw();
    updateId = setTimeout(update, 200);
}

// Klikkaus-event painikkeille
document.getElementById("canvas").addEventListener("click", (e) => {
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const startBtn = canvas._startButton;
    const pauseBtn = canvas._pauseButton;

    if (startBtn && mx >= startBtn.x && mx <= startBtn.x + startBtn.w &&
        my >= startBtn.y && my <= startBtn.y + startBtn.h) {
        startBtnClicked = true;
        setTimeout(() => { startBtnClicked = false; draw(); }, 150);
        if (peliKaynnissa) {
            peliKaynnissa = false;
            clearTimeout(updateId);
        }
        alustaRuudukko();
        alustaPeli();
    }

    if (pauseBtn && mx >= pauseBtn.x && mx <= pauseBtn.x + pauseBtn.w &&
        my >= pauseBtn.y && my <= pauseBtn.y + pauseBtn.h) {
        pauseBtnClicked = true;
        setTimeout(() => { pauseBtnClicked = false; draw(); }, 150);
        if (peliKaynnissa) {
            pausella = !pausella;
            if (!pausella) {
                update();
            } else {
                clearTimeout(updateId);
            }
            draw();
        }
    }
});

// Hover-seuranta
document.getElementById("canvas").addEventListener("mousemove", (e) => {
    const rect = e.target.getBoundingClientRect();
    window._mouseX = e.clientX - rect.left;
    window._mouseY = e.clientY - rect.top;
    draw();
});

// Alusta ruudukko sivun latautuessa
window.addEventListener("load", alustaRuudukko);
