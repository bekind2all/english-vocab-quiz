const SHEET_ID = '1xQyEY0SD9NpApKhof_Y85tXVdrkaCoaCD_ltTs6h-6w';
const SHEET_NAME = 'Sheet1';
const SHEET_RANGE = 'B2:D';

let currentWord = '';
let currentMeaning = '';
let currentExample = '';

async function fetchSheetData() {
    try {
        const response = await fetch(
            `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}&range=${SHEET_RANGE}`
        );
        const csvText = await response.text();
        // CSV 파싱
        const rows = csvText.split('\n').map(row => {
            // 쉼표로 구분하되, 쌍따옴표 안의 쉼표는 무시
            const matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            return matches.map(cell => cell.replace(/^"|"$/g, ''));
        });
        return rows.map(row => ({
            word: row[0] || '',
            meaning: row[1] || '',
            example: row[2] || ''
        }));
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        return [];
    }
}

async function loadNewQuestion() {
    try {
        const data = await fetchSheetData();
        if (data.length === 0) {
            alert('데이터를 불러오는 데 실패했습니다.');
            return;
        }

        const randomIndex = Math.floor(Math.random() * data.length);
        const question = data[randomIndex];
        
        currentWord = question.word;
        currentMeaning = question.meaning;
        currentExample = question.example;
        
        document.querySelector('.meaning').textContent = question.meaning;
        document.getElementById('answer').value = '';
        document.querySelector('.result').style.display = 'none';
    } catch (error) {
        console.error('Error loading question:', error);
        alert('데이터를 불러오는 데 실패했습니다.');
    }
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value;
    const correct = userAnswer.toLowerCase().trim() === currentWord.toLowerCase().trim();
    
    const resultDiv = document.querySelector('.result');
    resultDiv.className = 'result ' + (correct ? 'correct' : 'incorrect');
    
    const messages = correct ? [
        "대단해! 👏 넌 정말 똑똑하구나!",
        "완벽해! ⭐ 열심히 공부한 게 보여!",
        "와우! 🌟 너의 실력이 날로 늘어나고 있어!"
    ] : [
        "괜찮아! 💪 도전하는 자세가 멋져!",
        "아쉽지만 다음에 더 잘할 수 있을 거야! 🌈",
        "실수는 배움의 기회야! ✨ 다시 한번 해보자!"
    ];
    
    const message = messages[Math.floor(Math.random() * messages.length)];
    document.querySelector('.message').textContent = message;
    
    // 단어 정보 표시
    const wordInfoDiv = document.querySelector('.word-meaning');
    const exampleDiv = document.querySelector('.example');
    
    if (wordInfoDiv && exampleDiv) {
        wordInfoDiv.textContent = `${currentWord} : ${currentMeaning}`;
        exampleDiv.textContent = currentExample;
    } else {
        console.error('Word info or example div not found');
    }
    
    resultDiv.style.display = 'block';
    setTimeout(loadNewQuestion, 3000);
}

// Enter 키로 정답 제출
document.getElementById('answer').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// 초기 문제 로드
loadNewQuestion();
