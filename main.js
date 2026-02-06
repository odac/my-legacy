import './legacy-input-form.js';
import './legacy-plan-display.js'; // Import the new Web Component

document.addEventListener('DOMContentLoaded', () => {
    // Select the legacy-input-form component
    const legacyInputFormComponent = document.querySelector('legacy-input-form');
    // Select the legacy-plan-display component
    const legacyPlanDisplayComponent = document.querySelector('legacy-plan-display');

    // Listen for the custom formSubmit event from the Web Component
    if (legacyInputFormComponent) {
        legacyInputFormComponent.addEventListener('formSubmit', (event) => {
            const formData = event.detail; // Get form data from the custom event

            // Show loading overlay
            if (legacyPlanDisplayComponent) {
                legacyPlanDisplayComponent.showLoading();
            }

            const age = calculateAge(formData.birthDate);
            // Call the displayStatistics method on the legacy-plan-display component
            if (legacyPlanDisplayComponent) {
                legacyPlanDisplayComponent.displayStatistics(formData.name, age, formData.gender);
            }

            legacyInputFormComponent.classList.add('hidden'); // Hide the form component
        });
    }

    // Listen for the custom proceedToPlan event from the legacy-plan-display component
    if (legacyPlanDisplayComponent) {
        legacyPlanDisplayComponent.addEventListener('proceedToPlan', () => {
            // Re-fetch form data from the input component's shadow DOM
            const formData = {
                name: legacyInputFormComponent.shadowRoot.getElementById('name').value,
                gender: legacyInputFormComponent.shadowRoot.getElementById('gender').value,
                birthDate: legacyInputFormComponent.shadowRoot.getElementById('birthDate').value,
                maritalStatus: legacyInputFormComponent.shadowRoot.getElementById('maritalStatus').value,
                dependents: parseInt(legacyInputFormComponent.shadowRoot.getElementById('dependents').value),
                medicalHistory: legacyInputFormComponent.shadowRoot.getElementById('medicalHistory').value,
                assets: legacyInputFormComponent.shadowRoot.getElementById('assets').value,
                debts: legacyInputFormComponent.shadowRoot.getElementById('debts').value,
            };

            const maritalStatus = formData.maritalStatus;
            if (maritalStatus === 'single' || maritalStatus === 'divorced') {
                // Call updatePlan on the legacy-plan-display component
                legacyPlanDisplayComponent.updatePlan(formData);
            } else {
                // If not single or divorced, display a conversation message
                legacyPlanDisplayComponent.displayConversationMessage();
            }
        });
    }

    function calculateAge(birthDateString) {
        const birthDate = new Date(birthDateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
});