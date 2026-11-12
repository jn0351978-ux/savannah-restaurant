const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('#primary-nav');

menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    menuToggle.setAttribute('aria-label', isExpanded ? 'Open navigation' : 'Close navigation');
    primaryNav.classList.toggle('is-open', !isExpanded);
});

primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
        primaryNav.classList.remove('is-open');
    });
});

const reservationForm = document.querySelector('#reservation-form');
const reservationDate = reservationForm.elements.date;
const reservationPhone = reservationForm.elements.phone;
const formNote = document.querySelector('#form-note');
const whatsappNumber = '254727622603';
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

reservationDate.min = localToday;

reservationPhone.addEventListener('input', () => {
    const digits = reservationPhone.value.replace(/\D/g, '');
    reservationPhone.setCustomValidity(
        !reservationPhone.value || (digits.length >= 9 && digits.length <= 15)
            ? ''
            : 'Enter a valid phone number with 9 to 15 digits.'
    );
});

reservationDate.addEventListener('change', () => {
    const selectedDate = reservationDate.value
        ? new Date(`${reservationDate.value}T00:00:00`)
        : null;
    reservationDate.setCustomValidity(
        selectedDate && selectedDate.getDay() === 0
            ? 'Savannah is closed on Sundays. Please choose Monday to Saturday.'
            : ''
    );
});

reservationForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(reservationForm);
    const message = [
        'Hello Savannah Restaurant! I would like to book a table.',
        `Name: ${formData.get('name')}`,
        `Phone: ${formData.get('phone')}`,
        `Date: ${formData.get('date')}`,
        `Time: ${formData.get('time')}`,
        `Guests: ${formData.get('guests')}`
    ].join('\n');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    const whatsappLink = document.createElement('a');

    whatsappLink.href = whatsappUrl;
    whatsappLink.target = '_blank';
    whatsappLink.rel = 'noopener noreferrer';
    whatsappLink.textContent = 'Open WhatsApp';

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    formNote.textContent = 'Your request is ready in WhatsApp—tap send to contact the restaurant. ';
    formNote.append(whatsappLink);
});
