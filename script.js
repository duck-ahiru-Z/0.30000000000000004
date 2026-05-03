let currentInput = '';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;

const display = document.getElementById('display');
const previousDisplay = document.getElementById('previous-display');

function updateDisplay(value) {
    display.textContent = value;
    
  
    if (value.toString().length > 10) {
        display.classList.add('long-text');
    } else {
        display.classList.remove('long-text');
    }

    if (operator != null) {
        let opString = operator;
        if (operator === '*') opString = '×';
        if (operator === '/') opString = '÷';
        previousDisplay.textContent = `${previousInput} ${opString}`;
    } else {
        previousDisplay.textContent = '';
    }
}

function clearDisplay() {
    currentInput = '';
    previousInput = '';
    operator = null;
    updateDisplay('0');
}


function deleteNumber() {
    if (shouldResetScreen) return;
    currentInput = currentInput.toString().slice(0, -1);
    if (currentInput === '') currentInput = '0';
    updateDisplay(currentInput);
}

function appendNumber(number) {
    if (shouldResetScreen) {
        currentInput = '';
        shouldResetScreen = false;
    }
    if (number === '.' && currentInput.includes('.')) return;
    if (currentInput === '' && number === '.') currentInput = '0';
    
    currentInput = currentInput.toString() + number.toString();
    if (currentInput !== '0' && currentInput.startsWith('0') && !currentInput.startsWith('0.')) {
        currentInput = currentInput.slice(1);
    }
    
    updateDisplay(currentInput || '0');
}

function appendOperator(op) {
    if (currentInput === '') return;
    if (previousInput !== '') {
        calculate();
    }
    operator = op;
    previousInput = currentInput;
    shouldResetScreen = true;
    updateDisplay(currentInput); 
}

function calculate() {
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) return;

    // JavaScriptの純粋な計算処理（丸め処理なし）
    switch (operator) {
        case '+': computation = prev + current; break;
        case '-': computation = prev - current; break;
        case '*': computation = prev * current; break;
        case '/': computation = prev / current; break;
        default: return;
    }

    currentInput = computation.toString();
    operator = null;
    previousInput = '';
    shouldResetScreen = true;
    updateDisplay(currentInput);
}


document.addEventListener('keydown', (e) => {
    if (/[0-9\.]/.test(e.key)) appendNumber(e.key);
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') appendOperator(e.key);
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    }
    if (e.key === 'Backspace') deleteNumber();
    if (e.key === 'Escape') clearDisplay();
});



display.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(display.textContent);
        display.classList.add('copied');
        setTimeout(() => display.classList.remove('copied'), 200); 
    } catch (err) {
        console.error('コピーに失敗しました', err);
    }
});

document.addEventListener('paste', (e) => {
    let pasteData = (e.clipboardData || window.clipboardData).getData('text');
    pasteData = pasteData.trim();
    const pastedNumber = parseFloat(pasteData);
    
    if (!isNaN(pastedNumber) && isFinite(pastedNumber)) {
        if (shouldResetScreen) {
            currentInput = '';
            shouldResetScreen = false;
        }
        
        if (currentInput === '0' || currentInput === '') {
            currentInput = pasteData;
        } else {
            currentInput += pasteData;
        }
        
        updateDisplay(currentInput);
    }
});