# 🎌 MyAnimeList

<div align="center">

![Anime List Banner](https://img.shields.io/badge/Animes-Tracker-blue?style=for-the-badge&logo=crunchyroll&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Une application web pour gérer et découvrir vos animes préférés**

[🚀 Démo en ligne](#)  • [🐛 Signaler un bug](../../issues)

</div>

---

## ✨ Aperçu

Ma Liste d'Animes est une application web qui vous permet de gérer votre collection d'animes personnelle. Organisez, notez et découvrez de nouveaux animes facilement. L'application utilise l'API Jikan V4.

### 🖼️ Screenshots

<div align="center">
<img src="https://github.com/YannisAd/myAnimeList/blob/main/img/1.png" alt="Page principale" width="400"/>
<img src="https://github.com/YannisAd/myAnimeList/blob/main/img/2.png" alt="Page détails" width="400"/>
</div>

---

## 🎯 Fonctionnalités

### 📋 Gestion de Liste
- ✅ **Ajout d'animes** via recherche en temps réel
- ✅ **Système de notation** avec étoiles (1-5)
- ✅ **Commentaires personnels** pour chaque anime
- ✅ **Import/Export** de liste en JSON

### 🔍 Recherche & Filtres
- 🔎 **Recherche, filtres et tri** dans votre liste
- 🏷️ **Filtrage par genres** (Action, Romance, Fantasy, etc.)
- ⭐ **Filtrage par note minimale**
- 📊 **Tri multiple** (titre, note, date d'ajout)

### 📱 Interface
- 🎨 **Design responsive** adapté à tous les écrans avec Tailwind CSS
- 🌈 **Animations fluides** et transitions élégantes
- 🎯 **Navigation par onglets** intuitive
- 🔔 **Notifications toast** pour les actions

### 🎬 Découverte d'Animes
- 🔍 **Recherche MyAnimeList** intégrée
- 📺 **Liste des épisodes** détaillée
- 💡 **Recommandations personnalisées**
- 🔗 **Navigation entre animes** recommandés
- 📊 **Informations complètes** (synopsis, genres, durée)

### 🛠️ Fonctionnalités Avancées
- 💾 **Sauvegarde locale** automatique
- 🚀 **Chargement lazy** des données
- 🔄 **Synchronisation** cross-onglets

---

## 🚀 Installation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Connexion internet pour l'API MyAnimeList

### Installation locale

1. **Cloner le repository**
```bash
git clone https://github.com/YannisAd/myAnimeList.git
cd myAnimeList
```

2. **Ouvrir l'application**
```bash
# Ouvrir index.html dans votre navigateur
open index.html
# ou
python -m http.server 8000  # Pour un serveur local
```

3. **C'est prêt !** 🎉

---

## 🎮 Utilisation

### 🔰 Premier lancement
1. Cliquez sur "**Ajouter**" pour ajouter votre premier anime
2. Recherchez un anime dans la barre de recherche
3. Cliquez sur "**Ajouter à ma liste**" 
4. Personnalisez avec une note et des commentaires

### 📚 Gestion de votre liste
- **Noter** : Cliquez sur les étoiles dans les détails
- **Commenter** : Ajoutez vos impressions personnelles
- **Filtrer** : Utilisez les filtres par genre ou note
- **Rechercher** : Tapez dans la barre de recherche

### 🔍 Découverte
- **Épisodes** : Consultez la liste complète des épisodes
- **Recommandations** : Découvrez des animes similaires
- **Navigation** : Explorez les suggestions directement

---

## 🛠️ Technologies Utilisées

<div align="center">

| Frontend | Styling | API | Outils |
|:--------:|:-------:|:---:|:------:|
| ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | ![Jikan API](https://img.shields.io/badge/-Jikan_API-2E51A2?style=flat-square&logo=myanimelist&logoColor=white) | ![Git](https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white) |
| ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | ![Font Awesome](https://img.shields.io/badge/-Font_Awesome-528DD7?style=flat-square&logo=font-awesome&logoColor=white) | ![MyAnimeList](https://img.shields.io/badge/-MyAnimeList-2E51A2?style=flat-square&logo=myanimelist&logoColor=white) | ![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github&logoColor=white) |
| ![jQuery](https://img.shields.io/badge/-jQuery-0769AD?style=flat-square&logo=jquery&logoColor=white) | ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | | |

</div>

### 🏗️ Architecture
- **Frontend** : Vanilla JavaScript + jQuery pour les interactions
- **Styling** : TailwindCSS pour un design moderne et responsive
- **API** : Jikan API v4 (API non-officielle MyAnimeList)
- **Storage** : LocalStorage pour la persistance des données
- **Animations** : CSS3 + transitions custom

---

## 📊 Statistiques du Projet

```
📁 Structure du projet
├── 📄 index.html              # Page principale
├── 📄 anime-details.html      # Page de détails
├── 📁 Javascript/
│   └── 📄 script.js           # Logique principale
├── 📁 img/
│   └── 🖼️ screenshots/       # Captures d'écran
└── 📄 README.md               # Documentation
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

### 🔧 Development Setup
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/...`)
3. Commit vos changements (`git commit -m 'Add some ...'`)
4. Push vers la branche (`git push origin feature/...`)
5. Ouvrir une Pull Request

---

## 🐛 Issues Connues

### 🔍 Limitations actuelles
- [ ] Rate limiting de l'API Jikan (1 req/sec)
- [ ] Pas de support offline complet
- [ ] Export limité au format JSON

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

```
MIT License

Copyright (c) 2024 YannisAd

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---


[⬆ Retour en haut](#-myanimelist)

</div>
