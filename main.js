document.addEventListener('DOMContentLoaded', () => {
    const legacyForm = document.getElementById('legacyForm');
    const resultsSection = document.getElementById('results');
    const clientNameSpan = document.getElementById('clientName');
    const actionChecklist = document.getElementById('actionChecklist');
    const nextStepsContent = document.getElementById('nextStepsContent');
    const clientInfoForm = document.getElementById('client-info-form');
    const conversationStarter = document.getElementById('conversation-starter');

    legacyForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            gender: document.getElementById('gender').value,
            birthDate: document.getElementById('birthDate').value,
            maritalStatus: document.getElementById('maritalStatus').value,
            dependents: parseInt(document.getElementById('dependents').value),
            medicalHistory: document.getElementById('medicalHistory').value,
            assets: document.getElementById('assets').value,
            debts: document.getElementById('debts').value,
        };

        const age = calculateAge(formData.birthDate);
        displayStatistics(formData.name, age, formData.gender);

        clientInfoForm.classList.add('hidden');
        conversationStarter.classList.remove('hidden');
    });

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

    function displayStatistics(name, age, gender) {
        const statsContent = document.getElementById('stats-content');
        const averageLifespan = gender === 'male' ? 81.3 : 85.9;

        statsContent.innerHTML = `
            <h2>Hello, ${name}!</h2>
            <p>You are <strong>${age}</strong> years old.</p>
            <p>Based on Singapore statistics, the average life expectancy for a ${gender} is <strong>${averageLifespan}</strong> years.</p>
            <p>This is a great time to start thinking about your legacy. Let's create a plan to ensure your wishes are carried out and your loved ones are protected.</p>
            <button id="proceed-to-plan">Continue to Legacy Plan</button>
        `;

        document.getElementById('proceed-to-plan').addEventListener('click', () => {
            const maritalStatus = document.getElementById('maritalStatus').value;
            if (maritalStatus === 'single' || maritalStatus === 'divorced') {
                const formData = {
                    name: document.getElementById('name').value,
                    gender: document.getElementById('gender').value,
                    birthDate: document.getElementById('birthDate').value,
                    maritalStatus: document.getElementById('maritalStatus').value,
                    dependents: parseInt(document.getElementById('dependents').value),
                    medicalHistory: document.getElementById('medicalHistory').value,
                    assets: document.getElementById('assets').value,
                    debts: document.getElementById('debts').value,
                };
                clientNameSpan.textContent = formData.name;
                generateChecklist(formData);
                conversationStarter.classList.add('hidden');
                resultsSection.classList.remove('hidden');
            } else {
                conversationStarter.classList.add('hidden');
                displayConversationMessage();
            }
        });
    }

    function displayConversationMessage() {
        resultsSection.classList.add('hidden');
        const conversationMessage = document.createElement('div');
        conversationMessage.classList.add('conversation-message');
        conversationMessage.innerHTML = `
            <h2>Continue to Legacy Planning Conversation</h2>
            <p>To provide you with the most accurate and personalized legacy plan, we need to gather more details about your specific situation. Please continue the conversation with our AI assistant.</p>
        `;
        const main = document.querySelector('main');
        main.appendChild(conversationMessage);
    }

    function generateChecklist(data) {
        actionChecklist.innerHTML = ''; 
        nextStepsContent.innerHTML = ''; 

        const checklistItems = [
            { id: 'cpfNomination', label: 'CPF Nomination', applicable: true },
            { id: 'will', label: 'Will', applicable: true },
            { id: 'lpa', label: 'LPA (Lasting Power of Attorney)', applicable: true },
            { id: 'advanceCarePlanning', label: 'Advance Care Planning', applicable: true },
            { id: 'organDonation', label: 'Organ Donation Wishes', applicable: true },
        ];
        
        checklistItems.forEach(item => {
            if (item.applicable) {
                const li = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = item.id;
                checkbox.name = item.id;
                
                const label = document.createElement('label');
                label.htmlFor = item.id;
                label.textContent = item.label;

                li.appendChild(checkbox);
                li.appendChild(label);
                actionChecklist.appendChild(li);

                checkbox.addEventListener('change', () => generateNextSteps(data));
            }
        });
        generateNextSteps(data); 
    }

    function generateNextSteps(data) {
        nextStepsContent.innerHTML = '';

        const uncheckedItems = Array.from(actionChecklist.querySelectorAll('input[type="checkbox"]:not(:checked)'));

        if (uncheckedItems.length === 0) {
            nextStepsContent.innerHTML = '<p>Great! All essential legacy planning items are checked. Remember to review them periodically.</p>';
            return;
        }

        uncheckedItems.forEach(item => {
            const itemId = item.id;
            let title = '';
            let content = '';

            switch (itemId) {
                case 'cpfNomination':
                    title = 'CPF Nomination: Ensure your loved ones receive your CPF savings.';
                    content = `
                        <p>In Singapore, your CPF savings are not covered by your Will. You need to make a separate CPF Nomination to decide who receives your CPF savings and in what proportion.</p>
                        <p><strong>Next Steps:</strong></p>
                        <ul>
                            <li>Visit the <a href="https://www.cpf.gov.sg/member/withdrawals-and-nominations/nominations" target="_blank">CPF Board website</a> to learn more.</li>
                            <li>Make an online nomination through the CPF website or download the form for a counter nomination.</li>
                            <li>Ensure your nominees are aware of your decision.</li>
                        </ul>
                    `;
                    break;
                case 'will':
                    title = 'Will: Plan the distribution of your assets beyond CPF.';
                    content = `
                        <p>A Will is a legal document that states how you wish your assets to be distributed after your passing. It helps ensure your wishes are met and can simplify the probate process for your family.</p>
                        <p><strong>Next Steps:</strong></p>
                        <ul>
                            <li>Consider consulting a lawyer to draft your Will. This ensures it is legally sound and reflects your intentions accurately.</li>
                            <li>Resources for finding lawyers: The Law Society of Singapore has a <a href="https://www.lawsociety.org.sg/for-the-public/find-a-lawyer/" target="_blank">"Find a Lawyer" directory</a>.</li>
                            <li>Public Trustee's Office (PTO) offers affordable Will-drafting services for simple cases. More info at <a href="https://www.mlaw.gov.sg/pto/wills/making-a-will/" target="_blank">Ministry of Law - Wills</a>.</li>
                            <li>Ensure your Will is properly witnessed (two witnesses, not beneficiaries) and kept in a safe place, with copies provided to your executor.</li>
                        </ul>
                    `;
                    break;
                case 'lpa':
                    title = 'LPA (Lasting Power of Attorney): Appoint someone to make decisions for you if you lose mental capacity.';
                    content = `
                        <p>A Lasting Power of Attorney (LPA) allows you to appoint one or more persons (donees) to make decisions and act on your behalf if you lose mental capacity. This covers personal welfare and property & affairs matters.</p>
                        <p><strong>Next Steps:</strong></p>
                        <ul>
                            <li>Understand the process on the <a href="https://www.msf.gov.sg/our-initiatives/office-of-public-guardian/lasting-power-of-attorney-(lpa)" target="_blank">Ministry of Social and Family Development (MSF) website</a>.</li>
                            <li>You will need an LPA certificate issuer (e.g., a medical practitioner, lawyer, or psychiatrist) to witness and certify your LPA.</li>
                            <li>The Office of the Public Guardian (OPG) provides resources and forms.</li>
                        </ul>
                    `;
                    break;
                case 'advanceCarePlanning':
                    title = 'Advance Care Planning: Document your healthcare preferences.';
                    content = `
                        <p>Advance Care Planning (ACP) is a process of planning for your future health and personal care. It allows you to communicate your values and preferences for medical treatment in advance, should you lose the capacity to make decisions for yourself.</p>
                        <p><strong>Next Steps:</strong></p>
                        <ul>
                            <li>Discuss your values and wishes with your family and healthcare providers.</li>
                            <li>Resources and facilitators are available at various healthcare institutions. Learn more at <a href="https://www.aic.sg/care-services/advance-care-planning" target="_blank">Agency for Integrated Care (AIC)</a>.</li>
                            <li>Consider formalizing your wishes through an Advance Medical Directive (AMD) if you do not wish to be given extraordinary life-sustaining treatment in the event of terminal illness.</li>
                        </ul>
                    `;
                    break;
                case 'organDonation':
                    title = 'Organ Donation Wishes: Make your organ donation preferences known.';
                    content = `
                        <p>In Singapore, under the Human Organ Transplant Act (HOTA), if you are 21 years old and above, a Singapore Citizen or Permanent Resident, and have not opted out, your organs (kidneys, heart, liver, and corneas) may be removed for transplant in the event of death.</p>
                        <p><strong>Next Steps:</strong></p>
                        <ul>
                            <li>If you wish to opt out, you need to submit an <a href="https://www.moh.gov.sg/policies-and-legislation/organ-donation" target="_blank">opt-out form to the Ministry of Health (MOH)</a>.</li>
                            <li>If you wish to donate more organs or pledge your organs for transplant even if HOTA does not apply to you, you can register under the Medical (Therapy, Education and Research) Act (MTERA).</li>
                            <li>Discuss your wishes with your family.</li>
                        </ul>
                    `;
                    break;
            }
            if (content) {
                const div = document.createElement('div');
                div.innerHTML = `<h3>${title}</h3>${content}`;
                nextStepsContent.appendChild(div);
            }
        });
    }
});
