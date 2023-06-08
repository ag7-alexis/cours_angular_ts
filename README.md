# RENDU TP DANS emploi-paul

## Etudiant

GUAY Alexis | M2 IW | Angular en entreprise

## Commentaire

Pour ne pas faire encore comme je fais en entreprise et tester des nouveaux trucs, j'ai voulu tester un peu les nouveautés d'Angular sortit dernièrement vu que dans mon entreprise on est en Angular 13.

## Objectif de l'application

On choisi un métier, on consulte des offres d'emplois et on les sauvegarde.
J'utilise https://api.gouv.fr/les-api/api-la-bonne-alternance pour avoir la liste des métiers ainsi que des offres d'emploi liée a ces métiers.
Et pour sauvegarder les offres, j'utilise Firestore. Et il y a un système d'authentification qui utilisait Firebase.

## Details

### signal

J'ai testé les signals qui sont étais rajouté dans Angular 16. Première fois que je les utilise et je n'ai pas trouvé énormément de ressource intéressante sur comment s'en servir dans Angular.
Du coup, j'ai utilisé ça comme des store-component que je déclare dans une sandbox. Mon signal je l'utilise avec une class (SavedJobOffersState par exemple) qui est censé décrire la réalité de ma page, par exemple un mode qui correspond à quelle partie de la page on va afficher (loading/loaded/error) et un statut qui correspond à l'action en cours (delete-ongoing, delete-done, delete-error).

### sandbox

Pour essayer d'avoir un code assez propre, j'ai fait un découpage component/sandbox. Le but était que le component serve uniquement à gérer les interactions et comportements avec l'utilisateur. La sandbox a pour rôle de gérer les données, en faisant appel aux différents services et en mettant à jour son signal. Les sandbox sont provide au niveau des component pour être destroy quand le component est destroy et ainsi évité les fuites de mémoire.

### Services

Pour les services, j'ai fait une class abstract qui définit un contrat pour mon service (exemple: AuthService). Du coup je provide une class Default qui implémente cette abtract class, ça rendra plus faciles les tests si la complexité augmentée, car on pourrait faire un mock de l'abstract class.

### inject

J'ai utilisé inject, je ne sais pas si c'est très récent, mais c'est assez clean de pouvoir faire de l'injection de dépendance en dehors du constructor.

### Taiga UI

J'ai voulu changé un peu d'Angular Matérial, je sais qu'Angular Matérial est très utilisé, car il a le gros avantage d'être développé par l'équipe qui gère Angular donc niveau pérennité, on est bien.
Taiga UI, a été créé par des dev certifié expert Angular par Google, ils sont très actifs dans l'écosystème open-source d'Angular.
Il y a pas mal de pipes/directives intéressantes et les components sont visuellement propre.
Une des grosses différences avec Angular Matérial c'est que Taiga UI utilise au maximum des directives contrairement à Angular Matérial qui fait ça avec des components, ce qui le rend beaucoup plus permissif, je trouve.
https://indepth.dev/posts/1413/taiga-ui
