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

// Управление модальным окном
const feedbackModal = document.getElementById('feedbackModal');

const showModal = () => feedbackModal.style.display = 'block';
const hideModal = () => feedbackModal.style.display = 'none';

document.querySelector('.feedback-button').addEventListener('click', showModal);
document.querySelector('.close-btn').addEventListener('click', hideModal);
window.addEventListener('click', (e) => e.target === feedbackModal && hideModal());

// Обработка формы
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
        setTimeout(hideModal, 1500);
    } catch (error) {
        showFormMessage(`Ошибка: ${error.message}`, 'red');
    }
});

function showFormMessage(text, color) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = `<p style="color: ${color};">${text}</p>`;
    setTimeout(() => messageDiv.innerHTML = '', 3000);
}