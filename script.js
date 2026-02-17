/**
 * script.js - MyQuranDiary 2026
 * Gabungan logik Silibus (JSON), Data Peserta (JSON), dan Pentashih (JSON)
 */

// Global variable untuk menyimpan data silibus yang dimuatkan dari JSON
let dataSilibus = {};

// 1. Fungsi Memuat Silibus dari fail JSON
async function muatTurunSilibus() {
    try {
        const response = await fetch('silibus.json');
        dataSilibus = await response.json();
        console.log("Silibus berjaya dimuatkan.");
        // Tiada initial call updateSyllabus di sini supaya list tidak kosong secara pelik
    } catch (error) {
        console.error("Gagal memuat fail silibus.json:", error);
    }
}

// 2. Fungsi Memuat Peserta Berdasarkan Jantina (dari JSON)
async function muatTurunPeserta() {
    const jantina = document.getElementById('jantina').value;
    const list = document.getElementById('pesertaList');
    
    if (!jantina) {
        list.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(`peserta_${jantina}.json`);
        const data = await response.json();
        
        list.innerHTML = ""; // Bersihkan senarai lama
        
        data.forEach(p => {
            let option = document.createElement('option');
            option.value = p.nama;
            list.appendChild(option);
        });
        console.log(`Berjaya memuat senarai peserta ${jantina}`);
    } catch (error) {
        console.error("Gagal memuat data peserta:", error);
    }
}

// 3. Fungsi Memuat Pentashih (dari JSON)
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
        console.log("Senarai pentashih berjaya dimuatkan.");
    } catch (error) {
        console.error("Gagal memuat data pentashih:", error);
    }
}

// 4. Fungsi Kemaskini Senarai Surah mengikut Tahap
function updateSyllabus() {
    const tahap = document.getElementById('tahap').value;
    const list = document.getElementById('surahList');
    
    if (!list) return;
    list.innerHTML = "";
    
    // Semak jika tahap wujud dalam dataSilibus yang dimuatkan
    if(dataSilibus[tahap]) {
        dataSilibus[tahap].forEach(surah => {
            let option = document.createElement('option');
            option.value = surah;
            list.appendChild(option);
        });
    }
}

// 5. Logik Paparan Input Ayat (Variasi Rekod)
function toggleAyatField() {
    const mod = document.getElementById('modRekod').value;
    const field = document.getElementById('ayatField');
    if (field) {
        field.style.display = (mod === 'julat') ? 'block' : 'none';
    }
}

// 6. Update UI untuk Slider Rating (Fasohah & Tajwid)
const fasohahInput = document.getElementById('fasohah');
const tajwidInput = document.getElementById('tajwid');

if(fasohahInput) {
    fasohahInput.oninput = function() { 
        document.getElementById('valFasohah').innerText = this.value; 
    }
}
if(tajwidInput) {
    tajwidInput.oninput = function() { 
        document.getElementById('valTajwid').innerText = this.value; 
    }
}

// 7. Form Submit (Integrasi Simulasi)
const hafazanForm = document.getElementById('hafazanForm');
if (hafazanForm) {
    hafazanForm.onsubmit = function(e) {
        e.preventDefault();
        
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

        console.log("Data sedia untuk dihantar:", formData);
        alert(`Berjaya! Rekod hafazan ${formData.nama} telah direkodkan oleh Ustaz/Ustazah ${formData.guru}.`);
        
        // Sedia untuk fetch(GOOGLE_SCRIPT_URL, ...)
    };
}

// 8. Initial Call - Dijalankan apabila window siap dimuatkan
window.onload = async function() {
    // Jalankan muat turun data secara selari
    await Promise.all([
        muatTurunSilibus(),
        muatTurunPentashih()
    ]);
    console.log("Aplikasi MyQuranDiary sedia digunakan.");
};
