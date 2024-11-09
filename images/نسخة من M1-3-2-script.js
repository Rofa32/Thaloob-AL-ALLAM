document.addEventListener('DOMContentLoaded', () => {
    const numberImages = document.querySelectorAll('.number-box img');
    const imageContainers = document.querySelectorAll('.image-box');
    const matches = {
        'num5.png': 'ladybugs.png',
        'num9.png': 'owls.png',
        'num1.png': 'bird.png',
        'num2.png': 'foxes.png'
    };
    // إعداد السحب والإفلات
    numberImages.forEach(numberImage => {
        numberImage.addEventListener('dragstart', dragStart);
    });

    imageContainers.forEach(image => {
        image.addEventListener('dragover', dragOver);
        image.addEventListener('drop', drop);
    });

    function dragStart(e) {
        const numberImgSrc = e.target.getAttribute('src');
        e.dataTransfer.setData('text', numberImgSrc);
    }

    function dragOver(e) {
        e.preventDefault(); // السماح بالإفلات
    }

    function drop(e) {
        e.preventDefault();
        const droppedImgSrc = e.dataTransfer.getData('text');
        const imageContainer = e.currentTarget;
        const imageSrc = imageContainer.querySelector('img').getAttribute('src');

        if (isMatch(droppedImgSrc, imageSrc)) {
            imageContainer.style.borderColor = 'green'; // اللون الأخضر للمطابقة الصحيحة
            showMessage('مطابقة صحيحة! أحسنت!', true);
            console.log(matches);
            if (Object.keys(matches).length === 1) {
                console.log("The object is empty.");
                 window.location.href = GO_M1_3_3 ;  // Redirect to the game 
            }
        } else {
            showMessage('مطابقة خاطئة! حاول مرة أخرى!', false);
        }
    }

    // التأكد من أن اسم الصورة يتطابق مع الرقم
    function isMatch(droppedImgSrc, imageSrc) {
        const droppedKey = droppedImgSrc.split('/').pop();
        const imageKey = imageSrc.split('/').pop();
        
        const matchy = matches[droppedKey] === imageKey;
        
        if (matchy) {
            // Remove the matched key from the `matches` object
            delete matches[droppedKey];
        }
        
        return matchy;
    }

    function showMessage(message, success) {
        const messageBox = document.createElement('div');
        messageBox.className = `message-box ${success ? 'success' : 'failure'}`;
        messageBox.textContent = message;
        document.body.appendChild(messageBox);
        setTimeout(() => {
            messageBox.remove();
        }, 2000);
    }
    
    
});
