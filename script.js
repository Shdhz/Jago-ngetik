let startTime, currentText, timerInterval, timeLeft = 30;
let totalWords = 0;
let totalCorrectChars = 0;
let totalTypedChars = 0;
let totalElapsedTime = 0;
let userName = "";

function getUserName() {
    userName = prompt("Enter your name:");
    if (!userName) {
        userName = "Anonymous";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getUserName();
    document.getElementById('startButton').addEventListener('click', startTyping);
    document.getElementById('resetButton').addEventListener('click', resetTyping);
});

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
        processTypingData(document.getElementById('userInput').value.trim()); 
        displayResults();
    }
}

async function generateNewText() {
    try {
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const targetUrl = encodeURIComponent('https://zenquotes.io/api/quotes/');
        const response = await fetch(`${proxyUrl}${targetUrl}`);
        
        if (!response.ok) {
            throw new Error("Failed to fetch quote");
        }
        
        const data = await response.json();
        const parsedData = JSON.parse(data.contents);
        const randomIndex = Math.floor(Math.random() * parsedData.length);
        currentText = parsedData[randomIndex].q;

    } catch (error) {
        console.error("Error fetching quote:", error);
        currentText = "Typing challenge: The quick brown fox jumps over the lazy dog.";
    }
    
    document.getElementById('textDisplay').innerText = currentText;
    document.getElementById('userInput').value = "";
    document.getElementById('userInput').disabled = false;
    document.getElementById('userInput').focus();
}

document.getElementById('userInput').addEventListener('input', () => {
    checkTyping();
});

function checkTyping() {
    const typedText = document.getElementById('userInput').value;
    let highlightedText = '';

    for (let i = 0; i < currentText.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === currentText[i]) {
                highlightedText += `<span style="color: green">${currentText[i]}</span>`;
            } else {
                highlightedText += `<span style="color: red">${currentText[i]}</span>`;
            }
        } else {
            highlightedText += currentText[i];
        }
    }

    document.getElementById('textDisplay').innerHTML = highlightedText;

    if (typedText.trim() === currentText.trim()) {
        document.getElementById('userInput').disabled = true;
        processTypingData(typedText);
        setTimeout(() => {
            generateNewText();
            document.getElementById('userInput').focus();
        }, 1000);
    }
}

function processTypingData(typedText) {
    if (!typedText) return; 

    const elapsedTime = (new Date().getTime() - startTime) / 1000;
    const elapsedMinutes = elapsedTime / 60;
    if (elapsedMinutes <= 0) return;

    const words = typedText.trim().split(/\s+/).length; 
    const accuracy = calculateAccuracy(typedText, currentText);

    totalWords += words;
    totalElapsedTime += elapsedMinutes;

    startTime = new Date().getTime();

    return accuracy;
}



function saveTypingHistory(wpm, accuracy) {
    const historyDiv = document.getElementById('history');
    const historyItem = document.createElement('div');
    historyItem.innerHTML = `${userName} - WPM: ${wpm}, Accuracy: ${accuracy}%`;
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

    // Reset total statistik
    totalWords = 0;
    totalCorrectChars = 0;
    totalTypedChars = 0;
    totalElapsedTime = 0;
}

function calculateWPM(words, elapsedTime) {
    if (elapsedTime <= 0) return 0; 
    return words / elapsedTime;
}

function calculateAccuracy(typedText, referenceText) {
    const typedWords = typedText.trim().split(/\s+/);
    const referenceWords = referenceText.trim().split(/\s+/);
    
    let correctWords = 0;
    let totalWords = referenceWords.length;

    for (let i = 0; i < typedWords.length; i++) {
        if (typedWords[i] === referenceWords[i]) {
            correctWords++;
        }
    }

    return (correctWords / totalWords) * 100;
}


function displayResults() {
    if (totalElapsedTime <= 0 || totalWords <= 0) {
        document.getElementById('resultLabel').innerText = "No valid typing data available.";
        return;
    }

    const overallWPM = calculateWPM(totalWords, totalElapsedTime);
    const accuracy = calculateAccuracy(document.getElementById('userInput').value.trim(), currentText);

    document.getElementById('resultLabel').innerText = `Total WPM: ${overallWPM.toFixed(0)}, Accuracy: ${accuracy.toFixed(0)}%`;
    saveTypingHistory(overallWPM.toFixed(0), accuracy.toFixed(0));
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').addEventListener('click', startTyping);
    document.getElementById('resetButton').addEventListener('click', resetTyping);
});
