/* ============================================
   NISSAN DEALERSHIP PHILIPPINES – FORM SCRIPT
   Includes honeypot and timing protection
   ============================================ */

(function () {
    'use strict';

    // ---------- DOM Elements ----------
    const form = document.getElementById('carInquiryForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');

    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');

    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const emailError = document.getElementById('emailError');

    // Honeypot field
    const honeyInput = document.getElementById('honey');

    // Time tracking (minimum 3 seconds)
    const pageLoadTime = Date.now();
    const MIN_SUBMIT_TIME = 3000; // 3 seconds

    // ---------- Phone Number Formatting (Philippines) ----------
    phoneInput.addEventListener('input', function () {
        let digits = this.value.replace(/\D/g, '');

        if (digits.startsWith('0')) {
            digits = digits.substring(1);
        }
        if (digits.startsWith('63')) {
            digits = digits.substring(2);
        }

        digits = digits.slice(0, 10);

        let formatted = '';
        if (digits.length > 0) {
            formatted = '+63';
            if (digits.length > 0) formatted += ' ' + digits.slice(0, 3);
            if (digits.length > 3) formatted += ' ' + digits.slice(3, 6);
            if (digits.length > 6) formatted += ' ' + digits.slice(6, 10);
        }

        this.value = formatted;
    });

    // ---------- Validation Functions ----------
    function validateName() {
        const value = fullNameInput.value.trim();
        const isValid = value.length >= 2;
        toggleError(fullNameInput, nameError, !isValid);
        return isValid;
    }

    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(emailInput.value.trim());
        toggleError(emailInput, emailError, !isValid);
        return isValid;
    }

    function validatePhone() {
        let digits = phoneInput.value.replace(/\D/g, '');
        if (digits.startsWith('63')) {
            digits = digits.substring(2);
        }
        const isValid = digits.length === 10;
        toggleError(phoneInput, phoneError, !isValid);
        return isValid;
    }

    function toggleError(input, errorElement, showError) {
        if (showError) {
            input.classList.add('error');
            errorElement.classList.add('show');
        } else {
            input.classList.remove('error');
            errorElement.classList.remove('show');
        }
    }

    // ---------- Real-time Validation Clearing ----------
    fullNameInput.addEventListener('input', function () {
        if (this.classList.contains('error') && this.value.trim().length >= 2) {
            toggleError(this, nameError, false);
        }
    });

    emailInput.addEventListener('input', function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.classList.contains('error') && emailRegex.test(this.value)) {
            toggleError(this, emailError, false);
        }
    });

    phoneInput.addEventListener('input', function () {
        const digits = this.value.replace(/\D/g, '').replace(/^63/, '');
        if (this.classList.contains('error') && digits.length === 10) {
            toggleError(this, phoneError, false);
        }
    });

    // ---------- Form Submission ----------
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // 1. Honeypot check – if filled, do nothing
        if (honeyInput && honeyInput.value.trim() !== '') {
            console.log('Spam detected via honeypot');
            return;
        }

        // 2. Time check – less than 3 seconds is likely a bot
        const elapsedTime = Date.now() - pageLoadTime;
        if (elapsedTime < MIN_SUBMIT_TIME) {
            alert('Please wait a moment before submitting.');
            return;
        }

        // 3. Normal validation
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();

        if (!isNameValid || !isEmailValid || !isPhoneValid) {
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');
                successMessage.classList.add('show');
                form.reset();

                setTimeout(() => {
                    successMessage.classList.remove('show');
                    submitBtn.classList.remove('success');
                    submitBtn.disabled = false;
                }, 5000);

                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                throw new Error('Submission failed');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            alert('There was an issue submitting the form. Please try again or contact us directly.');
            form.submit();
        });
    });

    console.log('Nissan Dealership Philippines – Website Loaded');
    console.log('Honeypot and timing protection active.');
})();