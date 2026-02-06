# Project Blueprint

## Overview

This project is a Legacy Planning AI Assistant for Singapore. It helps users generate a legacy plan based on their personal and financial information.

## Current State

The application is a single-page web application with a form to collect user data and a section to display the generated legacy plan. It uses basic HTML, CSS, and JavaScript.

## Current Requested Change & Plan

The user has requested the implementation of several UI/UX and feature improvements. The plan is broken down into subtasks for each improvement.

### 1. Implement Web Components for UI Modularity

*   **1.1. Create a `<legacy-input-form>` Web Component:** This component will encapsulate the client information form.
*   **1.2. Create a `<legacy-plan-display>` Web Component:** This component will encapsulate the results section (Legacy Plan, Action Checklist, Next Steps & Resources).
*   **1.3. Integrate these Web Components into `index.html`:** Replace the existing form and results sections with the new custom elements.

### 2. Interactive and Dynamic Form Elements

*   **2.1. Implement conditional field visibility:** Based on marital status, show/hide relevant fields (e.g., spouse's name, spouse's birth date).
*   **2.2. Enhance birth date input:** Use a user-friendly date picker (e.g., native HTML `date` input with min/max or a simple JS-based solution).
*   **2.3. Implement basic autocomplete/suggestions:** For "Medical History," "Assets," and "Debts" fields, provide suggestions based on a predefined client-side list of common entries.

### 3. Real-time Form Validation with Clear Feedback

*   **3.1. Add client-side validation logic:** Implement validation for all required fields and specific formats (e.g., dates).
*   **3.2. Implement visual feedback:** Provide immediate visual cues for valid/invalid fields (e.g., border color changes, checkmarks/X icons, inline error messages).

### 4. Enhanced Loading States and Progress Indicators

*   **4.1. Modify the "Generate Legacy Plan" button:** Disable the button upon click to prevent multiple submissions.
*   **4.2. Add a loading indicator and message:** Display a spinner or progress bar and an informative message (e.g., "Generating your personalized plan...") while processing.

### 5. Interactive and Digestible Results Display

*   **5.1. Make results sections collapsible:** Implement functionality to collapse/expand the "Action Checklist" and "Next Steps & Resources" sections.
*   **5.2. Implement client-side checklist item completion:** Allow users to mark checklist items as complete, with their status stored in local storage for persistence.
*   **5.3. Add "What's This?" tooltips/info icons:** For key terms or complex concepts in the results, provide small info icons that reveal brief explanations on hover/click.

### 6. Client-Side "Save/Download Plan" Feature

*   **6.1. Add a "Download Plan" button:** Place a button in the results section.
*   **6.2. Implement client-side logic to generate a PDF or text file:** Convert the content of the displayed legacy plan into a downloadable PDF or text file.