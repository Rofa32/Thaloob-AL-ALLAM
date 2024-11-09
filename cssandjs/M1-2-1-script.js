document.addEventListener('DOMContentLoaded', () => {
    let audio = new Audio(audioFiles["samak"]);

    document.getElementById('play-sound').addEventListener('click', function() {
        audio.play(); 
    });

    const choicesContainer = document.getElementById('choices-container');
    const message = document.getElementById('message');
    let currentStage = 1;

    function updateStage(audioKey, optionsHtml) {
        audio.src = audioFiles[audioKey];
        choicesContainer.innerHTML = optionsHtml;
        message.textContent = '';
        addChoiceListeners();
    }

    function goToNextStage() {
        if (currentStage === 1) {
            currentStage = 2;
            updateStage("jubn", `
                <button class="choice" data-answer="wrong">عِنَبْ</button>
                <button class="choice" data-answer="correct">جُبُنُّ</button>
                <button class="choice" data-answer="wrong">جَرْس</button>
            `);
        } else if (currentStage === 2) {
            currentStage = 3;
            updateStage("zeeb", `
                <button class="choice" data-answer="correct">ذِئْبٌ</button>
                <button class="choice" data-answer="wrong">ذُرَة</button>
                <button class="choice" data-answer="wrong">ذِراع</button>
            `);
        } else if (currentStage === 3) {
            currentStage = 4;
            updateStage("shams", `
                <button class="choice" data-answer="wrong">شَّكْل</button>
                <button class="choice" data-answer="correct">شَمْسٌ</button>
                <button class="choice" data-answer="wrong">شَمال</button>
            `);
        } else if (currentStage === 4) {
            currentStage = 5;
            updateStage("hisan", `
                <button class="choice" data-answer="correct">حِصانٌ</button>
                <button class="choice" data-answer="wrong">فُستان</button>
                <button class="choice" data-answer="wrong">حِمَار</button>
            `);
        } else {
            message.textContent = 'انتهت اللعبة! أحسنت!';
            message.style.color = 'blue';
            setTimeout(() => {
                window.location.href = '/games/second';
            }, 2000);
        }
    }

    function addChoiceListeners() {
        const choices = document.querySelectorAll('.choice');
        choices.forEach(choice => {
            choice.addEventListener('click', function() {
                const answer = this.getAttribute('data-answer');
                if (answer === 'correct') {
                    this.style.backgroundColor = 'green';
                    message.textContent = 'إجابة صحيحة! أحسنت!';
                    message.style.color = 'green';
                    setTimeout(() => {
                        goToNextStage();
                    }, 1000);
                } else {
                    this.style.backgroundColor = 'red';
                    message.textContent = 'إجابة خاطئة! حاول مرة أخرى.';
                    message.style.color = 'red';
                    setTimeout(() => {
                        this.style.backgroundColor = ''; 
                    }, 2000);
                }
            });
        });
    }

    addChoiceListeners();
});
