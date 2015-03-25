<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib tagdir="/WEB-INF/tags" prefix="t" %>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="/inc/css/synopsis.css" />
        <link rel="stylesheet" href="/inc/css/aot.css" />
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

            <div id="fond1">
                <div id ="titans_left"></div>
                <div id="text_synopsis">
                    <h1>Synopsis</h1>
                    <p id="parag1">Au commencement de tout, lorsque le monde n’était que néant, quatre êtres immergèrent de la matrice originelle que les elfes nomment Aöctra : l’essence de toutes les essences. Ces créatures furent appelées les Titans. Deux femmes et deux hommes qui avaient pour noms Thézalia, Noya, Daïlum, et Kranth.</p>
                    <p id="parag2">Les Titans créèrent les continents et les mers, les montagnes et les forêts. Ils donnèrent ensuite la vie aux sept peuples que sont les Ombres, les Elfes, les Orcs, les Nains, les Arannéens, les Centaures  et les Elvains. Ils furent rejoins plus tard par les Démons qui constituèrent le huitième peuple.</p>
                    <p id="parag3">Les peuples commencèrent à se battre pour obtenir le pouvoir de gouverner les différents territoires, et avant de disparaître, les Titans créèrent une immense arène afin de les départager.  Chaque Titan créa une famille à son effigie et lui assigna le contrôle de plusieurs zones de l’Arène.</p>
                    <p id="parag4">Depuis ce jour, chaque peuple envoie ses meilleurs combattants relever le défi de l’Arène des Titans : en utilisant l’influence des quatre familles et les pouvoirs octroyés par les Titans, les participants doivent réussir à traverser l’Arène…avant les autres concurrents !</p>
                    <p id="parag5">Le pouvoir ultime se mérite.</p>
                </div>
                <div id ="titans_right"></div>
            </div>

        </div>

        <div id="footer">

        </div>

        <t:piwik />
    </body>
</html>
