// Data Silibus dari Image/Excel yang diberikan
const silibus = {
    "1-2": ["Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Maarij"],
    "3-5": ["An-Naba", "An-Naziat", "Abasa", "At-Takwir"],
    "6": ["Al-Kahfi", "Yasin", "Ar-Rahman", "Al-Waqiah"]
};

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

function toggleAyatField() {
    const mod = document.getElementById('modRekod').value;
    const field = document.getElementById('ayatField');
    field.style.display = (mod === 'julat') ? 'block' : 'none';
}

// Update UI untuk slider rating
document.getElementById('fasohah').oninput = function() { document.getElementById('valFasohah').innerHTML = this.value; }
document.getElementById('tajwid').oninput = function() { document.getElementById('valTajwid').innerHTML = this.value; }

// Initial call
updateSyllabus();

// Form Submit (Nanti disambung ke GAS)
document.getElementById('hafazanForm').onsubmit = function(e) {
    e.preventDefault();
    alert("Data sedia untuk dihantar ke Google Sheets!");
    // Logic fetch() ke GAS akan diletakkan di sini
};
