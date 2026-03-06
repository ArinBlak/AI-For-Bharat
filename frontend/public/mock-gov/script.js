// ===== PM Awas Yojana Form Logic =====

let currentStep = 1;
const totalSteps = 3;

// ===== Step Navigation =====
function nextStep(step) {
    if (!validateStep(step)) return;

    const currentEl = document.getElementById(`step-${step}`);
    const nextEl = document.getElementById(`step-${step + 1}`);

    if (!nextEl) return;

    currentEl.classList.remove('active');
    nextEl.classList.add('active');

    currentStep = step + 1;
    updateProgress();
    scrollToForm();
}

function prevStep(step) {
    const currentEl = document.getElementById(`step-${step}`);
    const prevEl = document.getElementById(`step-${step - 1}`);

    if (!prevEl) return;

    currentEl.classList.remove('active');
    prevEl.classList.add('active');

    currentStep = step - 1;
    updateProgress();
    scrollToForm();
}

function updateProgress() {
    const steps = document.querySelectorAll('.progress-step');
    const lines = document.querySelectorAll('.progress-line');

    steps.forEach((stepEl, index) => {
        const stepNum = index + 1;
        stepEl.classList.remove('active', 'completed');

        if (stepNum < currentStep) {
            stepEl.classList.add('completed');
        } else if (stepNum === currentStep) {
            stepEl.classList.add('active');
        }
    });

    lines.forEach((line, index) => {
        line.classList.remove('completed');
        if (index + 1 < currentStep) {
            line.classList.add('completed');
        }
    });
}

function scrollToForm() {
    const formSection = document.getElementById('application-form');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== Validation =====
function validateStep(step) {
    clearErrors();
    let isValid = true;

    if (step === 1) {
        const fullname = document.getElementById('fullname');
        const fathername = document.getElementById('fathername');
        const dob = document.getElementById('dob');
        const gender = document.getElementById('gender');
        const aadhaar = document.getElementById('aadhaar');
        const mobile = document.getElementById('mobile');
        const category = document.getElementById('category');
        const income = document.getElementById('income');

        if (!fullname.value.trim()) {
            showError('fullname', 'Full name is required');
            isValid = false;
        }

        if (!fathername.value.trim()) {
            showError('fathername', "Father's/Husband's name is required");
            isValid = false;
        }

        if (!dob.value) {
            showError('dob', 'Date of birth is required');
            isValid = false;
        }

        if (!gender.value) {
            showError('gender', 'Please select gender');
            isValid = false;
        }

        const aadhaarClean = aadhaar.value.replace(/\s/g, '');
        if (!aadhaarClean || aadhaarClean.length !== 12 || !/^\d{12}$/.test(aadhaarClean)) {
            showError('aadhaar', 'Enter a valid 12-digit Aadhaar number');
            isValid = false;
        }

        if (!mobile.value || mobile.value.length !== 10 || !/^\d{10}$/.test(mobile.value)) {
            showError('mobile', 'Enter a valid 10-digit mobile number');
            isValid = false;
        }

        if (!category.value) {
            showError('category', 'Please select a category');
            isValid = false;
        }

        if (!income.value || income.value <= 0) {
            showError('income', 'Please enter a valid annual income');
            isValid = false;
        }
    }

    if (step === 2) {
        const address = document.getElementById('address');
        const state = document.getElementById('state');
        const district = document.getElementById('district');
        const city = document.getElementById('city');
        const pincode = document.getElementById('pincode');

        if (!address.value.trim()) {
            showError('address', 'Address is required');
            isValid = false;
        }

        if (!state.value) {
            showError('state', 'Please select a state');
            isValid = false;
        }

        if (!district.value.trim()) {
            showError('district', 'District is required');
            isValid = false;
        }

        if (!city.value.trim()) {
            showError('city', 'City/Town/Village is required');
            isValid = false;
        }

        if (!pincode.value || pincode.value.length !== 6 || !/^\d{6}$/.test(pincode.value)) {
            showError('pincode', 'Enter a valid 6-digit PIN code');
            isValid = false;
        }
    }

    return isValid;
}

function showError(fieldId, message) {
    const errorEl = document.getElementById(`error-${fieldId}`);
    const inputEl = document.getElementById(fieldId);

    if (errorEl) {
        errorEl.textContent = message;
    }
    if (inputEl) {
        inputEl.classList.add('error');
    }
}

function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
}

// ===== Aadhaar Auto-format =====
document.addEventListener('DOMContentLoaded', () => {
    const aadhaarInput = document.getElementById('aadhaar');
    if (aadhaarInput) {
        aadhaarInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 12) value = value.slice(0, 12);

            let formatted = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) formatted += ' ';
                formatted += value[i];
            }
            e.target.value = formatted;
        });
    }

    // Mobile number - digits only
    const mobileInput = document.getElementById('mobile');
    if (mobileInput) {
        mobileInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
        });
    }

    // PIN code - digits only
    const pincodeInput = document.getElementById('pincode');
    if (pincodeInput) {
        pincodeInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
        });
    }

    // File upload handlers
    setupFileUploads();

    // Form submission
    const form = document.getElementById('pmay-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    // Input focus effects
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('focus', () => {
            input.classList.remove('error');
            const errorEl = input.closest('.form-group')?.querySelector('.error-msg');
            if (errorEl) errorEl.textContent = '';
        });
    });

    // Intersection Observer for card animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.info-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// ===== File Upload Setup =====
function setupFileUploads() {
    const fileInputs = document.querySelectorAll('.file-input');

    fileInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const wrapper = input.closest('.file-upload-wrapper');
            const file = e.target.files[0];
            const nameMap = {
                'aadhaar-doc': 'selected-aadhaar',
                'income-doc': 'selected-income',
                'address-doc': 'selected-address',
                'photo': 'selected-photo',
                'bank-doc': 'selected-bank'
            };

            const selectedEl = document.getElementById(nameMap[input.id]);

            if (file) {
                wrapper.classList.add('has-file');
                if (selectedEl) {
                    selectedEl.textContent = `✅ ${file.name}`;
                }
            } else {
                wrapper.classList.remove('has-file');
                if (selectedEl) {
                    selectedEl.textContent = '';
                }
            }
        });
    });
}

// ===== Form Submission =====
function handleSubmit(e) {
    e.preventDefault();

    // Validate step 3
    let isValid = true;
    clearErrors();

    // Check required files
    const aadhaarDoc = document.getElementById('aadhaar-doc');
    const incomeDoc = document.getElementById('income-doc');
    const photo = document.getElementById('photo');
    const declaration = document.getElementById('declaration');

    if (!aadhaarDoc.files.length && !window.__autoFilledDocs) {
        showError('aadhaar-doc', 'Aadhaar Card copy is required');
        isValid = false;
    }

    if (!incomeDoc.files.length && !window.__autoFilledDocs) {
        showError('income-doc', 'Income Certificate is required');
        isValid = false;
    }

    if (!photo.files.length && !window.__autoFilledDocs) {
        showError('photo', 'Passport size photo is required');
        isValid = false;
    }

    if (!declaration.checked) {
        showError('declaration', 'You must accept the declaration');
        isValid = false;
    }

    if (!isValid) return;

    // Show loading state
    const submitBtn = document.getElementById('btn-submit');
    submitBtn.classList.add('loading');

    // Simulate submission delay
    setTimeout(() => {
        submitBtn.classList.remove('loading');

        // Generate reference number
        const refNumber = generateRefNumber();
        document.getElementById('ref-number').textContent = refNumber;

        // Show success modal
        const overlay = document.getElementById('success-overlay');
        overlay.classList.add('show');

        // Confetti effect
        createConfetti();
    }, 2000);
}

// ===== Reference Number Generator =====
function generateRefNumber() {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 9).toUpperCase();
    return `PMAY-${year}-${random}`;
}

// ===== Reset Form =====
function resetForm() {
    const form = document.getElementById('pmay-form');
    form.reset();

    // Hide success overlay
    document.getElementById('success-overlay').classList.remove('show');

    // Reset steps
    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    document.getElementById('step-1').classList.add('active');
    currentStep = 1;
    updateProgress();

    // Reset file upload UI
    document.querySelectorAll('.file-upload-wrapper').forEach(wrapper => {
        wrapper.classList.remove('has-file');
    });
    document.querySelectorAll('.file-selected').forEach(el => el.textContent = '');

    // Clear errors
    clearErrors();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Confetti Effect =====
function createConfetti() {
    const colors = ['#FF9933', '#138808', '#000080', '#22c55e', '#f59e0b', '#3b82f6'];
    const overlay = document.getElementById('success-overlay');

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -20px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            pointer-events: none;
            z-index: 2001;
            animation: confettiFall ${Math.random() * 2 + 2}s ease-out forwards;
            opacity: ${Math.random() * 0.5 + 0.5};
        `;
        overlay.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
    }

    // Add confetti animation
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}
window.addEventListener('message', async (event) => {
    if (event.data.type === 'AUTO_FILL') {
        const data = event.data.payload;
        const delay = (ms) => new Promise(res => setTimeout(res, ms));
        const typeText = async (id, text) => {
            const el = document.getElementById(id);
            if (el) {
                el.value = '';
                for (let i = 0; i < text.length; i++) {
                    el.value += text[i];
                    await delay(50);
                }
            }
        };
        const setSelect = (id, val) => {
            const el = document.getElementById(id);
            if (el) {
                for (let i = 0; i < el.options.length; i++) {
                    if (el.options[i].value.toLowerCase().includes(val.toLowerCase()) || el.options[i].text.toLowerCase().includes(val.toLowerCase())) {
                        el.selectedIndex = i;
                        break;
                    }
                }
            }
        };

        if (data.name || data.username) await typeText('fullname', data.name || data.username);
        if (data.fathername) await typeText('fathername', data.fathername);
        if (data.dob) {
            // Ensure DOB is in YYYY-MM-DD format for HTML5 input type="date"
            let dob = data.dob;
            if (dob.includes('/')) {
                const parts = dob.split('/');
                if (parts[0].length === 2 && parts[2].length === 4) {
                    dob = `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert DD/MM/YYYY to YYYY-MM-DD
                }
            }
            const dobEl = document.getElementById('dob');
            if (dobEl) dobEl.value = dob; // Directly set value for date input, typing char by char doesn't work well
            await delay(50);
        }
        if (data.gender) setSelect('gender', data.gender);
        if (data.phone) await typeText('mobile', data.phone);
        if (data.aadhaar || data.aadhar) await typeText('aadhaar', data.aadhaar || data.aadhar);
        if (data.category) setSelect('category', data.category);
        if (data.income) await typeText('income', typeof data.income === 'string' ? data.income.replace(/\D/g, '') : data.income.toString());

        await delay(500);
        const nextBtn1 = document.getElementById('btn-next-1');
        if (nextBtn1) nextBtn1.click();

        await delay(500);
        if (data.address) await typeText('address', data.address);
        if (data.state) setSelect('state', data.state.replace(' ', '-'));
        if (data.district) await typeText('district', data.district);
        if (data.city) await typeText('city', data.city);
        if (data.pincode) await typeText('pincode', data.pincode);

        await delay(500);
        const nextBtn2 = document.getElementById('btn-next-2');
        if (nextBtn2) nextBtn2.click();

        await delay(1000);
        window.__autoFilledDocs = true;

        ['aadhaar', 'income', 'photo'].forEach(doc => {
            const wrapper = document.getElementById(`upload-${doc}`);
            if (wrapper) wrapper.classList.add('has-file');
            const selEl = document.getElementById(`selected-${doc}`);
            if (selEl) selEl.textContent = `✅ auto-${doc}.pdf`;
        });

        const cb = document.getElementById('declaration');
        if (cb) cb.checked = true;
    } else if (event.data.type === 'AUTO_SUBMIT') {
        const attemptSubmit = () => {
            const cb = document.getElementById('declaration');
            if (window.__autoFilledDocs && cb && cb.checked) {
                const btn = document.getElementById('btn-submit');
                if (btn) btn.click();
            } else {
                // If backend responded faster than animation, wait and retry
                setTimeout(attemptSubmit, 500);
            }
        };
        attemptSubmit();
    }
});
