# ReseauIOT

KNX ou Konnex est un standard pour la gestion technique des bâtiments résidentiels et tertiaires. Notre but dans ce cours était de réussir à discuter avec une maquette KNX avec le langage de notre choix et de réalisé une application mobile ou web pour réussir à discuté en HTTP avec celle ci.

![alt text](/knxglobal.png)

Dans mon cas, j'ai réalisé toute ce module en NodeJS:

- Un fichier pour controller une maquette KNX, gestion des différents processus qui discute en websocket avec le serveur.
- Un serveur nodejs pour gérer toutes les maquettes KNX ainsi que les clients web, parle une grande partie en websocket aux maquettes et aux clients web.
- Une application web réalisé avec bootstrap qui a pour but de gérer les maquettes, découvrir directement les maquettes présente sur le réseau, pouvoir synchroniser deux maquettes entres elles, avoir un retour en temps réel des actions sur les maquettes et de pouvoir intéragir directement avec elles aussi.
- Une manette de PS4 pour établir une communication Bluetooth avec une maquettes, avec la quelle on peut intéragir avec la maquette etc.

![alt text](/chen.png)
