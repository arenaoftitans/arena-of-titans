<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib tagdir="/WEB-INF/tags" prefix="t" %>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="/css/rules.css" />
        <link rel="stylesheet" href="/css/aot.css" />
        <link href='http://fonts.googleapis.com/css?family=Berkshire+Swash' rel='stylesheet' type='text/css'>
        <title>Arena of Titans</title>
    </head>
    <body>
        <div id="header">

        </div>

        <div id="top">
            <a id="lien_accueil" href="/"></a>
            <ul>
                <li><a id="item1" href="/rules">Règles</a></li>
                <li><a id="item2" href="/synopsis">Synopsis</a></li>
                <li><a id="item3" href="#">Actualité</a></li>
                <li><a id="item4" href="#">Communauté</a></li>
            </ul>
        </div>

        <div id="connexion">
            <div id="conteneur_connexion">
                <p id="mot_connexion">CONNEXION :</p>
                <form method="post" action="playerpage.html">
                    <input type="text" id="pseudo" placeholder="Pseudo"></input>
                    <input type="password" id="mdp" placeholder="Mot de passe"></input>
                    <button type="submit" id="OK">OK</button>
                </form>
                <a id="item5" href="/game">Partie Rapide</a>
            </div>
        </div>

        <div id="middle">
            <div id="fond0">
                <h1>Règles Générales</h1>
                <div id="fond0_left" class="left">
                    <h2 id="titre_but">But du jeu</h2>
                    <p id="but">En partant d'un bout d'une branche du plateau, soyez le premier à le traverser jusqu'à atteindre la dernière ligne opposée et à y rester pendant un tour.</p>
                </div>
                <div id = "plateau" class="right"></div>
            </div>
            <div id="fond1">

                <div id="fond1_left" class="left">
                    <h2>Déplacements</h2>
                    <p>Les cartes Déplacement sont les cartes à bords jaunes, noirs, rouges et bleus.<br/>
                        Lorsque vous utilisez une carte Déplacement, vous pouvez avancer votre pion sur le plateau.<br/>
                        Le nombre de cases, la couleur des cases et le type de mouvement que vous pouvez faire sont imposés par la carte que vous avez jouée.
                    </p>
                    <div id="deplacement"></div>
                </div>
                <div id="fond1_right" class="right"></div>
            </div>

            <div id="fond2">
                <div id="cartes_deplacement1" class="cartes_deplacement"></div>
            </div>

            <div id="fond3">
                <div id="cartes_deplacement2" class="cartes_deplacement"></div>
            </div>

            <div id="fond4">
                <div id="fond4_left" class="left">
                    <h2>Atouts</h2>
                    <p>Avant une partie, vous avez la possibilité de créer un Build contenant 4 Atouts.<br/>
                        Les Atouts servent à bloquer les autres joueurs, bloquer les atouts des autres joueurs, améliorer vos déplacements,…</p>
                    <div id="build"></div>
                </div>
                <div id="fond4_right" class="right">
                </div>
            </div>

            <div id="fond5">
                <p id="text_heros" class="left">Choisissez votre Héros parmi les 8 peuples.<br/>
                    Chaque Héros possède une compétence spécifique qui vient compléter votre Build.
                </p>
                <div id="heros" class="right"></div>
            </div>
        </div>

        <div id="footer">

        </div>

        <t:piwik />
    </body>
</html>
