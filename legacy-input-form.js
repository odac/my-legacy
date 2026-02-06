// legacy-input-form.js
class LegacyInputForm extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const formTemplate = document.createElement('template');
        formTemplate.innerHTML = `
            <style>
                /* Basic styles for the form within the shadow DOM */
                :host {
                    display: block;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background-color: #f9f9f9;
                    max-width: 600px;
                    margin: 20px auto;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                h2 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 20px;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                    color: #555;
                }
                input[type="text"],
                input[type="date"],
                input[type="number"],
                select,
                textarea {
                    width: calc(100% - 22px); /* Account for padding and border */
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box; /* Include padding and border in the element's total width and height */
                    font-size: 16px;
                }
                textarea {
                    resize: vertical;
                }
                button {
                    display: block;
                    width: 100%;
                    padding: 12px 20px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 18px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                button:hover {
                    background-color: #0056b3;
                }
                .spouse-fields {
                    display: none; /* Hidden by default */
                }
                .form-group.invalid input,
                .form-group.invalid select,
                .form-group.invalid textarea {
                    border-color: #dc3545;
                    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
                }
                .error-message {
                    color: #dc3545;
                    font-size: 0.875em;
                    margin-top: 5px;
                    display: none; /* Hidden by default */
                }
                .form-group.invalid .error-message {
                    display: block;
                }
                /* Spinner styles */
                .spinner {
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-left-color: #fff;
                    border-radius: 50%;
                    width: 16px;
                    height: 16px;
                    animation: spin 1s linear infinite;
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 8px;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
            <section id="client-info-form">
                <h2>Client Information</h2>
                <form id="legacyForm" novalidate>
                    <div class="form-group" id="form-group-name">
                        <label for="name">Name:</label>
                        <input type="text" id="name" name="name" required>
                        <span class="error-message"></span>
                    </div>
                    <div class="form-group" id="form-group-gender">
                        <label for="gender">Gender:</label>
                        <select id="gender" name="gender" required>
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        <span class="error-message"></span>
                    </div>
                    <div class="form-group" id="form-group-birthDate">
                        <label for="birthDate">Birth Date:</label>
                        <input type="date" id="birthDate" name="birthDate" required max="${new Date().toISOString().split('T')[0]}">
                        <span class="error-message"></span>
                    </div>
                    <div class="form-group" id="form-group-maritalStatus">
                        <label for="maritalStatus">Marital Status:</label>
                        <select id="maritalStatus" name="maritalStatus" required>
                            <option value="">Select</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                        </select>
                        <span class="error-message"></span>
                    </div>
                    <div id="spouseFields" class="spouse-fields">
                        <div class="form-group" id="form-group-spouseName">
                            <label for="spouseName">Spouse's Name:</label>
                            <input type="text" id="spouseName" name="spouseName">
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group" id="form-group-spouseBirthDate">
                            <label for="spouseBirthDate">Spouse's Birth Date:</label>
                            <input type="date" id="spouseBirthDate" name="spouseBirthDate" max="${new Date().toISOString().split('T')[0]}">
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-group" id="form-group-dependents">
                        <label for="dependents">Dependents (number):</label>
                        <input type="number" id="dependents" name="dependents" min="0" value="0" required>
                        <span class="error-message"></span>
                    </div>
                    <div class="form-group" id="form-group-medicalHistory">
                        <label for="medicalHistory">Medical History (brief description):</label>
                        <textarea id="medicalHistory" name="medicalHistory" rows="3" list="medicalSuggestions"></textarea>
                        <datalist id="medicalSuggestions">
                            <option value="No significant history"></option>
                            <option value="Hypertension"></option>
                            <option value="Diabetes"></option>
                            <option value="High Cholesterol"></option>
                            <option value="Asthma"></option>
                        </datalist>
                        <span class="error-message"></span>
                    </div>
                    <div class="form-group" id="form-group-assets">
                        <label for="assets">Assets (e.g., mortgage, car, insurance, investments, fixed deposits, savings):</label>
                        <textarea id="assets" name="assets" rows="5" list="assetSuggestions"></textarea>
                        <datalist id="assetSuggestions">
                            <option value="HDB Flat"></option>
                            <option value="Private Property"></option>
                            <option value="Car"></option>
                            <option value="Life Insurance"></option>
                            <option value="Investment Portfolio"></option>
                            <option value="Fixed Deposits"></option>
                            <option value="Savings Account"></option>
                            <option value="EPF/CPF"></option>
                        </datalist>
                        <span class="error-message"></span>
                    </div>
                    <div class="form-group" id="form-group-debts">
                        <label for="debts">Debts:</label>
                        <textarea id="debts" name="debts" rows="3" list="debtSuggestions"></textarea>
                        <datalist id="debtSuggestions">
                            <option value="No significant debts"></option>
                            <option value="Housing Loan"></option>
                            <option value="Car Loan"></option>
                            <option value="Personal Loan"></option>
                            <option value="Credit Card Debts"></option>
                        </datalist>
                        <span class="error-message"></span>
                    </div>
                    <button type="submit" id="submitButton">Generate Legacy Plan</button>
                </form>
            </section>
        `;
        shadow.appendChild(formTemplate.content.cloneNode(true));

        this.legacyForm = shadow.getElementById('legacyForm');
        this.maritalStatusSelect = shadow.getElementById('maritalStatus');
        this.spouseFieldsContainer = shadow.getElementById('spouseFields');
        this.submitButton = shadow.getElementById('submitButton'); // Get reference to the submit button

        this.legacyForm.addEventListener('submit', this._handleSubmit.bind(this));
        this.maritalStatusSelect.addEventListener('change', this._toggleSpouseFields.bind(this));

        // Attach real-time validation listeners
        this.legacyForm.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('blur', this._validateField.bind(this, input));
            input.addEventListener('input', this._validateField.bind(this, input));
        });

        // Set initial visibility
        this._toggleSpouseFields();
    }

    _toggleSpouseFields() {
        if (this.maritalStatusSelect.value === 'married') {
            this.spouseFieldsContainer.style.display = 'block';
            // Make spouse fields required when visible
            this.spouseFieldsContainer.querySelectorAll('input').forEach(input => input.required = true);
        } else {
            this.spouseFieldsContainer.style.display = 'none';
            // Make spouse fields not required when hidden
            this.spouseFieldsContainer.querySelectorAll('input').forEach(input => input.required = false);
            // Clear validation for hidden spouse fields
            this.spouseFieldsContainer.querySelectorAll('input').forEach(input => this._clearValidationFeedback(input));
        }
    }

    _handleSubmit(event) {
        event.preventDefault();

        if (!this._validateForm()) {
            // If validation fails, ensure button is enabled
            this.enableSubmitButton();
            return;
        }

        // If validation passes, disable the button
        this.disableSubmitButton();

        const formData = new FormData(this.legacyForm);
        const data = Object.fromEntries(formData.entries());

        // Dispatch a custom event with the form data
        this.dispatchEvent(new CustomEvent('formSubmit', {
            detail: data,
            bubbles: true,
            composed: true // Allows the event to cross shadow DOM boundaries
        }));
    }

    disableSubmitButton() {
        this.submitButton.disabled = true;
        this.submitButton.innerHTML = '<span class="spinner"></span> Generating...'; // Add spinner
    }

    enableSubmitButton() {
        this.submitButton.disabled = false;
        this.submitButton.innerHTML = 'Generate Legacy Plan'; // Reset text and remove spinner
    }

    _validateField(input) {
        const formGroup = input.closest('.form-group');
        const errorMessageSpan = formGroup.querySelector('.error-message');

        if (input.required && !input.value.trim()) {
            formGroup.classList.add('invalid');
            errorMessageSpan.textContent = 'This field is required.';
            return false;
        } else if (input.type === 'number' && parseInt(input.value) < 0) {
            formGroup.classList.add('invalid');
            errorMessageSpan.textContent = 'Value cannot be negative.';
            return false;
        } else {
            this._clearValidationFeedback(input);
            return true;
        }
    }

    _clearValidationFeedback(input) {
        const formGroup = input.closest('.form-group');
        const errorMessageSpan = formGroup.querySelector('.error-message');
        formGroup.classList.remove('invalid');
        errorMessageSpan.textContent = '';
    }

    _validateForm() {
        let isValid = true;
        this.legacyForm.querySelectorAll('input, select, textarea').forEach(input => {
            // Only validate visible and required inputs during form submission
            if (input.required && input.offsetParent !== null) { // offsetParent check for visibility
                if (!this._validateField(input)) {
                    isValid = false;
                }
            }
        });

        // Specific validation for number input minimum value
        const dependentsInput = this.legacyForm.getElementById('dependents');
        if (dependentsInput && parseInt(dependentsInput.value) < 0) {
            if (this._validateField(dependentsInput)) { // Re-validate if needed
                 isValid = false;
            }
        }
        
        return isValid;
    }
}

customElements.define('legacy-input-form', LegacyInputForm);
