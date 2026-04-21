/**
 * BICARM Platform Logic
 * Handles:
 * 1. URL parameter parsing for service auto-fill
 * 2. WhatsApp message generation
 * 3. Dynamic office name display
 * 4. Dark/Light mode toggle and persistence
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Management ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Load saved theme - DEFAULT TO DARK
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            // Toggle logic: if empty (default dark) or dark -> switch to light
            // If light -> switch back to dark
            const newTheme = (currentTheme === 'dark' || !currentTheme) ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- Service Selection & URL Parameters ---
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const officeParam = urlParams.get('name');

    // Auto-fill service in request form
    const serviceInput = document.getElementById('service-input');
    if (serviceInput && serviceParam) {
        serviceInput.value = decodeURIComponent(serviceParam);
    }

    // Dynamic office name
    const officeHeader = document.getElementById('office-name');
    if (officeHeader && officeParam) {
        officeHeader.textContent = decodeURIComponent(officeParam);
    }

    // --- WhatsApp Order Logic ---
    const requestForm = document.getElementById('request-form');
    if (requestForm) {
        requestForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service-input').value;
            const desc = document.getElementById('description').value;
            const upsell = document.getElementById('upsell-check')?.checked;

            const providerPhone = "966510072172"; // Official WhatsApp
            
            let message = `*طلب خدمة جديد من بيكارم*\n\n`;
            message += `• *الاسم:* ${name}\n`;
            message += `• *الجوال:* ${phone}\n`;
            message += `• *الخدمة:* ${service}\n`;
            if (desc) message += `• *التفاصيل:* ${desc}\n`;
            if (upsell) message += `• *خدمة المتابعة:* نعم (+20 ريال)\n`;
            message += `\n_تم إرسال الطلب عبر منصة بيكارم الذكية_`;

            const whatsappUrl = `https://api.whatsapp.com/send?phone=${providerPhone}&text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }
});
