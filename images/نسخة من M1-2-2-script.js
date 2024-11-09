document.addEventListener('DOMContentLoaded', () => {
    let currentStage = 1;
    let currentSound = '';
    const message = document.getElementById('message');
    const soundContainer = document.getElementById('sound-container');
    const choicesContainer = document.getElementById('choices-container');
    let correctMatches = 0;

    function loadStage(stage) {
        let audioOptions, choiceOptions;
        
        if (stage === 1) {
            audioOptions = ['b', 't', 'th', 'j'];
            choiceOptions = ['ب', 'ت', 'ث', 'ج'];
        } else if (stage === 2) {
            audioOptions = ['dubb', 'deek', 'delfeen', 'roman'];
            choiceOptions = ['دب', 'ديك', 'دلفين', 'رمان'];
        } else {
            message.textContent = 'انتهت اللعبة! أحسنت!';
            message.style.color = 'blue';
            setTimeout(() => {
                window.location.href = '/games/third'; // الانتقال إلى اللعبة الثالثة
            }, 2000);
            return;
        }

        soundContainer.innerHTML = '';
        choicesContainer.innerHTML = '';
        message.textContent = '';
        correctMatches = 0;

        audioOptions.forEach((audioKey, index) => {
            const soundBox = document.createElement('div');
            soundBox.classList.add('sound-box');
            soundBox.setAttribute('data-answer', choiceOptions[index]);

            const audioIcon = document.createElement('img');
            audioIcon.src = audioIconURL; // استخدام مسار الأيقونة المعرّف في HTML
            audioIcon.alt = 'تشغيل الصوت';

            soundBox.appendChild(audioIcon);

            // تشغيل الصوت عند النقر على أيقونة الصوت
            soundBox.addEventListener('click', () => {
                const audio = new Audio(audioFiles[audioKey]); // استخدام المسار المعرّف في HTML
                audio.play();
                currentSound = choiceOptions[index];
            });

            soundContainer.appendChild(soundBox);
        });

        // إنشاء الأزرار الخاصة بالاختيارات
        choiceOptions.forEach(choice => {
            const choiceButton = document.createElement('div');
            choiceButton.classList.add('choice');
            choiceButton.textContent = choice;
            choiceButton.setAttribute('draggable', true);
            choiceButton.setAttribute('data-word', choice);

            choiceButton.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text', choice);
            });

            choicesContainer.appendChild(choiceButton);
        });

        // إعداد السحب والإفلات
        soundContainer.querySelectorAll('.sound-box').forEach(soundBox => {
            soundBox.addEventListener('dragover', (event) => {
                event.preventDefault();
                if (currentSound) {
                    soundBox.classList.add('drag-over');
                }
            });

            soundBox.addEventListener('dragleave', () => {
                soundBox.classList.remove('drag-over');
            });

            soundBox.addEventListener('drop', (event) => {
                event.preventDefault();
                const draggedChoice = event.dataTransfer.getData('text');

                if (draggedChoice === currentSound && draggedChoice === soundBox.getAttribute('data-answer')) {
                    soundBox.textContent = draggedChoice;
                    currentSound = '';
                    correctMatches++;

                    const draggedElement = document.querySelector(`.choice[data-word="${draggedChoice}"]`);
                    if (draggedElement) {
                        draggedElement.style.display = 'none';
                    }

                    checkForNextStage();
                }
                soundBox.classList.remove('drag-over');
            });
        });
    }

    // التحقق من المرحلة والانتقال إلى المرحلة التالية
    function checkForNextStage() {
        if (correctMatches === 4) {
            setTimeout(() => {
                currentStage++;
                loadStage(currentStage);
            }, 1000);
        }
    }

    loadStage(currentStage);
});
