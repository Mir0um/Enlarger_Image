// Définir les valeurs par défaut lors de l'installation de l'extension
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        extensionEnabled: true,
        zoomMode: 'natural', // 'natural' ou 'page'
        zoomFactor: 2
    });
    console.log("Image Magnifier: Default settings initialized.");
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
