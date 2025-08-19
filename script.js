

const rivit = 20; // ruudukon rivien määrä
const columnit = 20; // ruudukon sarakkeiden määrä
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

// Alusta ruudukko ja madon lähtöasema
function alustaRuudukko() {
    grid = [];
    // kaikista ruuduista nurmikko
    for (let y = 0; y < rivit; y++) {
        let rivi = [];
        for (let x = 0; x < columnit; x++) {
            rivi.push(0);
        }
        grid.push(rivi);
    }

    // madon aloitus
    let pelaajaX = Math.floor(Math.random() * 10 + 5);
    let pelaajaY = Math.floor(Math.random() * 10 + 5);
    mato = [];
    mato.push({ x: pelaajaX, y: pelaajaY });
    grid[pelaajaY][pelaajaX] = 2;

    // omenan sijoitus
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
            // 0 = nurmikko, 1 = omena, 2 = mato
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

    // "Aloita peli" keskelle
    const startBtnX = canvas.width / 2 - 60;
    const startBtnW = 120;
    ctx.fillStyle = "#666";
    ctx.fillRect(startBtnX, btnY, startBtnW, btnH);
    ctx.strokeStyle = "white";
    ctx.strokeRect(startBtnX, btnY, startBtnW, btnH);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Aloita peli", startBtnX + startBtnW / 2, btnY + btnH / 2);

    // "Pause" oikealle
    const pauseBtnW = 100;
    const pauseBtnX = canvas.width - pauseBtnW - 10;
    ctx.fillStyle = "#666";
    ctx.fillRect(pauseBtnX, btnY, pauseBtnW, btnH);
    ctx.strokeStyle = "white";
    ctx.strokeRect(pauseBtnX, btnY, pauseBtnW, btnH);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(pausella ? "Jatka" : "Pause", pauseBtnX + pauseBtnW / 2, btnY + btnH / 2);

    // tallenna painikkeiden sijainnit canvas-elementtiin
    canvas._startButton = { x: startBtnX, y: btnY, w: startBtnW, h: btnH };
    canvas._pauseButton = { x: pauseBtnX, y: btnY, w: pauseBtnW, h: btnH };
}

// Peli-looppi: liike, törmäykset, omenan syönti
function update() {
    if (!peliKaynnissa || pausella) return;

    // madon pää
    let head = { x: mato[0].x + suuntaX, y: mato[0].y + suuntaY };

    // rajat (seinään törmäys = peli loppuu)
    if (head.x < 0 || head.x >= columnit || head.y < 0 || head.y >= rivit) {
        alert("Peli ohi! Pisteet: " + pisteet);
        peliKaynnissa = false;
        clearTimeout(updateId);
        return;
    }

    // osuuko omaan häntään
    for (let osa of mato) {
        if (osa.x === head.x && osa.y === head.y) {
            alert("Peli ohi! Pisteet: " + pisteet);
            peliKaynnissa = false;
            clearTimeout(updateId);
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
    for (let osa of mato) grid[osa.y][osa.x] = 2;

    draw();
    updateId = setTimeout(update, 200);
}

// Kuuntele hiiren klikkausta canvasin painikkeisiin
document.getElementById("canvas").addEventListener("click", (e) => {
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const startBtn = canvas._startButton;
    const pauseBtn = canvas._pauseButton;

    // Start-painike
    if (startBtn && mx >= startBtn.x && mx <= startBtn.x + startBtn.w &&
        my >= startBtn.y && my <= startBtn.y + startBtn.h) {
        if (peliKaynnissa) {
            peliKaynnissa = false;
            clearTimeout(updateId);
        }
        alustaRuudukko();
        alustaPeli();
    }

    // Pause-painike
    if (pauseBtn && mx >= pauseBtn.x && mx <= pauseBtn.x + pauseBtn.w &&
        my >= pauseBtn.y && my <= pauseBtn.y + pauseBtn.h) {
        if (peliKaynnissa) {
            pausella = !pausella;
            if (!pausella) {
                update();
            } else {
                clearTimeout(updateId);
            }
            draw(); // päivitetään teksti ("Pause"/"Jatka")
        }
    }
});

// Alusta ruudukko ja madon lähtöasema heti sivun latautuessa
window.addEventListener("load", alustaRuudukko);
