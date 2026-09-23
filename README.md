# 🏛️ E-Législation — Outil d'Aide à l'Édition de Textes Juridiques

Application web d'assistance à la rédaction légistique, au contrôle formel de conformité, au scellement et à la transmission administrative des textes normatifs (Arrêtés, Décrets), conçue selon les exigences du **Secrétariat Général du Gouvernement (SGG)**.



## 🎯 Contexte et Objectifs

Dans le cadre de la modernisation des processus administratifs,  l'outils d'aide a l'edition fournit un environnement unifié pour les directions juridiques et les rédacteurs ministériels. L'application répond à des enjeux précis :

* **Rigueur légistique :** Structuration stricte du texte selon les normes républicaines .
* **Assistance en temps réel :** Aperçu miroir instantané sur une feuille A4 virtuelle pendant la saisie.
* **Intégrité documentaire :** Verrouillage formel de l'acte dès sa finalisation pour interdire toute altération non tracée.
* **Interopérabilité sans dépendance :** Génération native de documents bureautiques directement exploitables sous Microsoft Word et LibreOffice Writer, ainsi que d'exports PDF normés.



## 🔄 Workflow Normatif (Les 3 Modules)

Le cycle d'élaboration d'un document  suit un parcours linéaire et sécurisé :

```text
┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│        MODULE 1         │ ───> │        MODULE 2         │ ───> │        MODULE 3         │
│  Catalogue des Modèles  │      │  Édition Live & Visas   │      │ Export & Transmission   │
│   (Arrêtés, Décrets)    │      │    (Rendu miroir A4)    │      │  (Word, PDF, SGG API)   │
└─────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```

### Module 1 — Sélection du modèle
* Choix du gabarit juridique adapté (Arrêté ministériel, Décret simple).
* Initialisation de la formule pivot appropriée (`ARRÊTE :` ou `DÉCRÈTE :`) et de la trame institutionnelle.
* Détection automatique et proposition de restauration d'un brouillon non finalisé.

### Module 2 — Outil d'aide à l'édition & Aperçu direct
* **Formulaire guidé :** Découpage clair par sections normatives (Timbre ministériel, Intitulé, Objet, Visas hiérarchisés, Articles du dispositif, Bloc de signature).
* **Rendu miroir A4 temps réel :** Visualisation immédiate sur une page calibrée (210 × 297 mm) avec typographie légale (`Liberation Serif` / `Times New Roman` à 11pt).
* **Gestion des listes dynamiques :** Ajout, modification, réordonnancement et suppression de visas ou d'articles.
* **Persistance locale cloisonnée :** Sauvegarde automatique dans le `localStorage` avec des clés isolées par identifiant de gabarit pour éliminer tout risque d'écrasement accidentel.

### Module 3 — Finalisation, Exportation & Transmission
Ce module concrétise les exigences fonctionnelles d'homologation légistique :
* **EF-3.1 & EF-3.2 — Génération et Téléchargement :**
  * **Word (.doc) :** Fichier bureautique propre structuré en XML/HTML Office, sans bordures de tableaux parasites, garantissant un calage exact de la signature à droite sous Microsoft Word et LibreOffice Writer (Linux/Ubuntu).
  * **PDF officiel :** Généré via le moteur d'impression natif du navigateur (`window.print()`) et calibré par règles CSS `@page` et `@media print` pour masquer toute l'interface applicative.
  * **Archive JSON :** Export de l'arbre sémantique complet des données pour archivage et indexation.
* **EF-3.3 — Scellement de l'acte :**
  * Passage au statut `FINALISE` et verrouillage intégral du document.
  * Blocage formel de la réédition pour préserver l'intégrité juridique du texte validé.
* **EF-3.4 — Stockage & Transmission SGG :**
  * Boîte modale de transmission avec assignation du numéro de dossier SGG, sélection du destinataire habilité (Direction du Contrôle Légistique, SGA, Journal Officiel), degré d'urgence et bordereau d'accompagnement.



## 🛠️ Stack Technique & Choix de Conception

* **Framework :** [Angular](https://angular.dev/) (Architecture Standalone).
* **Gestion d'état réactive :** Primitives modernes **Angular Signals** (`signal()`, `computed()`), garantissant une détection de changements granulaire et des performances optimales sans la lourdeur d'un store tiers.
* **Typage strict :** TypeScript avec modélisation dédiée de la structure légistique et des métadonnées de traçabilité.
* **Zéro librairie de conversion externe :** Utilisation exclusive des standards du Web (`Blob`, `URL.createObjectURL`, `window.print`, UTF-8 BOM `\ufeff`). Le bundle applicatif reste ultra-léger et rapide à charger.



## 📂 Architecture du Code Source

```text
src/app/
├── core/
│   ├── models/
│   │   ├── template.model.ts          # Interfaces des structures légistiques
│   │   └── workflow-state.model.ts    # Statuts de cycle de vie et métadonnées SGG
│   └── services/
│       └── workflow-state.services.ts # Machine à états réactive (Signals & localStorage)
│
├── layout/
│   └── components/
│       ├── header/                    # Bandeau institutionnel
│       └── stepper/                   # Indicateur d'avancement du workflow
│
├── features/
│   ├── template-selection/            # Module 1 : Sélection du gabarit
│   ├── live-editor/                   # Module 2 : Formulaire & prévisualisation A4
│   └── document-export/               # Module 3 : Finalisation, exports & transmission SGG
│
├── app.component.ts                   # Composant racine orchestrant les étapes
└── main.ts                            # Point d'entrée de l'application
```



## 🚀 Installation & Démarrage

### Prérequis
* **Node.js** (version 18.x ou supérieure)
* **NPM** (version 9.x ou supérieure)
* **Angular CLI** (`npm install -g @angular/cli`)

### Procédure

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/<votre-nom-utilisateur>/<nom-du-repo>.git
   cd <nom-du-repo>
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement :**
   ```bash
   ng serve
   ```
   L'application sera accessible à l'adresse : `http://localhost:4200/`.

4. **Compiler pour la mise en production :**
   ```bash
   ng build
   ```



## 🖨️ Recommandations d'Utilisation

* **Pour l'export PDF (via la fenêtre d'impression) :**
  Dans les paramètres d'impression du navigateur, veillez à **décocher la case « En-têtes et pieds de page »** pour supprimer l'affichage automatique de la date et de l'URL web sur la feuille officielle.



