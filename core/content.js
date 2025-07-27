(() => {
    if (window.hasImageMagnifier) {
        return;
    }
    window.hasImageMagnifier = true;

    let settings = { extensionEnabled: true, zoomMode: 'natural' };
    
    let zoomOverlay, zoomOverlayImage, zoomOverlayVideo;
    let zoomViewer, zoomViewerImage, zoomViewerVideo;
    let rafId = null;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // NOUVEAU: Fonction utilitaire pour vérifier si une URL pointe vers une image
    // C'est plus robuste que de simplement vérifier l'extension.
    function isImageUrl(url) {
        try {
            // Utilise l'API URL pour analyser le lien (gère aussi les URLs relatives)
            const path = new URL(url, location.href).pathname.toLowerCase();
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.apng', '.ico', '.tif', '.tiff'];
            // Vérifie si le chemin de l'URL se termine par une extension d'image
            return imageExtensions.some(ext => path.endsWith(ext));
        } catch (e) {
            // Si l'URL est invalide (ex: "javascript:void(0)")
            return false;
        }
    }

    function isVideoUrl(url) {
        try {
            const path = new URL(url, location.href).pathname.toLowerCase();
            const videoExtensions = ['.mp4', '.webm', '.ogg', '.ogv', '.mov', '.mkv', '.flv'];
            return videoExtensions.some(ext => path.endsWith(ext));
        } catch (e) {
            return false;
        }
    }

    function createZoomElements() {
        if (document.getElementById('image-zoom-overlay')) return;

        zoomOverlay = document.createElement('div');
        zoomOverlay.id = 'image-zoom-overlay';
        zoomOverlayImage = document.createElement('img');
        zoomOverlayVideo = document.createElement('video');
        Object.assign(zoomOverlayVideo, { autoplay: true, muted: true, loop: true });
        zoomOverlay.appendChild(zoomOverlayImage);
        zoomOverlay.appendChild(zoomOverlayVideo);

        zoomViewer = document.createElement('div');
        zoomViewer.id = 'image-zoom-viewer';
        zoomViewerImage = document.createElement('img');
        zoomViewerVideo = document.createElement('video');
        Object.assign(zoomViewerVideo, { autoplay: true, muted: true, loop: true });
        zoomViewer.appendChild(zoomViewerImage);
        zoomViewer.appendChild(zoomViewerVideo);

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
        if (zoomOverlay) {
            zoomOverlay.style.display = 'none';
        }
        if (zoomViewer) {
            zoomViewer.style.display = 'none';
        }
        if (zoomOverlayImage instanceof HTMLElement) {
            zoomOverlayImage.removeAttribute('src');
            zoomOverlayImage.style.width = '';
            zoomOverlayImage.style.height = '';
            zoomOverlayImage.onerror = null;
            zoomOverlayImage.onload = null;
        }
        if (zoomViewerImage instanceof HTMLElement) {
            zoomViewerImage.removeAttribute('src');
            zoomViewerImage.style.width = '';
            zoomViewerImage.style.height = '';
            zoomViewerImage.onerror = null;
            zoomViewerImage.onload = null;
        }
        if (zoomOverlayVideo instanceof HTMLVideoElement) {
            zoomOverlayVideo.pause();
            zoomOverlayVideo.removeAttribute('src');
            zoomOverlayVideo.style.width = '';
            zoomOverlayVideo.style.height = '';
            zoomOverlayVideo.onerror = null;
            zoomOverlayVideo.onloadedmetadata = null;
        }
        if (zoomViewerVideo instanceof HTMLVideoElement) {
            zoomViewerVideo.pause();
            zoomViewerVideo.removeAttribute('src');
            zoomViewerVideo.style.width = '';
            zoomViewerVideo.style.height = '';
            zoomViewerVideo.onerror = null;
            zoomViewerVideo.onloadedmetadata = null;
        }

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
        let mediaUrl = null;
        let mediaType = 'image';

        // Cas 1: C'est une balise <img>
        if (target.tagName === 'IMG' && target.src) {
            if (target.clientWidth < 50 || target.clientHeight < 50) return;
            mediaUrl = target.src;
            mediaType = 'image';
        }
        // Cas 1b: Balise <video>
        else if (target.tagName === 'VIDEO' && (target.currentSrc || target.src)) {
            if (target.clientWidth < 50 || target.clientHeight < 50) return;
            mediaUrl = target.currentSrc || target.src;
            mediaType = 'video';
        }
        // Cas 2: C'est un lien <a> qui pointe vers une image
        else if (target.tagName === 'A' && target.href) {
            if (isImageUrl(target.href)) {
                mediaUrl = target.href;
                mediaType = 'image';
            } else if (isVideoUrl(target.href)) {
                mediaUrl = target.href;
                mediaType = 'video';
            }
        }

        // Si on a trouvé une URL d'image, on lance la prévisualisation
        if (mediaUrl) {
            // On attache l'écouteur de sortie sur l'élément déclencheur pour plus de fiabilité
            target.addEventListener('mouseout', hideAllZoom, { once: true });
            showZoom(mediaUrl, event, mediaType);
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

    // MODIFIÉ: La fonction accepte directement une URL et le type de média
    function showZoom(mediaUrl, event, type = 'image') {
        hideAllZoom();

        if (settings.zoomMode === 'page') {
            if (type === 'video') {
                zoomOverlayImage.removeAttribute('src');
                zoomOverlayImage.style.width = '';
                zoomOverlayImage.style.height = '';

                zoomOverlayVideo.onerror = hideAllZoom;
                zoomOverlayVideo.onloadedmetadata = () => {
                    zoomOverlayVideo.onerror = null;
                    zoomOverlayVideo.onloadedmetadata = null;
                };
                zoomOverlayVideo.src = mediaUrl;
                zoomOverlayVideo.style.display = 'block';
                zoomOverlayImage.style.display = 'none';
            } else {
                zoomOverlayVideo.pause();
                zoomOverlayVideo.removeAttribute('src');
                zoomOverlayVideo.style.width = '';
                zoomOverlayVideo.style.height = '';

                zoomOverlayImage.onerror = hideAllZoom;
                zoomOverlayImage.onload = () => {
                    zoomOverlayImage.onerror = null;
                    zoomOverlayImage.onload = null;
                };
                zoomOverlayImage.src = mediaUrl;
                zoomOverlayImage.style.display = 'block';
                zoomOverlayVideo.style.display = 'none';
            }
            zoomOverlay.style.display = 'flex';
        } else { // Mode "natural" (doublé)
            if (type === 'video') {
                if (zoomViewerImage instanceof HTMLElement) {
                    zoomViewerImage.removeAttribute('src');
                    zoomViewerImage.style.width = '';
                    zoomViewerImage.style.height = '';
                }

                zoomViewerVideo.onerror = hideAllZoom;
                zoomViewerVideo.src = mediaUrl;
                zoomViewerVideo.onloadedmetadata = () => {
                    zoomViewerVideo.onerror = null;
                    const dimensions = {
                        width: zoomViewerVideo.videoWidth * 2,
                        height: zoomViewerVideo.videoHeight * 2
                    };
                    adjustViewerSize(zoomViewerVideo, dimensions, event);
                    zoomViewerVideo.onloadedmetadata = null;
                };
                zoomViewerImage.style.display = 'none';
                zoomViewerVideo.style.display = 'block';
            } else {
                if (zoomViewerVideo instanceof HTMLVideoElement) {
                    zoomViewerVideo.pause();
                    zoomViewerVideo.removeAttribute('src');
                    zoomViewerVideo.style.width = '';
                    zoomViewerVideo.style.height = '';
                }

                zoomViewerImage.onerror = hideAllZoom;
                zoomViewerImage.src = mediaUrl;
                zoomViewerImage.onload = () => {
                    zoomViewerImage.onerror = null;
                    const dimensions = {
                        width: zoomViewerImage.naturalWidth * 2,
                        height: zoomViewerImage.naturalHeight * 2
                    };
                    adjustViewerSize(zoomViewerImage, dimensions, event);
                    zoomViewerImage.onload = null;
                };
                zoomViewerVideo.style.display = 'none';
                zoomViewerImage.style.display = 'block';
            }
            document.addEventListener('mousemove', handleMouseMove);
            positionViewer(event.clientX, event.clientY);
            zoomViewer.style.display = 'block';
        }
    }
    
    function adjustViewerSize(element, dimensions, event) {
        const offset = 20;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const spaceLeft = event.clientX - offset;
        const spaceRight = viewportWidth - event.clientX - offset;
        const maxHorizontalSpace = Math.max(spaceLeft, spaceRight);

        let newWidth = dimensions.width;
        let newHeight = dimensions.height;

        const widthLimit = Math.min(maxHorizontalSpace, viewportWidth * 0.9);
        const heightLimit = viewportHeight * 0.9;
        const ratio = Math.min(widthLimit / newWidth, heightLimit / newHeight, 1);
        newWidth *= ratio;
        newHeight *= ratio;

        element.style.width = `${newWidth}px`;
        element.style.height = `${newHeight}px`;
    }

    function positionViewer(mouseX, mouseY) {
        if (!zoomViewer || zoomViewer.style.display === 'none') return;

        const offset = 20;
        const viewerWidth = zoomViewer.offsetWidth;
        const viewerHeight = zoomViewer.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const spaceRight = viewportWidth - mouseX - offset;
        const spaceLeft = mouseX - offset;

        let left;
        if (spaceRight >= spaceLeft) {
            left = Math.min(mouseX + offset, viewportWidth - viewerWidth - offset);
        } else {
            left = Math.max(offset, mouseX - viewerWidth - offset);
        }

        let top = mouseY - (viewerHeight / 2);
        if (top < offset) top = offset;
        if (top + viewerHeight > viewportHeight - offset) {
            top = viewportHeight - viewerHeight - offset;
        }

        zoomViewer.style.left = `${left}px`;
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