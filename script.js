let startTime, currentText, timerInterval, timeLeft = 30;

function startTyping() {
    // Menonaktifkan tombol Start dan mengaktifkan tombol Reset
    document.getElementById('startButton').disabled = true;
    document.getElementById('resetButton').disabled = false;
    
    // Mengambil waktu yang dipilih dari dropdown
    timeLeft = parseInt(document.getElementById('timeSelect').value);
    
    // Menampilkan waktu yang dipilih di timer
    document.getElementById('timerLabel').innerText = `Time left: ${timeLeft}s`;
    
    // Menghapus input sebelumnya dan memulai timer
    document.getElementById('userInput').value = "";
    document.getElementById('resultLabel').innerText = "";
    generateNewText();
    
    // Menyimpan waktu mulai
    startTime = new Date().getTime();
    
    // Memulai timer interval
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    document.getElementById('timerLabel').innerText = `Time left: ${timeLeft}s`;
    
    // Ketika waktu habis, berhenti
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        document.getElementById('userInput').disabled = true;
        displayResults();  // Menampilkan hasil WPM dan akurasi
    }
}

async function fetchSampleText() {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    return data.content; // Ambil konten dari API response
}

async function generateNewText() {
    currentText = await fetchSampleText(); // Mengambil teks acak dari API
    document.getElementById('textDisplay').innerText = currentText;
    document.getElementById('userInput').value = "";
}

document.getElementById('userInput').addEventListener('input', () => {
    checkTyping();
});

function checkTyping() {
    const typedText = document.getElementById('userInput').value.trim();
    let correctText = '';
    let incorrectText = '';

    // Pengecekan karakter per karakter
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === currentText[i]) {
            correctText += typedText[i];
        } else {
            incorrectText += typedText[i];
        }
    }
    
    // Menampilkan karakter yang benar dan salah
    document.getElementById('textDisplay').innerHTML = `<span style="color: green">${correctText}</span><span style="color: red">${incorrectText}</span>${currentText.slice(typedText.length)}`;

    if (typedText === currentText.trim()) {
        generateNewText();
    }
}

function saveTypingHistory(wpm, accuracy) {
    const historyDiv = document.getElementById('history');
    const historyItem = document.createElement('div');
    historyItem.innerHTML = `WPM: ${wpm}, Accuracy: ${accuracy}%`;
    historyDiv.appendChild(historyItem);
}

function resetTyping() {
    document.getElementById('startButton').disabled = false;
    document.getElementById('textDisplay').innerText = "Click Start to begin!";
    document.getElementById('userInput').value = "";
    document.getElementById('resultLabel').innerText = "";
    document.getElementById('userInput').disabled = false;
    clearInterval(timerInterval);
    document.getElementById('timerLabel').innerText = "";
    document.getElementById('history').innerHTML = "<strong>Typing History:</strong><br>"; // Clear history
}

function calculateWPM(typedText, elapsedTime) {
    const words = typedText.split(" ").length;
    return (words / elapsedTime) * 60;
}

function calculateAccuracy(typedText) {
    const correctChars = [...typedText].filter((char, i) => char === currentText[i]).length;
    return (correctChars / currentText.length) * 100;
}

function displayResults() {
    const typedText = document.getElementById('userInput').value.trim();
    const elapsedTime = (new Date().getTime() - startTime) / 1000; // Menghitung waktu yang telah berlalu

    const wpm = calculateWPM(typedText, elapsedTime);
    const accuracy = calculateAccuracy(typedText);
    
    // Menampilkan hasil WPM dan Akurasi
    document.getElementById('resultLabel').innerText = `WPM: ${wpm.toFixed(2)}, Accuracy: ${accuracy.toFixed(2)}%`;

    // Menyimpan hasil dalam riwayat
    saveTypingHistory(wpm.toFixed(2), accuracy.toFixed(2));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').addEventListener('click', startTyping);
    document.getElementById('resetButton').addEventListener('click', resetTyping);
});
