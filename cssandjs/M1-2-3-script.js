document.addEventListener('DOMContentLoaded', () => {
    const words = document.querySelectorAll('.word-box');
    const imageContainers = document.querySelectorAll('.image-box');
    let currentPhase = 1;

    words.forEach(word => {
        word.addEventListener('dragstart', dragStart);
    });

    imageContainers.forEach(image => {
        image.addEventListener('dragover', dragOver);
        image.addEventListener('drop', drop);
    });

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const wordId = e.dataTransfer.getData('text/plain');
        const wordElement = document.getElementById(wordId);
        const imageContainer = e.target.closest('.image-box');

        if (isMatch(wordId, imageContainer.id)) {
            imageContainer.appendChild(wordElement);
            wordElement.style.position = 'absolute';
            wordElement.style.top = '50%';
            wordElement.style.left = '50%';
            wordElement.style.transform = 'translate(-50%, -50%)';
            wordElement.style.borderColor = 'green';
            showMessage('مطابقة صحيحة! أحسنت!', true);
            disableDragging(wordElement);  // استدعاء الوظيفة لتعطيل السحب

            if (isPhaseComplete()) {
                setTimeout(goToNextPhase, 1000);
            }
        } else {
            showMessage('مطابقة خاطئة! حاول مرة أخرى!', false);
        }
    }

    function isMatch(wordId, imageId) {
        const matches = {
            'word-ant': 'ant',
            'word-frog': 'frog',
            'word-book': 'book',
            'word-pumpkin': 'pumpkin',
            'word-apple': 'apple',
            'word-tree': 'tree',
            'word-palm': 'palm',
            'word-olive': 'olive',
            'word-corn': 'corn'
        };
        return matches[wordId] === imageId;
    }

    function isPhaseComplete() {
        if (currentPhase === 1) {
            return document.getElementById('word-ant').parentElement.id === 'ant' &&
                   document.getElementById('word-frog').parentElement.id === 'frog';
        } else if (currentPhase === 2) {
            return document.getElementById('word-book').parentElement.id === 'book' &&
                   document.getElementById('word-pumpkin').parentElement.id === 'pumpkin' &&
                   document.getElementById('word-apple').parentElement.id === 'apple';
        } else if (currentPhase === 3) {
            return document.getElementById('word-tree').parentElement.id === 'tree' &&
                   document.getElementById('word-palm').parentElement.id === 'palm' &&
                   document.getElementById('word-olive').parentElement.id === 'olive' &&
                   document.getElementById('word-corn').parentElement.id === 'corn';
        }
        return false;
    }

    function goToNextPhase() {
        if (isPhaseComplete()) {
            const currentPhaseElement = document.getElementById(`phase-${currentPhase}`);
            if (currentPhaseElement) {
                currentPhaseElement.style.display = 'none';
            }

            currentPhase++;

            const nextPhaseElement = document.getElementById(`phase-${currentPhase}`);
            if (nextPhaseElement) {
                nextPhaseElement.style.display = 'block';
            } else {
                const gameContainer = document.getElementById('game-container');
                gameContainer.innerHTML = `
                    <h1>مبروك!</h1>
                    <p>لقد أنهيت جميع المراحل. أحسنت!</p>
                    <button onclick="window.location.href='/games/first'">إعادة اللعب</button>
                `;
                gameContainer.style.textAlign = 'center';
            }
        }
    }

    function disableDragging(element) {
        element.setAttribute('draggable', 'false');
        element.style.cursor = 'default';  // تغيير شكل المؤشر للإشارة إلى عدم القدرة على السحب
    }

    function showMessage(message, success) {
        const messageBox = document.createElement('div');
        messageBox.classList.add('message-box');
        messageBox.textContent = message;
        document.body.appendChild(messageBox);

        setTimeout(() => {
            messageBox.remove();
        }, 3000);
    }
});
