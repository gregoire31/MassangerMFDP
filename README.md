# Massanger MFDP

Massanger MFDP est une application de messagerie instantanée, basée entièrement sur un hébergeur Cloud.

Elle permet de créer une conversation avec une ou plusieurs personnes, si celles-ci sont amies avec vous.
Ces conversations peuvent être supprimées et il est possible de supprimer des amis d'une conversation.
Dans une conversation on peut démarrer une conversation vidéo grâce à la technologie WebRTC.
Le rôle d'administrateur dans une conversation est délivré par défaut au créateur et il lui est possible de l'octroyer à d'autres membres de la conversation.

Une liste d'amis est aussi disponible, on peut ajouter des amis et les supprimer, supprimant par la même occasion la conversation personnelle avec celui-ci.

Dans l'onglet profil, nous pouvons modifier le pseudo ainsi que la photo de profil, directement depuis les dossiers du téléphone, ou en prenant directement une photo.


## Préparation

- Avoir installé NodeJS et NPM 
- Récupérer le fichier .zip représentant le projet : https://github.com/gregoire31/MessageriePropre.git


## Installation

Lancer un terminal dans le dossier contenant le projet et écrire la commande :

```
npm install
```
Lancer ensuite le serveur de développement local depuis la commande :
```
ionic serve
```
L'application s'executera alors sur navigateur.


Dans le cas d'une implémentation de l'application sur un téléphone, brancher celui-ci à la machine.
Vérifier que le mode développeur et le débogage USB soient bien activés.
Lancer la commande : 
```
ionic cordova run android
```

Auteurs

    Grégoire Maria - Maxime Poulet - Nicolas Ferrer - Cédric Dethoit
