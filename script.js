let startTime, currentText, timerInterval, timeLeft = 30;

function startTyping() {
    document.getElementById('startButton').disabled = true;
    document.getElementById('resetButton').disabled = false;
    timeLeft = parseInt(document.getElementById('timeSelect').value);

    document.getElementById('timerLabel').innerText = `Time left: ${timeLeft}s`;
    

    document.getElementById('userInput').value = "";
    document.getElementById('resultLabel').innerText = "";
    generateNewText();
    

    startTime = new Date().getTime();
    

    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    document.getElementById('timerLabel').innerText = `Time left: ${timeLeft}s`;
    

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        document.getElementById('userInput').disabled = true;
        displayResults();
    }
}

async function generateNewText() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        if (!response.ok) {
            throw new Error("Failed to fetch quote");
        }
        const data = await response.json();
        currentText = data.content;
    } catch (error) {
        console.error("Error fetching quote:", error);
        currentText = "Typing challenge: The quick brown fox jumps over the lazy dog.";
    }
    document.getElementById('textDisplay').innerText = currentText;
    document.getElementById('userInput').value = "";
}


async function generateNewText() {
    currentText = await fetchSampleText();
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
    document.getElementById('history').innerHTML = "<strong>Typing History:</strong><br>"; 
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
    const elapsedTime = (new Date().getTime() - startTime) / 1000; 

    const wpm = calculateWPM(typedText, elapsedTime);
    const accuracy = calculateAccuracy(typedText);
    
    document.getElementById('resultLabel').innerText = `WPM: ${wpm.toFixed(2)}, Accuracy: ${accuracy.toFixed(2)}%`;


    saveTypingHistory(wpm.toFixed(2), accuracy.toFixed(2));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').addEventListener('click', startTyping);
    document.getElementById('resetButton').addEventListener('click', resetTyping);
});
