document.addEventListener('DOMContentLoaded', () => {
    // Set page language to match browser UI
    document.documentElement.lang = chrome.i18n.getUILanguage();
    // --- SÉLECTEURS ---
    const toggleSwitch = document.getElementById('toggle-extension');
    const zoomOptionsDiv = document.getElementById('zoom-options');
    const zoomModeRadios = document.querySelectorAll('input[name="zoomMode"]');
    const githubLink = document.getElementById('github-link');
    const imagusLink = document.getElementById('imagus-link'); // NOUVEAU

    // --- LOGIQUE DES OPTIONS (INCHANGÉE) ---
    chrome.storage.local.get(['extensionEnabled', 'zoomMode'], (result) => {
        toggleSwitch.checked = result.extensionEnabled ?? true;
        updateOptionsVisibility(toggleSwitch.checked);

        const mode = result.zoomMode ?? 'natural';
        document.querySelector(`input[value="${mode}"]`).checked = true;
    });

    toggleSwitch.addEventListener('change', (event) => {
        const isEnabled = event.target.checked;
        chrome.storage.local.set({ extensionEnabled: isEnabled });
        updateOptionsVisibility(isEnabled);
        notifyContentScriptOfUpdate();
    });

    zoomModeRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            if (event.target.checked) {
                chrome.storage.local.set({ zoomMode: event.target.value });
                notifyContentScriptOfUpdate();
            }
        });
    });

    function updateOptionsVisibility(isEnabled) {
        zoomOptionsDiv.classList.toggle('disabled', !isEnabled);
    }

    async function notifyContentScriptOfUpdate() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab) {
                chrome.tabs.sendMessage(tab.id, { type: 'SETTINGS_UPDATED' });
            }
        } catch (error) {
            console.error("Could not send message to content script:", error);
        }
    }

    // --- LOGIQUE DES LIENS EXTERNES ---
    
    // Fonction réutilisable pour ouvrir les liens externes
    function handleExternalLink(event) {
        event.preventDefault(); 
        chrome.tabs.create({ url: event.currentTarget.href });
    }

    githubLink.addEventListener('click', handleExternalLink);
    imagusLink.addEventListener('click', handleExternalLink); // NOUVEAU
});