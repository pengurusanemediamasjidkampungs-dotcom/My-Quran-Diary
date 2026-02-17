/**
 * script.js - MyQuranDiary 2026
 * Gabungan logik Silibus (JSON), Data Peserta (JSON), dan Pentashih (JSON)
 * Integrasi Google Apps Script untuk simpanan data ke Google Sheets
 */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbylIk3MLzkftf31BMnQHO5rtK9ImcaWYcpom12k84ircZEY44zk4NA11-X5z4rVxfNcdg/exec";

let dataSilibus = {};

async function muatTurunSilibus() {
    try {
        const response = await fetch('silibus.json');
        dataSilibus = await response.json();
        console.log("Silibus berjaya dimuatkan.");
    } catch (error) {
        console.error("Gagal memuat fail silibus.json:", error);
    }
}

async function muatTurunPeserta() {
    const jantina = document.getElementById('jantina').value;
    const list = document.getElementById('pesertaList');
    if (!jantina) { list.innerHTML = ""; return; }

    try {
        const response = await fetch(`peserta_${jantina}.json`);
        const data = await response.json();
        list.innerHTML = ""; 
        data.forEach(p => {
            let option = document.createElement('option');
            option.value = p.nama;
            list.appendChild(option);
        });
    } catch (error) {
        console.error("Gagal memuat data peserta:", error);
    }
}

async function muatTurunPentashih() {
    try {
        const response = await fetch('pentashih.json');
        const data = await response.json();
        const list = document.getElementById('pentashihList');
        if (!list) return;
        list.innerHTML = "";
        data.forEach(g => {
            let option = document.createElement('option');
            option.value = g.nama;
            list.appendChild(option);
        });
    } catch (error) {
        console.error("Gagal memuat data pentashih:", error);
    }
}

function updateSyllabus() {
    const tahap = document.getElementById('tahap').value;
    const list = document.getElementById('surahList');
    if (!list) return;
    list.innerHTML = "";
    if(dataSilibus[tahap]) {
        dataSilibus[tahap].forEach(surah => {
            let option = document.createElement('option');
            option.value = surah;
            list.appendChild(option);
        });
    }
}

function toggleAyatField() {
    const mod = document.getElementById('modRekod').value;
    const field = document.getElementById('ayatField');
    if (field) { field.style.display = (mod === 'julat') ? 'block' : 'none'; }
}

const fasohahInput = document.getElementById('fasohah');
const tajwidInput = document.getElementById('tajwid');
if(fasohahInput) { fasohahInput.oninput = function() { document.getElementById('valFasohah').innerText = this.value; } }
if(tajwidInput) { tajwidInput.oninput = function() { document.getElementById('valTajwid').innerText = this.value; } }

// --- BAHAGIAN PENTING: PENGHANTARAN DATA ---
const hafazanForm = document.getElementById('hafazanForm');
if (hafazanForm) {
    hafazanForm.onsubmit = function(e) {
        e.preventDefault();
        
        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "Menghantar... ⏳";
        btn.disabled = true;

        const formData = {
            tarikh: new Date().toLocaleString('ms-MY'),
            nama: document.getElementById('nama').value,
            jantina: document.getElementById('jantina').value,
            tahap: document.getElementById('tahap').value,
            surah: document.getElementById('surah').value,
            mod: document.getElementById('modRekod').value,
            ayat: document.getElementById('julatAyat').value || "Penuh",
            fasohah: document.getElementById('fasohah').value,
            tajwid: document.getElementById('tajwid').value,
            guru: document.getElementById('guru').value
        };

        // Menggunakan POST dengan mode no-cors
        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: {
                'Content-Type': 'text/plain' // Menghindari isu pre-flight CORS
            },
            body: JSON.stringify(formData)
        })
        .then(() => {
            // Kerana no-cors, kita tidak boleh baca respon, tapi alert akan muncul
            alert(`Alhamdulillah! Rekod hafazan ${formData.nama} telah berjaya dihantar.`);
            btn.innerText = originalText;
            btn.disabled = false;
            hafazanForm.reset(); // Reset form supaya tidak hantar data sama dua kali
            document.getElementById('valFasohah').innerText = "5";
            document.getElementById('valTajwid').innerText = "5";
        })
        .catch(error => {
            console.error('Ralat:', error);
            alert("Ralat sambungan. Sila semak internet anda.");
            btn.innerText = originalText;
            btn.disabled = false;
        });
    };
}

window.onload = async function() {
    await Promise.all([muatTurunSilibus(), muatTurunPentashih()]);
    console.log("Aplikasi MyQuranDiary sedia digunakan.");
};
