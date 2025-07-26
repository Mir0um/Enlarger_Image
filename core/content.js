(() => {
    if (window.hasImageMagnifier) {
        return;
    }
    window.hasImageMagnifier = true;

    let settings = { extensionEnabled: true, zoomMode: 'natural' };
    
    let zoomOverlay, zoomOverlayImage;
    let zoomViewer, zoomViewerImage;
    let rafId = null;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // NOUVEAU: Fonction utilitaire pour vérifier si une URL pointe vers une image
    // C'est plus robuste que de simplement vérifier l'extension.
    function isImageUrl(url) {
        try {
            // Utilise l'API URL pour analyser le lien (gère aussi les URLs relatives)
            const path = new URL(url, location.href).pathname.toLowerCase();
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
            // Vérifie si le chemin de l'URL se termine par une extension d'image
            return imageExtensions.some(ext => path.endsWith(ext));
        } catch (e) {
            // Si l'URL est invalide (ex: "javascript:void(0)")
            return false;
        }
    }

    function createZoomElements() {
        if (document.getElementById('image-zoom-overlay')) return;

        zoomOverlay = document.createElement('div');
        zoomOverlay.id = 'image-zoom-overlay';
        zoomOverlayImage = document.createElement('img');
        zoomOverlay.appendChild(zoomOverlayImage);

        zoomViewer = document.createElement('div');
        zoomViewer.id = 'image-zoom-viewer';
        zoomViewerImage = document.createElement('img');
        zoomViewer.appendChild(zoomViewerImage);

        document.body.appendChild(zoomOverlay);
        document.body.appendChild(zoomViewer);
    }

    function loadSettings() {
        chrome.storage.local.get(['extensionEnabled', 'zoomMode'], (result) => {
            settings.extensionEnabled = result.extensionEnabled ?? true;
            settings.zoomMode = result.zoomMode ?? 'natural';
            updateEventListeners();
        });
    }

    function updateEventListeners() {
        document.removeEventListener('mouseover', handleMouseOver);
        hideAllZoom();
        if (settings.extensionEnabled) {
            document.addEventListener('mouseover', handleMouseOver);
        }
    }

    function hideAllZoom() {
        if (zoomOverlay) zoomOverlay.style.display = 'none';
        if (zoomViewer) zoomViewer.style.display = 'none';

        document.removeEventListener('mousemove', handleMouseMove);
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        // La gestion du mouseout est maintenant sur l'élément lui-même, pas besoin de le retirer ici.
    }

    // MODIFIÉ: Logique de détection unifiée
    function handleMouseOver(event) {
        const target = event.target;
        let imageUrl = null;

        // Cas 1: C'est une balise <img>
        if (target.tagName === 'IMG' && target.src) {
            if (target.clientWidth < 50 || target.clientHeight < 50) return;
            imageUrl = target.src;
        } 
        // Cas 2: C'est un lien <a> qui pointe vers une image
        else if (target.tagName === 'A' && target.href && isImageUrl(target.href)) {
            imageUrl = target.href;
        }

        // Si on a trouvé une URL d'image, on lance la prévisualisation
        if (imageUrl) {
            // On attache l'écouteur de sortie sur l'élément déclencheur pour plus de fiabilité
            target.addEventListener('mouseout', hideAllZoom, { once: true });
            showZoom(imageUrl, event);
        }
    }
    
    function handleMouseMove(event) {
        if (settings.zoomMode !== 'natural') return;

        lastMouseX = event.clientX;
        lastMouseY = event.clientY;

        if (rafId === null) {
            rafId = requestAnimationFrame(() => {
                positionViewer(lastMouseX, lastMouseY);
                rafId = null;
            });
        }
    }

    // MODIFIÉ: La fonction accepte directement une URL, la rendant plus flexible
    function showZoom(imageUrl, event) {
        if (settings.zoomMode === 'page') {
            zoomOverlayImage.src = imageUrl;
            zoomOverlay.style.display = 'flex';
        } else { // Mode "natural" (doublé)
            zoomViewerImage.src = imageUrl;
            
            zoomViewerImage.onload = () => {
                const newWidth = zoomViewerImage.naturalWidth * 2;
                const newHeight = zoomViewerImage.naturalHeight * 2;
                zoomViewerImage.style.width = `${newWidth}px`;
                zoomViewerImage.style.height = `${newHeight}px`;

                document.addEventListener('mousemove', handleMouseMove);
                positionViewer(event.clientX, event.clientY);
                zoomViewer.style.display = 'block';
                zoomViewerImage.onload = null;
            };
        }
    }

    function positionViewer(mouseX, mouseY) {
        if (!zoomViewer || zoomViewer.style.display === 'none') return;
        
        const offset = 20;
        const viewerWidth = zoomViewer.offsetWidth;
        const viewerHeight = zoomViewer.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const spaceOnRight = viewportWidth - mouseX - viewerWidth - offset;
        if (spaceOnRight > 0 || mouseX < viewerWidth + offset) {
            zoomViewer.style.left = `${mouseX + offset}px`;
        } else {
            zoomViewer.style.left = `${mouseX - viewerWidth - offset}px`;
        }

        let top = mouseY - (viewerHeight / 2);
        if (top < offset) top = offset;
        if (top + viewerHeight > viewportHeight - offset) {
            top = viewportHeight - viewerHeight - offset;
        }
        zoomViewer.style.top = `${top}px`;
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === 'SETTINGS_UPDATED') {
            loadSettings();
        }
    });

    createZoomElements();
    loadSettings();
})();