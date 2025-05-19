// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        targetElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

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

// Обработка формы обратной связи
document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('feedbackName').value.trim(),
        email: document.getElementById('feedbackEmail').value.trim(),
        message: document.getElementById('feedbackMessage').value.trim()
    };

    try {
        await db.collection('feedback').add({
            ...formData,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
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