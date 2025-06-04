// Подсветка текущего раздела
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const { offsetTop: sectionTop, offsetHeight: sectionHeight } = section;
        const id = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
});

// Инициализация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBYtp8zZxppqbx85rie5mwwH_0oUMEDsOI",
    authDomain: "ipviborniy.firebaseapp.com",
    projectId: "ipviborniy",
    storageBucket: "ipviborniy.firebasestorage.app",
    messagingSenderId: "284944613045",
    appId: "1:284944613045:web:aa2252d7f0f14f0ab288fc"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Управление модальными окнами
const agreementModal = document.getElementById('agreementModal');
const feedbackModal = document.getElementById('feedbackModal');

const showAgreementModal = () => agreementModal.style.display = 'block';
const hideAgreementModal = () => agreementModal.style.display = 'none';
const showFeedbackModal = () => feedbackModal.style.display = 'block';
const hideFeedbackModal = () => feedbackModal.style.display = 'none';

document.querySelector('.feedback-button').addEventListener('click', showAgreementModal);
document.querySelector('#agreementModal .close-btn').addEventListener('click', hideAgreementModal);
document.querySelector('#feedbackModal .close-btn').addEventListener('click', hideFeedbackModal);
window.addEventListener('click', (e) => {
    if (e.target === agreementModal) hideAgreementModal();
    if (e.target === feedbackModal) hideFeedbackModal();
});

// Управление чекбоксом согласия
const agreementCheckbox = document.getElementById('agreementCheckbox');
const agreementConfirmBtn = document.getElementById('agreementConfirm');

agreementCheckbox.addEventListener('change', () => {
    agreementConfirmBtn.disabled = !agreementCheckbox.checked;
});

agreementConfirmBtn.addEventListener('click', () => {
    if (agreementCheckbox.checked) {
        hideAgreementModal();
        showFeedbackModal();
    } else {
        showAgreementMessage('Пожалуйста, подтвердите согласие.', 'red');
    }
});

// Обработка формы обратной связи с последовательными ID
document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('feedbackName').value.trim(),
        email: document.getElementById('feedbackEmail').value.trim(),
        message: document.getElementById('feedbackMessage').value.trim(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        // Используем транзакцию для получения и обновления счетчика
        const counterRef = db.collection('metadata').doc('feedbackCounter');
        await db.runTransaction(async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            let currentCount = 0;

            if (!counterDoc.exists) {
                // Если документ счетчика не существует, инициализируем его
                transaction.set(counterRef, { count: 1 });
            } else {
                // Получаем текущий счетчик и увеличиваем его
                currentCount = counterDoc.data().count;
                transaction.update(counterRef, { count: currentCount + 1 });
            }

            // Генерируем ID вида "1record", "2record" и т.д.
            const newRecordId = `${currentCount + 1}record`;

            // Сохраняем документ с пользовательским ID
            transaction.set(db.collection('feedback').doc(newRecordId), formData);
        });

        showFormMessage('Сообщение успешно отправлено!', 'green');
        e.target.reset();
        setTimeout(hideFeedbackModal, 1500);
    } catch (error) {
        showFormMessage(`Ошибка: ${error.message}`, 'red');
    }
});

function showFormMessage(text, color) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = `<p style="color: ${color};">${text}</p>`;
    setTimeout(() => messageDiv.innerHTML = '', 3000);
}

function showAgreementMessage(text, color) {
    const messageDiv = document.getElementById('agreementMessage');
    messageDiv.innerHTML = `<p style="color: ${color};">${text}</p>`;
    setTimeout(() => messageDiv.innerHTML = '', 3000);
}

// Пример: Получение и отображение записей, отсортированных по времени (новые первыми)
function fetchFeedbackSortedByTime() {
    db.collection('feedback')
        .orderBy('createdAt', 'desc')
        .get()
        .then((querySnapshot) => {
            const feedbackList = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                feedbackList.push({
                    id: doc.id,
                    name: data.name,
                    email: data.email,
                    message: data.message,
                    createdAt: data.createdAt ? data.createdAt.toDate().toLocaleString('ru-RU') : 'Нет даты'
                });
            });

        })
        .catch((error) => {
            console.error('Ошибка при получении записей:', error);
        });
}


