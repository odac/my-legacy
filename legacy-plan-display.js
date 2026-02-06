// legacy-plan-display.js
class LegacyPlanDisplay extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin-top: 20px;
                    position: relative; /* Needed for absolute positioning of loading overlay */
                }
                .hidden {
                    display: none;
                }
                section {
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background-color: #f9f9f9;
                    max-width: 800px;
                    margin: 20px auto;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    position: relative; /* For stacking context with overlay */
                }
                h2, h3 {
                    color: #333;
                    text-align: center;
                    margin-bottom: 15px;
                }
                #stats-content, #nextStepsContent {
                    text-align: left;
                }
                #stats-content p, #nextStepsContent p {
                    margin-bottom: 10px;
                    line-height: 1.6;
                }
                #stats-content button {
                    display: block;
                    width: 100%;
                    padding: 12px 20px;
                    background-color: #28a745;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 18px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    margin-top: 20px;
                }
                #stats-content button:hover {
                    background-color: #218838;
                }
                #actionChecklist ul {
                    list-style: none;
                    padding: 0;
                }
                #actionChecklist li {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                }
                #actionChecklist input[type="checkbox"] {
                    margin-right: 10px;
                    width: 20px;
                    height: 20px;
                }
                #actionChecklist label {
                    font-size: 1.1em;
                    font-weight: normal;
                    color: #444;
                }
                .conversation-message {
                    text-align: center;
                    padding: 30px;
                    background-color: #fff3cd;
                    border: 1px solid #ffeeba;
                    color: #856404;
                    border-radius: 8px;
                }
                /* Loading Overlay Styles */
                .loading-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.9); /* Slightly more opaque */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    z-index: 1000;
                    border-radius: 8px;
                    transition: opacity 0.3s ease;
                    opacity: 0;
                    pointer-events: none; /* Allows clicks to pass through when hidden */
                }
                .loading-overlay.visible {
                    opacity: 1;
                    pointer-events: all; /* Blocks clicks when visible */
                }
                .loading-spinner {
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #3498db;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin-bottom: 10px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Collapsible styles */
                .collapsible-header {
                    background-color: #e0e0e0;
                    color: #333;
                    cursor: pointer;
                    padding: 18px;
                    width: 100%;
                    border: none;
                    text-align: left;
                    outline: none;
                    font-size: 1.2em;
                    transition: background-color 0.2s ease;
                    margin-top: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .collapsible-header:hover {
                    background-color: #ccc;
                }
                .collapsible-header:after {
                    content: '\\002B'; /* Plus sign */
                    font-weight: bold;
                    float: right;
                    margin-left: 5px;
                }
                .collapsible-header.active:after {
                    content: '\\2212'; /* Minus sign */
                }
                .collapsible-content {
                    padding: 0 18px;
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.2s ease-out;
                    background-color: #f1f1f1;
                }
                .collapsible-header.active + .collapsible-content {
                    max-height: 500px; /* Adjust as needed for content */
                    /* A large value ensures all content is visible */
                }
                /* Tooltip styles */
                .tooltip-container {
                    position: relative;
                    display: inline-block;
                    margin-left: 5px;
                }
                .info-icon {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    line-height: 16px;
                    text-align: center;
                    border-radius: 50%;
                    background-color: #007bff;
                    color: white;
                    font-size: 0.8em;
                    cursor: help;
                }
                .tooltiptext {
                    visibility: hidden;
                    width: 200px;
                    background-color: #555;
                    color: #fff;
                    text-align: center;
                    border-radius: 6px;
                    padding: 5px 0;
                    position: absolute;
                    z-index: 1;
                    bottom: 125%; /* Position above the icon */
                    left: 50%;
                    margin-left: -100px; /* Center the tooltip */
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .tooltiptext::after {
                    content: "";
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    margin-left: -5px;
                    border-width: 5px;
                    border-style: solid;
                    border-color: #555 transparent transparent transparent;
                }
                .tooltip-container:hover .tooltiptext {
                    visibility: visible;
                    opacity: 1;
                }
            </style>
            <div id="loadingOverlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Generating your personalized plan...</p>
            </div>
            <section id="conversation-starter" class="hidden">
                <div id="stats-content">
                    <!-- Statistics will be dynamically inserted here -->
                </div>
            </section>

            <section id="results" class="hidden">
                <h2>Legacy Plan for <span id="clientName"></span></h2>
                <div id="checklist-container">
                    <h3 class="collapsible-header active">Action Checklist</h3>
                    <div class="collapsible-content" style="max-height: 500px;">
                        <ul id="actionChecklist">
                            <!-- Checklist items will be dynamically inserted here -->
                        </ul>
                    </div>
                </div>
                <div id="resources-container">
                    <h3 class="collapsible-header active">Next Steps & Resources</h3>
                    <div class="collapsible-content" style="max-height: 500px;">
                        <div id="nextStepsContent">
                            <!-- Detailed information for unchecked items will be dynamically inserted here -->
                        </div>
                    </div>
                </div>
                <button id="downloadPlanButton">Download Plan</button>
            </section>
        `;
        shadow.appendChild(template.content.cloneNode(true));

        this.loadingOverlay = shadow.getElementById('loadingOverlay');
        this.conversationStarter = shadow.getElementById('conversation-starter');
        this.statsContent = shadow.getElementById('stats-content');
        this.resultsSection = shadow.getElementById('results');
        this.clientNameSpan = shadow.getElementById('clientName');
        this.actionChecklist = shadow.getElementById('actionChecklist');
        this.nextStepsContent = shadow.getElementById('nextStepsContent');
        this.downloadPlanButton = shadow.getElementById('downloadPlanButton'); // Get reference to the download button

        // Initial setup
        this._setupEventListeners();
    }

    _setupEventListeners() {
        this.shadowRoot.querySelectorAll('.collapsible-header').forEach(header => {
            header.addEventListener('click', function() {
                this.classList.toggle('active');
                const content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });

        this.downloadPlanButton.addEventListener('click', this._downloadPlanAsText.bind(this));
    }

    showLoading() {
        this.loadingOverlay.classList.add('visible');
    }

    hideLoading() {
        this.loadingOverlay.classList.remove('visible');
    }

    // Method to display initial statistics and conversation starter
    displayStatistics(name, age, gender) {
        this.hideLoading(); // Hide loading once content is ready
        this.conversationStarter.classList.remove('hidden');
        this.resultsSection.classList.add('hidden'); // Ensure results are hidden initially

        const averageLifespan = gender === 'male' ? 81.3 : 85.9; // Example data

        this.statsContent.innerHTML = `
            <h2>Hello, ${name}!</h2>
            <p>You are <strong>${age}</strong> years old.</p>
            <p>Based on Singapore statistics, the average life expectancy for a ${gender} is <strong>${averageLifespan}</strong> years.</p>
            <p>This is a great time to start thinking about your legacy. Let's create a plan to ensure your wishes are carried out and your loved ones are protected.</p>
            <button id="proceed-to-plan">Continue to Legacy Plan</button>
        `;

        this.statsContent.querySelector('#proceed-to-plan').addEventListener('click', () => {
            // Dispatch a custom event to main.js indicating to proceed to plan generation
            this.dispatchEvent(new CustomEvent('proceedToPlan', { bubbles: true, composed: true }));
        });
    }

    // Method to display a conversation message
    displayConversationMessage() {
        this.hideLoading(); // Hide loading once content is ready
        this.conversationStarter.classList.remove('hidden');
        this.resultsSection.classList.add('hidden');

        this.statsContent.innerHTML = `
            <div class="conversation-message">
                <h2>Continue to Legacy Planning Conversation</h2>
                <p>To provide you with the most accurate and personalized legacy plan, we need to gather more details about your specific situation. Please continue the conversation with our AI assistant.</p>
            </div>
        `;
    }

    // Method to display the final legacy plan
    updatePlan(formData) {
        this.hideLoading(); // Hide loading once content is ready
        this.conversationStarter.classList.add('hidden');
        this.resultsSection.classList.remove('hidden');

        this.clientNameSpan.textContent = formData.name;
        this._generateChecklist(formData);
    }

    _generateChecklist(data) {
        this.actionChecklist.innerHTML = '';
        this.nextStepsContent.innerHTML = '';

        const checklistItems = [
            { id: 'cpfNomination', label: 'CPF Nomination', applicable: true, tooltip: 'Your CPF savings are not covered by your Will. Nominate beneficiaries separately.' },
            { id: 'will', label: 'Will', applicable: true, tooltip: 'A legal document stating how your assets should be distributed after your passing.' },
            { id: 'lpa', label: 'LPA (Lasting Power of Attorney)', applicable: true, tooltip: 'Appoint someone to make decisions for you if you lose mental capacity.' },
            { id: 'advanceCarePlanning', label: 'Advance Care Planning', applicable: true, tooltip: 'Document your preferences for future healthcare decisions.' },
            { id: 'organDonation', label: 'Organ Donation Wishes', applicable: true, tooltip: 'Make your intentions for organ donation known.' },
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

                const tooltipContainer = document.createElement('span');
                tooltipContainer.classList.add('tooltip-container');
                tooltipContainer.innerHTML = `
                    <span class="info-icon">i</span>
                    <span class="tooltiptext">${item.tooltip}</span>
                `;

                li.appendChild(checkbox);
                li.appendChild(label);
                li.appendChild(tooltipContainer);
                this.actionChecklist.appendChild(li);

                const localStorageKey = `legacyPlan_${item.id}_checked`;
                const savedState = localStorage.getItem(localStorageKey);
                if (savedState === 'true') {
                    checkbox.checked = true;
                }

                checkbox.addEventListener('change', (e) => {
                    localStorage.setItem(localStorageKey, e.target.checked);
                    this._generateNextSteps(data);
                });
            }
        });
        this._generateNextSteps(data);
    }

    _generateNextSteps(data) {
        this.nextStepsContent.innerHTML = '';

        const uncheckedItems = Array.from(this.actionChecklist.querySelectorAll('input[type="checkbox"]:not(:checked)'));

        if (uncheckedItems.length === 0) {
            this.nextStepsContent.innerHTML = '<p>Great! All essential legacy planning items are checked. Remember to review them periodically.</p>';
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
                this.nextStepsContent.appendChild(div);
            }
        });
    }

    _downloadPlanAsText() {
        const clientName = this.clientNameSpan.textContent;
        let planContent = `Legacy Plan for ${clientName}\n\n`;

        planContent += "Action Checklist:\n";
        this.actionChecklist.querySelectorAll('li').forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const label = item.querySelector('label');
            if (checkbox && label) {
                planContent += `- [${checkbox.checked ? 'x' : ' '}] ${label.textContent}\n`;
            }
        });

        planContent += "\nNext Steps & Resources:\n";
        this.nextStepsContent.querySelectorAll('div').forEach(item => {
            const title = item.querySelector('h3');
            const paragraphs = item.querySelectorAll('p');
            const links = item.querySelectorAll('a');

            if (title) {
                planContent += `\n${title.textContent}\n`;
            }
            paragraphs.forEach(p => planContent += `${p.textContent}\n`);
            links.forEach(a => planContent += `Link: ${a.href}\n`);
        });

        const blob = new Blob([planContent], { type: 'text/plain;charset=utf-8' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `Legacy_Plan_${clientName.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
    }
}

customElements.define('legacy-plan-display', LegacyPlanDisplay);