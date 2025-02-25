# TBH Invoice

[![SvelteKit](https://img.shields.io/badge/SvelteKit-%2320192D.svg?style=for-the-badge&logo=svelte&logoColor=FF3E00)](https://kit.svelte.dev) [![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-%2338B2AC.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com) [![DaisyUI](https://img.shields.io/badge/daisyUI-%23FF5C8D.svg?style=for-the-badge)](https://daisyui.com) [![Better SQLite3](https://img.shields.io/badge/Better--SQLite3-3F51B5.svg?style=for-the-badge)](https://github.com/JoshuaWise/better-sqlite3) [![jsPDF](https://img.shields.io/badge/jsPDF-%23E74C3C.svg?style=for-the-badge)](https://github.com/parallax/jsPDF)

TBH Invoice est une application web moderne et responsive permettant de générer, visualiser et gérer des factures de manière efficace. Le projet est développé avec [SvelteKit](https://kit.svelte.dev), stylisé avec [Tailwind CSS](https://tailwindcss.com) et [DaisyUI](https://daisyui.com), et utilise [Better SQLite3](https://github.com/JoshuaWise/better-sqlite3) pour gérer la base de données.

## Fonctionnalités

- **Gestion des Factures**
  - Création, modification et suppression de factures.
  - Attribution automatique d'un numéro de facture au format `année-mois-numéro` (ex. `2025-02-001`).
  - Génération de PDF stylisé incluant logo, informations fixes et dynamiques.
  - Interface moderne et responsive.

- **Gestion des Clients**
  - Création, consultation, modification et suppression de clients.
  - Sélection d’un client existant lors de la création d’une facture pour préremplir les informations.

- **Interface Utilisateur Moderne**
  - Design épuré et responsive avec Tailwind CSS et DaisyUI.
  - Tableau de bord avec menu de navigation global pour accéder aux sections Factures, Clients, Nouvelle facture et Nouveau client.

- **Base de données**
  - Utilisation de SQLite via Better SQLite3 pour stocker les factures et les clients.
  - Structure simple et efficace pour une gestion rapide.