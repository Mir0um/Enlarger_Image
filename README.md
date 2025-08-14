# Hover_Zoom
*[English version](README_EN.md)*

![Icône de l'extension](icons/icon128.png)

Une extension Chrome simple, légère et efficace conçue pour l'accessibilité. Elle permet d'agrandir les images au survol de la souris, aidant ainsi les utilisateurs, notamment ceux ayant une déficience visuelle, à naviguer sur le web plus confortablement.

[![Licence: MIT](https://img.shields.io/badge/Licence-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## Démonstration

![Démonstration de Image Agrandisseur](demo.gif)

## Fonctionnalités principales

*   **Agrandissement au survol** : Pas besoin de cliquer, il suffit de passer la souris sur un élément pour l'activer.
*   **Détection Intelligente** : Fonctionne sur les balises `<img>` et `<video>` ainsi que sur les liens `<a>` pointant vers des fichiers image ou vidéo. 
    *   **Formats d'images supportés** : `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`, `.bmp`, `.apng`, `.ico`, `.tif`, `.tiff`
    *   **Formats vidéo supportés** : `.mp4`, `.webm`, `.ogg`, `.ogv`, `.mov`, `.mkv`, `.flv`
*   **Lecture automatique des vidéos** : Lorsqu'une vidéo est détectée, elle se lance automatiquement, sans son et en boucle dans la fenêtre d'aperçu.
*   **Gestion des URLs relatives** : Détection intelligente des liens d'images qui fonctionne avec les URLs relatives et absolues.
*   **Deux Modes d'Affichage** :
    1.  **Taille Doublée (côté)** : Affiche l'image à 200% de sa taille originale dans une fenêtre à côté du curseur. La fenêtre se positionne intelligemment à droite ou à gauche pour ne jamais sortir de l'écran.
    2.  **Pleine Largeur (superposé)** : Affiche l'image en grand format, superposée au contenu de la page et occupant la largeur de la fenêtre.
*   **Contrôle Total** : Un popup simple et intuitif vous permet d'activer/désactiver l'extension et de changer de mode à la volée.
*   **Facteur de zoom configurable** : Ajustez le niveau d'agrandissement directement depuis le popup (précision décimale de 0,1).
*   **Positionnement intelligent** : La fenêtre d'aperçu se positionne automatiquement pour rester visible à l'écran.
*   **Animations fluides** : Transitions en douceur avec des effets d'animation lors de l'affichage.
*   **Fermeture rapide avec Échap** : Appuyez simplement sur la touche `Échap` pour fermer instantanément toute prévisualisation en cours, sans avoir besoin de déplacer la souris.
*   **Léger et Performant** : Conçu pour avoir un impact minimal sur les performances de navigation, en n'activant les scripts que lorsque c'est nécessaire.

## Langues supportées

L'extension est disponible en **27 langues** :

🌍 **Européennes** : Français, Anglais, Allemand, Espagnol, Italien, Néerlandais, Polonais, Portugais, Russe, Suédois, Norvégien, Finnois, Danois, Tchèque, Hongrois, Ukrainien, Turc

🌏 **Asiatiques** : Chinois simplifié, Japonais, Coréen, Hindi, Thaï, Vietnamien, Indonésien, Malais

🌍 **Autres** : Arabe, Bengali

L'interface s'adapte automatiquement à la langue de votre navigateur.

## Installation

Vous pouvez installer l'extension directement depuis le [Chrome Web Store](https://chromewebstore.google.com/detail/gkhghnhoflimlafecekklclepijjaemp).

Pour une installation manuelle, suivez ces étapes :

1.  **Téléchargez le projet** :
    *   Clonez ce dépôt : `git clone https://github.com/[VotreLien]/vision-aid-magnifier.git`
    *   OU téléchargez le projet en tant que fichier ZIP et décompressez-le.

2.  **Ouvrez Google Chrome** et naviguez vers la page des extensions : `chrome://extensions`.

3.  **Activez le Mode Développeur** : Cochez l'interrupteur en haut à droite de la page.

4.  **Chargez l'extension** :
    *   Cliquez sur le bouton **"Charger l'extension non empaquetée"**.
    *   Une fenêtre de sélection de dossier s'ouvre. Naviguez jusqu'au dossier du projet (celui qui contient `manifest.json`) et sélectionnez-le.

5.  **C'est terminé !** L'icône de Image Agrandisseur devrait apparaître dans votre barre d'outils Chrome.

## Comment l'utiliser

1.  Cliquez sur l'icône de l'extension dans la barre d'outils pour ouvrir le popup de configuration.
2.  Utilisez l'interrupteur principal pour **activer ou désactiver** l'extension.
3.  Choisissez votre **"Mode d'agrandissement"** préféré :
    *   `Taille doublée (côté)` : Idéal pour inspecter rapidement des images sans perdre le contexte de la page.
    *   `Pleine largeur (superposé)` : Parfait pour voir une image dans les moindres détails.
4.  Réglez le **facteur de zoom** selon vos besoins.

Les modifications sont sauvegardées et appliquées instantanément.

## Contributions

Les contributions sont les bienvenues ! Si vous avez des idées d'amélioration ou des corrections de bugs, n'hésitez pas à :
1.  Forker le projet.
2.  Créer une nouvelle branche (`git checkout -b feature/une-super-fonctionnalite`).
3.  Commit vos changements (`git commit -m 'Ajout de une-super-fonctionnalite'`).
4.  Push vers la branche (`git push origin feature/une-super-fonctionnalite`).
5.  Ouvrir une Pull Request.

## Crédits

*   **Créateur** : Sartoris Jean-Paul (Miroum)
*   **Inspiration** : Ce projet est fortement inspiré par l'excellente extension [**Imagus** de TheFantasticWarrior](https://github.com/TheFantasticWarrior/chrome-extension-imagus), qui a défini des standards élevés dans ce domaine.

## Licence

Ce projet est distribué sous la Licence MIT. Voir le fichier `LICENSE` pour plus de détails.
