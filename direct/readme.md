# Mise en relation directe

L'idée a emergé fin septembre début octobre de mettre en place une plateforme qui permette aux conducteur.rice.s et passager.ère.s de Lotocar de se contacter directement sans l'intémédiaire d'une personne dédiée à cette tâche

Nous nous sommes vu.e.s le lundi 7 octobre 2019 à Toulouse pour discuter des problèmes que cette plateforme résoud, des personnes concernées et pour commencer un peu de design

Il en résulte : 
- [un board avec des *user story* et des tâches](https://github.com/DavidBruant/lotocar/projects/3?fullscreen=true)
- [des maquettes d'écrans](../design/maquettes)
- une stratégie de déploiment (section suivante)


## Stratégie

### Déploiement

#### MVP

- Le lien sur lotocar.fr pour demander un covoiturage mène vers une page sur un sous-domaine dédié (genre trajets.lotocar.fr) qui permet aux passager.ère.s de chercher des conducteur.rice.s pertinent.e.s par critère géographique
- Les résultats sont anonymisés
- Un bouton permet de contacter le.a conducteur.rice. Ce bouton révèle (sous réserve de consentement):
    - le numéro de téléphone (selon la préférence)
    - l'adresse email (selon la préférence)
    - le contact de Lotocar si la personne n'a fourni de consentement pour aucun

##### Comment

90% du code existe déjà dans [Corresplot](../Corresplot) et le [serveur](../server)
Il manque :
- receuillir le consentement (dont création de colonne dédiée dans le Google Spreadsheet)
- affichage anonymisé
- le bouton de révélation


#### Après

- des analytics pour avoir de la visibilité sur les demandes et les résultats affichés
- ne pas envoyer côté client les données privées (même si elles ne sont pas affichées)


### Considérations transverses

- Grosse considération de compatibilité
    - web
        - Développement *mobile-first* 
        - polyfills
        - babel
- Sécurité
- Privacy
- Relation à Wix

