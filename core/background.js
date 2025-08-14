// Définir les valeurs par défaut lors de l'installation de l'extension
chrome.runtime.onInstalled.addListener((details) => {
    // Ne définir les paramètres qu'à la première installation
    if (details.reason === 'install') {
        chrome.storage.local.set({
            extensionEnabled: true,
            zoomMode: 'natural', // 'natural' ou 'page'
            zoomFactor: 2
        }, () => {
            console.log("Hover Zoom: Default settings initialized.");

            // Injecter le script et le CSS dans les onglets déjà ouverts
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach((t) => {
                    if (t.url && t.url.startsWith('http')) {
                        chrome.scripting.insertCSS({
                            target: { tabId: t.id },
                            files: ['core/zoom.css']
                        });
                        chrome.scripting.executeScript({
                            target: { tabId: t.id },
                            files: ['core/content.js']
                        });
                    }
                });
            });
        });
    }
});

// Écoute les mises à jour des onglets pour injecter le script si nécessaire
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // S'assurer que la page est complètement chargée et que c'est une page web standard
    if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
        chrome.storage.local.get('extensionEnabled', (data) => {
            if (data.extensionEnabled !== false) {
                // Injecte le CSS et le script de contenu
                chrome.scripting.insertCSS({
                    target: { tabId: tabId },
                    files: ['core/zoom.css']
                });
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['core/content.js']
                });
            }
        });
    }
});

// Écoute les mises à jour des onglets pour injecter le script si nécessaire
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // S'assurer que la page est complètement chargée et que c'est une page web standard
    if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
        chrome.storage.local.get('extensionEnabled', (data) => {
            if (data.extensionEnabled) {
                // Injecte le CSS et le script de contenu
                chrome.scripting.insertCSS({
                    target: { tabId: tabId },
                    files: ['core/zoom.css']
                });
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['core/content.js']
                });
            }
        });
    }
});
