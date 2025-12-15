class Calculator {
    #currentValue = '0';
    #previousValue = null;
    #operation = null;
    #result = null;
    #calculated = false;
    #romanMode = false;
    #maxLength = 12;

    constructor(display, btnSection, digitButtons) {
        this.display = display;
        this.btnSection = btnSection;
        this.digitButtons = digitButtons;

        this.ROMAN_DIGITS = {
            '0': 'N',
            '1': 'I',
            '2': 'II',
            '3': 'III',
            '4': 'IV',
            '5': 'V',
            '6': 'VI',
            '7': 'VII',
            '8': 'VIII',
            '9': 'IX'
        };

        this.displayOutput();
    }

    #isLimitReached() {
        return !this.#calculated && this.#currentValue.length >= this.#maxLength;
    }

    #resetCurrentValueTo(digit) {
        this.#currentValue = digit;
        this.#calculated = false;
        this.displayOutput();
    }

    displayOutput() {
        this.display.textContent = this.#currentValue;
    }

    processDigit(digit) {
        if (this.#isLimitReached()) return;

        if (this.#calculated) {
            this.#resetCurrentValueTo(digit);
            return;
        }

        this.#currentValue = this.#currentValue === '0' ? digit : this.#currentValue + digit; 

        this.displayOutput();
    }

    processOperation(operation) {
        if (this.#operation && this.#previousValue !== null) {
            this.calculate();
        }

        this.#operation = operation;
        this.#previousValue = this.#currentValue;
        this.#currentValue = '0'
    }

    addFloat() {
        if (this.#isLimitReached()) return;

        if (this.#currentValue.includes('.')) return;

        if (this.#calculated) {
            this.#resetCurrentValueTo('0.')
            return;
        }    

        this.#currentValue = this.#currentValue === '0' ? '0.' : this.#currentValue + '.';

        this.displayOutput();
    }

    calculate () {
        // console.log('inside operation')
        const num1 = parseFloat(this.#previousValue)
        const num2 = parseFloat(this.#currentValue)
        // console.log(num1, num2)

        if (isNaN(num1) || isNaN(num2)) return;

        let result;

        switch (this.#operation) {
            case '+': 
                result = num1 + num2;
                break;

            case '-': 
                result = num1 - num2;
                break;

            case '*': 
                result = num1 * num2;
                break;

            case '/':
                if (num2 === 0) {
                    result = 'Error';
                    break;
                } else {
                    result = num1 / num2;
                    break;
                }       

            default: 
                return;
        }

        this.#result = result;
        this.#currentValue = String(result).slice(0, 12);
        this.#previousValue = null;
        this.#operation = null;
        this.#calculated = true;

        this.displayOutput();
    }

    clearAll() {
        this.#currentValue = '0';
        this.#previousValue = null;
        this.#operation = null;
        this.#result = null;
        this.#calculated = false;

        this.displayOutput();
    }

    deleteLastDigit() {
        if (this.#calculated) return;

        this.#currentValue = this.#currentValue.slice(0, -1) || '0';
        this.displayOutput();
    }

    toggleRomanMode(on) {
        this.#romanMode = !this.#romanMode;

        this.digitButtons.forEach(btn => {
            const arabic = btn.dataset.digit;
            btn.textContent = this.#romanMode ? this.ROMAN_DIGITS[arabic] : arabic;
        });
        
        this.btnSection.classList.toggle('roman-mode', this.#romanMode); 
    }
}

const btnSection = document.getElementById('btn_section');
const display = document.getElementById('display');
const btnRomanMode = document.getElementById('roman_mode');
const digitButtons = document.querySelectorAll('[data-digit]');
const CLEAR_KEYS = [0x0063, 0x0043, 0x0441, 0x0421]

const calc = new Calculator(display, btnSection, digitButtons)

btnSection.addEventListener('click', function(event) {
    const btn = event.target.closest('.btn')    

    if (!btn) return;

    switch (true) {
        case btn.dataset.digit !== undefined:
            calc.processDigit(btn.dataset.digit);
            break;

        case btn.dataset.float !== undefined:
            calc.addFloat();
            break;

        case btn.dataset.operation !== undefined:
            calc.processOperation(btn.dataset.operation);
            break;
        
        case btn.dataset.equals !== undefined:
            calc.calculate();
            break;

        case btn.dataset.clear !== undefined:
            calc.clearAll();
            break;

        case btn.dataset.delete !== undefined:
            calc.deleteLastDigit();
            break;

        case btn.dataset.roman !== undefined:
            calc.toggleRomanMode();
            break;
    }
})

document.addEventListener('keydown', function(event) {
    const key = event.key;
    const operations = ['+', '-', '*', '/']
    const numbers = '0123456789';

    switch (true) {
        case numbers.includes(key):
            calc.processDigit(key);
            event.preventDefault();
            break;

        case operations.includes(key): 
            calc.processOperation(key);
            event.preventDefault();
            break;

        case key === '.' || key === ',':
            calc.addFloat();
            event.preventDefault();
            break;

        case key === 'Enter' || key === '=': 
            calc.calculate();
            event.preventDefault();
            break;

        case key === 'Escape' || CLEAR_KEYS.includes(key.codePointAt(0)):
            calc.clearAll();
            event.preventDefault();
            break;

        case key === 'Backspace': 
            calc.deleteLastDigit();
            event.preventDefault();
            break;

        default:
            return;
    }
})