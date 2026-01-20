document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const shiftInput = document.getElementById('shift-input');
    const btnUp = document.getElementById('shift-up');
    const btnDown = document.getElementById('shift-down');
    const btnEncrypt = document.getElementById('encrypt-btn');
    const btnDecrypt = document.getElementById('decrypt-btn');
    const btnCopy = document.getElementById('copy-btn');
    const btnClear = document.getElementById('clear-btn');
    const themeBtns = document.querySelectorAll('.theme-btn');

    let currentShift = 3;

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const theme = btn.getAttribute('data-set-theme');
            document.body.setAttribute('data-theme', theme);
        });
    });

    function updateShiftDisplay() {
        shiftInput.value = currentShift;
    }

    btnUp.addEventListener('click', () => {
        currentShift++;
        updateShiftDisplay();
    });

    btnDown.addEventListener('click', () => {
        currentShift--;
        updateShiftDisplay();
    });

    shiftInput.addEventListener('change', (e) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val)) currentShift = val;
    });

    function caesarCipher(text, shift) {
        const s = shift < 0 ? 26 + (shift % 26) : shift;
        
        return text.split('').map(char => {
            if (char.match(/[a-z]/i)) {
                const code = char.charCodeAt(0);
                const isUpperCase = code >= 65 && code <= 90;
                const base = isUpperCase ? 65 : 97;
                
                return String.fromCharCode(((code - base + s) % 26) + base);
            }
            return char;
        }).join('');
    }

    function process(mode) {
        const text = inputText.value;
        if (!text) return;

        const shiftAmount = mode === 'encrypt' ? currentShift : -currentShift;
        const result = caesarCipher(text, shiftAmount);

        animateText(result);
    }

    function animateText(finalText) {
        outputText.classList.remove('placeholder');
        outputText.textContent = finalText;
        
        const wrapper = document.querySelector('.result-wrapper');
        wrapper.style.borderColor = 'var(--primary-color)';
        setTimeout(() => {
            wrapper.style.borderColor = 'var(--glass-border)';
        }, 300);
    }

    btnEncrypt.addEventListener('click', () => process('encrypt'));
    btnDecrypt.addEventListener('click', () => process('decrypt'));

    btnClear.addEventListener('click', () => {
        inputText.value = "";
        outputText.textContent = "Result will appear here...";
        outputText.classList.add('placeholder');
    });

    btnCopy.addEventListener('click', () => {
        const text = outputText.textContent;
        if (text && !outputText.classList.contains('placeholder')) {
            navigator.clipboard.writeText(text);
            
            const originalIcon = btnCopy.innerHTML;
            btnCopy.innerHTML = `<i class="ph-bold ph-check"></i> Copied`;
            btnCopy.style.color = 'var(--primary-color)';
            
            setTimeout(() => {
                btnCopy.innerHTML = originalIcon;
                btnCopy.style.color = '';
            }, 2000);
        }
    });
});
