/**
 * script.js - MyQuranDiary 2026
 * Gabungan logik Silibus dan Data Peserta (JSON)
 */

// 1. Data Silibus Hafazan
const silibus = {
    "1-2": ["Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Maarij", "Al-Qiyamah", "Al-Insan", "Al-Mursalat"],
    "3-5": ["An-Naba", "An-Naziat", "Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq"],
    "6": ["Al-Kahfi", "Yasin", "Ar-Rahman", "Al-Waqiah"]
};

// 2. Fungsi Memuat Peserta Berdasarkan Jantina (dari JSON)
async function muatTurunPeserta() {
    const jantina = document.getElementById('jantina').value;
    const list = document.getElementById('pesertaList');
    
    // Elakkan ralat jika user belum pilih jantina
    if (!jantina) return;

    try {
        const response = await fetch(`peserta_${jantina}.json`);
        const data = await response.json();
        
        list.innerHTML = ""; // Bersihkan senarai lama
        
        data.forEach(p => {
            let option = document.createElement('option');
            option.value = p.nama;
            // Kita simpan info tambahan dalam label/text jika perlu
            list.appendChild(option);
        });
        console.log(`Berjaya memuat senarai peserta ${jantina}`);
    } catch (error) {
        console.error("Gagal memuat data peserta:", error);
    }
}

// 3. Fungsi Kemaskini Senarai Surah mengikut Tahap
function updateSyllabus() {
    const tahap = document.getElementById('tahap').value;
    const list = document.getElementById('surahList');
    list.innerHTML = "";
    
    silibus[tahap].forEach(surah => {
        let option = document.createElement('option');
        option.value = surah;
        list.appendChild(option);
    });
}

// 4. Logik Paparan Input Ayat (Variasi Rekod)
function toggleAyatField() {
    const mod = document.getElementById('modRekod').value;
    const field = document.getElementById('ayatField');
    field.style.display = (mod === 'julat') ? 'block' : 'none';
}

// 5. Update UI untuk Slider Rating (Fasohah & Tajwid)
// Gunakan event listener supaya lebih kemas
const fasohahInput = document.getElementById('fasohah');
const tajwidInput = document.getElementById('tajwid');

if(fasohahInput) {
    fasohahInput.oninput = function() { document.getElementById('valFasohah').innerHTML = this.value; }
}
if(tajwidInput) {
    tajwidInput.oninput = function() { document.getElementById('valTajwid').innerHTML = this.value; }
}

// 6. Form Submit (Integrasi ke GAS pada masa depan)
document.getElementById('hafazanForm').onsubmit = function(e) {
    e.preventDefault();
    
    // Contoh pengumpulan data
    const formData = {
        tarikh: new Date().toLocaleString(),
        nama: document.getElementById('nama').value,
        jantina: document.getElementById('jantina').value,
        surah: document.getElementById('surah').value,
        mod: document.getElementById('modRekod').value,
        ayat: document.getElementById('julatAyat').value || "Penuh",
        fasohah: document.getElementById('fasohah').value,
        tajwid: document.getElementById('tajwid').value,
        guru: document.getElementById('guru').value
    };

    console.log("Data sedia:", formData);
    alert(`Rekod untuk ${formData.nama} berjaya disimpan! (Simulasi)`);
    
    // Reset form selepas hantar
    // this.reset();
};

// 7. Initial Call (Lari sekali semasa web dibuka)
updateSyllabus();
