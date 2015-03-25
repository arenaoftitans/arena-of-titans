<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib tagdir="/WEB-INF/tags" prefix="t" %>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="/inc/css/index.css" />
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
                    <input type="text" id="pseudo" placeholder="Pseudo" />
                    <input type="password" id="mdp" placeholder="Mot de passe" />
                    <button type="submit" id="OK">OK</button>
                </form>
                <a id="item5" href="/game">Partie Rapide</a>
            </div>
        </div>

        <div id="middle">

            <div id="fond1">
                <p id="intro"><strong>Oserez-vous entrer dans l'Arène des Titans ?</strong><br/>
                    Créez votre parcours à l’aide de vos cartes Déplacement,<br/>
                    Utilisez celles de vos adversaires pour les devancer,<br/>
                    Bloquez-les à l’aide de vos Atouts,<br/>
                    Arrivez en premier…<br/>
                    Et Survivez !
                </p>

                <div id="demon">

                </div>

                <div id="ange">

                </div>

                <div class="container">
                    <div id="content-slider">
                        <div id="slider">
                            <div id="mask">
                                <ul>
                                    <li id="first" class="firstanimation">
                                        <img src="/inc/img/index/slider_gameplay.png" alt="gameplay"/>
                                        <div class="tooltip">
                                            <h1>Un gameplay unique</h1>
                                        </div>
                                    </li>

                                    <li id="second" class="secondanimation">
                                        <img src="/inc/img/index/slider_multijoueur.png" alt="multijoueur"/>
                                        <div class="tooltip">
                                            <h1>Défiez jusqu'à 7 de vos amis</h1>
                                        </div>
                                    </li>

                                    <li id="third" class="thirdanimation">
                                        <img src="/inc/img/index/version_beta.png" alt="beta"/>
                                        <div class="tooltip">
                                            <h1>Version Bêta disponible !</h1>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="fond2">
                <div id="map">

                </div>
                <div id="fond2_right">
                    <div id = "fond2_right_top">
                        <div id="blue">
                        </div>
                        <div id="yellow">
                        </div>
                    </div>
                    <p id ="text_familles">Quatre familles dominent l’Arène, utilisez l’influence de leurs membres pour pouvoir traverser les différentes zones !</p>
                    <div id = "fond2_right_bottom">
                        <div id="black">
                        </div>
                        <div id="red">
                        </div>
                    </div>
                </div>
            </div>

            <div id="fond3">

                <div id="heros">

                </div>
                <p id="text_heros">Choisissez votre héros parmi les 8 peuples et déchainez son pouvoir contre vos adversaires !</p>
            </div>
        </div>

        <div id="footer">

        </div>

        <t:piwik />
    </body>
</html>