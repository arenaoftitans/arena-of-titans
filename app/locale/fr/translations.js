export default {
    actions: {
        dicarded_card: "{{playerName}} vient de se défausser d'une carte",
        passed_turn: "{{playerName}} vient de passer son tour",
        played_card: "{{playerName}} vient de jouer une carte",
        played_special_action:
            "{{playerName}} vient de jouer une action spéciale sur {{targetName}}",
        played_trump: "{{playerName}} vient de jouer un atout sur {{targetName}}",
        problem: "Il vient d'y avoir un problème",
        special_action_assassination:
            "Clique sur le pion d'un joueur. Tu pourras alors choisir la case sur laquelle tu peux le faire reculer.",
        special_action_info_popup: "Tu viens de jouer une carte avec une action spécial {{action}}",
        trump_played_by: "Joué par {{initiator}}",
    },
    cards: {
        assassin: "Déplacement de deux cases en ligne ou en diagonal.",
        assassin_black: "Assassin de la Montagne",
        assassin_blue: "Assassin de l'Eau",
        assassin_complementary_description:
            "Coup spécial : Assassinat pour faire reculer un joueur.",
        assassin_red: "Assassin de la Forêt",
        assassin_yellow: "Assassin du Désert",
        bishop:
            "Déplacement de deux cases en diagonale. Les cases peuvent être de deux couleurs différentes",
        bishop_black: "Fou de la Montagne",
        bishop_blue: "Fou de l'Eau",
        bishop_red: "Fou de la Forêt",
        bishop_yellow: "Fou du Désert",
        king: "Déplacement de trois cases en ligne",
        king_black: "Roi de la Montagne",
        king_blue: "Roi de l'Eau",
        king_red: "Roi de la Forêt",
        king_yellow: "Roi du Désert",
        knight: "Déplacement d'une case en L",
        knight_black: "Cavalier de la Montagne",
        knight_blue: "Cavalier de l'Eau",
        knight_red: "Cavalier de la Forêt",
        knight_yellow: "Cavalier du Désert",
        queen: "Déplacement de deux cases en ligne ou en diagonal",
        queen_black: "Reine de la Montagne",
        queen_blue: "Reine de l'Eau",
        queen_red: "Reine de la Forêt",
        queen_yellow: "Reine du Désert",
        warrior: "Déplacement d'une case en ligne",
        warrior_black: "Guerrier de la Montagne",
        warrior_blue: "Guerrier de l'Eau",
        warrior_red: "Guerrier de la Forêt",
        warrior_yellow: "Guerrier du Désert",
        wizard:
            "Déplacement d'une case en ligne ou en diagonal. La case peut être de n'importe quelle couleur",
        wizard_black: "Magicien de la Montagne",
        wizard_blue: "Magicien de l'Eau",
        wizard_red: "Magicien de la Forêt",
        wizard_yellow: "Magicien du Désert",
    },
    errors: {
        player_already_connected: "Tu es déjà connecté avec ce navigateur.",
    },
    game: {
        connection_lost: "Connexion avec le serveur perdue",
        create: {
            AI: "Ordinateur",
            CLOSED: "Fermé",
            OPEN: "Ouvert",
            TAKEN: "Pris",
            add: "Ajouter un joueur",
            create: "Créer le jeu",
            enter_name: "Entre ton nom :",
            heroes: "Héros",
            invite: "Invitation",
            invite_text: "Pour inviter tes amis, donne leur ce lien :",
            others: "Autres joueurs",
            players: "Joueurs",
            popup_select_hero: "Choisis ton Héros",
            slot: "Joueur",
        },
        game_over: "Game Over",
        play: {
            back_home_popup_title: "Que voulez-vous faire ?",
            board_select_square: "Cliquez sur la case que vous voulez changer",
            board_select_square_color: "Choisissez la nouvelle couleur de la case",
            cancel_special_action: "Ne pas jouer l'action",
            complete_turn: "Terminer le tour",
            complete_turn_confirm_message: "Êtes-vous sûr de vouloir terminer le tour ?",
            discard: "Défausser",
            discard_confirm_message: "Es-tu sûr de vouloir te défausser de {{cardName}} ?",
            discard_no_selected_card: "Tu dois sélectionner une carte",
            game_over: "Tu viens de terminer le jeu ! Ton rang :",
            no_action: "Il ne s'est rien passé pour l'instant",
            no_possible_target_for_trump:
                "Vous ne pouvez pas jouer cet atout. Aucun joueur ne peut en être la cible.",
            pass: "Passer",
            pass_confirm_message: "Es-tu sûr de vouloir passer ton tour ?",
            pass_special_action: "Passer l'action",
            pass_special_action_confirm_message: "Es-tu sûr de  vouloir passer l'action spéciale ?",
            player_box_cards: "Dernières cartes jouées",
            player_box_trumps: "Atouts actifs sur le joueur",
            select_trump_target: "Qui est la cible de {{trumpname}}?",
            whose_turn_message:
                'C\'est le tour de <br /><strong class="blue-text">{{playerName}}</strong>',
            your_turn: "C'est ton tour !",
        },
    },
    global: {
        alias: "Pseudo",
        back_home: "Page d' Accueil",
        cancel: "Annuler",
        cannot_do_action: "Tu ne peux pas faire cette action :",
        create_new_game: "Nouvelle Partie",
        edit: "Éditer",
        name: "Nom : {{playerName}}",
        no: "Non",
        ok: "OK",
        propose_in_game_help_option: "Voir l’aide intégrée au jeu",
        propose_tutorial_option: "Tutoriel",
        save: "Sauvegarder",
        sound_option: "Sons",
        yes: "Oui",
    },
    powers: {
        domination: "Domination",
        domination_description:
            "Lorsque vous jouez une carte « Dame » vous pouvez vous déplacer de 3 cases au lieu de 2.",
        force_of_nature: "Force de la nature",
        force_of_nature_description: "Ni les tours ni les forteresses ne vous affectent.",
        impassable: "Infranchissable",
        impassable_description:
            "Vos atouts « Forteresses » ne peuvent être annulés par l’effet de l’atout « Bélier »",
        inveterate_ride: "Chevauchée Intrépide",
        inveterate_ride_description:
            'Vos cartes "Cavaliers" peuvent avancer sur des cases de n\'importe quelle couleur.',
        metamorphosis: "Métamorphose",
        metamorphosis_description:
            "Pendant 1 tour vous pouvez copier la compétence héros du joueur de votre choix et son coût d’utilisation est nul.",
        night_mist: "Brume Nocturne",
        night_mist_description: "Disparaissez pour ne pas pouvoir être ciblé.",
        secret_blade: "Lame secrète",
        secret_blade_description: "Transforme vos Guerriers en Assassins",
        terraforming: "Terraformage",
        terraforming_description: "Change la couleur d'une case de votre choix",
    },
    site: {
        connection_button: "Se connecter",
        connection_game: "Partie rapide",
        connection_label: "Connexion",
        founders: {
            story: {
                p1:
                    "Un masque blanc en papier, un costume et un chapeau noir. On n’en sait pas beaucoup plus sur cet étrange personnage qui aurait été désigné par les Titans pour rassembler une équipe d’architectes hors du commun et bâtir l’Arène. De nombreuses rumeurs courent sur M.A.D., certains affirment l’avoir aperçu dans le Monde des humains et d’autres dans le Miroir. On pense qu’il s’agit d’un Ombre ayant le pouvoir de traverser les Mondes mais il pourrait également n’appartenir à aucuns peuples connus…",
                p2:
                    "Disciple du grand architecte nain Djör, c’est le premier architecte trouvé par M.A.D. pour construire l’arène. Bien que disposant d’un sens du beau contestable, les bâtiments qu’il construit traversent les années. Enfin, on suppose, il n’avait jamais rien construit avant sans son maître. Certains racontent que ce dernier l’a fait exilé du royaume des nains car une de ses erreurs de calcul a failli faire s’ébouler le château du roi Rognïr. D’autres qu’il faisait de l’ombre à son maître. Une seule chose est sûr : il élève des Pythons qui, d’après les rumeurs, sont capables de manger des éléphants.",
                p3:
                    "Venu des profondeurs des abysses, ce démon paresseux a pu s’hisser dans la hiérarchie pour atteindre la position d'architecte fondateur. Comment a-t-il fait? Ses méthodes pour y arriver sont, à ce jour, assez obscures, mais certains disent qu’il a graissé la patte d’un Titan, alors que d’autres pensent qu’il est arrivé à un moment où les Titans n'avaient pas le luxe de pouvoir faire les difficiles… En tout cas, une chose est sûre, son rang de démon très inférieur, couplé aux rumeurs sur son escalade sociale, lui ont valu le surnom de l’Imposteur.",
                p4:
                    "D’origine incertaine, mais d’apparence humaine, Apenett a longtemps parcouru le monde pour accroître ses pouvoirs magiques. Le Sorcier vit désormais reclus dans sa tour. Paranoïaque, il a entouré son repère de pièges. Cependant, avec son grand âge, sa mémoire n'est plus ce qu'elle était et il lui arrive - lors de ses très rares excursions - de déclencher ses propres mécanismes malveillants. Il devient très bougon lorsque cela lui arrive et rejette toujours le blâme sur son jardinier.",
                p5:
                    "En cherchant la perfection de son âme, le paladin Aurelion a voulu extérioriser ses désirs à l’aide d’un puissant rituel. Malheureusement l’incantation tourna mal et au lieu d’enfermer ses pulsions il leur donna une conscience propre. Depuis, ces étranges esprits chuchotent à l’oreille du guerrier le poussant parfois jusqu’au bord de la folie. C’est sans doute cette particularité qui intéressa M.A.D. et le conduisit à aller chercher Aurelion dans les falaises où celui-ci s’était retranché. Seul l’art et la recherche du beau arrivent encore à calmer l’esprit du paladin et c’est ainsi qu’il se vit proposer le rôle de Grand Décorateur de l’arène.",
            },
        },
        header_community: "Communauté",
        header_founders: "Fondateurs",
        header_founders_1: "M.A.D.",
        header_founders_2: "Huitus Le Grand",
        header_founders_3: "YuPi l’Imposteur",
        header_founders_4: "Apenett Tarondel",
        header_founders_5: "Aurelion",
        header_moves: "Déplacements",
        header_news: "Actualités",
        header_people: "Peuples",
        header_play: "Jouer",
        header_ranking: "Classement",
        header_rules: "Règles",
        header_synopsis: "Synopsis",
        heroes: {
            arline: "Arline",
            arline_description:
                "Chasseuse hors paire, Arline est une Elfe issue d’une famille modeste de forgerons. Elle a apprit à manier l’arc dès son plus jeune âge et s’est bâtie une solide réputation d’archère d’élite même parmi les hautes castes de la société elfique. Ceux qui l’ont sous-estimée ne sont plus en mesure de le regretter.",
            arline_power:
                "« Brume Nocturne» (actif) : Lorsque vous déclenchez cette compétence, vous disparaissez du plateau de jeu et vos adversaires ne peuvent plus vous cibler pendant 1 tour.",
            arline_short_description:
                "Arline s’est bâtie une solide réputation d’archère d’élite même parmi les hautes castes de la société elfique. Ceux qui l’ont sous-estimée ne sont plus en mesure de le regretter.",
            djor: "Djör",
            djor_description:
                "Djör est un bâtisseur légendaire dont la renommée dépasse de loin les frontières de Nifelheim, le royaume des nains. On raconte qu’il aurait fait fortune en érigeant le château du roi Rognïr et que depuis lors il parcourt les terres du Miroir à la recherche d’aventures et de nouveaux défis.",
            djor_power:
                "« Infranchissable » (passif) : Vos atouts « Forteresses » ne peuvent être annulés par l’effet de l’atout « Bélier »",
            djor_short_description:
                "Djör est un bâtisseur légendaire dont la renommée dépasse les frontières du royaume des nains. Il parcourt les terres du Miroir à la recherche d’aventures et de nouveaux défis.",
            garez: "Garez",
            garez_description:
                "Comme la plupart des centaures, Garez apprécie la boisson, les grillades et les femmes. Lorsqu’il n’est pas occupé à festoyer, il endosse le rôle de commandant des armées du seigneur de guerre Rennack. N’appréciant pas particulièrement le combat, il élimine ses ennemis en un temps record. Ceux qui se trouvent sur sa route peuvent s’attendre à une mort aussi rapide qu’imprévisible.",
            garez_power:
                '« Chevauchée Intrépide » (passif) : Vos cartes "Cavaliers" peuvent avancer sur des cases de n\'importe quelle couleur.',
            garez_short_description:
                "Garez n’apprécie pas particulièrement le combat. Ceux qui se trouvent sur sa route peuvent s’attendre à une mort aussi rapide qu’imprévisible.",
            kharliass: "Kharliass",
            kharliass_description:
                "Kharliass est un démon de classe majeure connue pour avoir semé la panique dans divers pays du monde des humains et orchestré un certains nombres d’émeutes particulièrement sanglantes durant l’Antiquité. Elle plonge ses proies dans un état de confusion totale en revêtant leur propre apparence juste avant de les tuer.",
            kharliass_power:
                "« Métamorphose» (actif) : Pendant 1 tour vous pouvez prendre l’apparence d’un de vos adversaires. Cette compétence est alors remplacée par la compétence héros du joueur sélectionné et son coût d’utilisation est nul.",
            kharliass_short_description:
                "Kharliass est un démon de classe majeure qui plonge ses proies dans un état de confusion totale en revêtant leur propre apparence juste avant de les tuer.",
            luni: "Luni",
            luni_description:
                "Luni est une jeune Ombre aux faits d’armes encore inconnus. Elle maîtrise aussi bien l’art des runes que celui du combat rapproché et son agilité exceptionnelle fait d’elle un adversaire redoutable. Après avoir obtenu son diplôme de la Zefo, elle s’est engagée dans la division des renseignements au service du roi des Ombres.",
            luni_power:
                "« Lame secrète » (actif) :  transforme vos cartes « Fou » en cartes « Assassin »",
            luni_short_description:
                "Luni est une jeune Ombre aux faits d’armes encore inconnus. Sa maîtrise de l’art des runes et son agilité exceptionnelle font d’elle un adversaire redoutable.",
            mirindrel: "Mirïndrel",
            mirindrel_description:
                "Considéré comme l’un des mages les plus puissants de sa génération, Mirïndrel s’est illustré lors des deux dernières grandes guerres contre les démons en déployant des stratagèmes particulièrement ingénieux. Il utilise le terrain qui l’entoure pour piéger ses adversaires ou s’offrir un avantage concurrentiel significatif.",
            mirindrel_power:
                "« Terraformage » (actif) : Lorsque cette compétence est activée, vous avez la possibilité de changer la couleur de n’importe quelle case du plateau de jeu. Le changement de couleur est permanent.",
            mirindrel_short_description:
                "Mirïndrel  est considéré comme l’un des mages les plus puissants de sa génération. Il utilise le terrain pour piéger ses adversaires ou s’offrir un avantage concurrentiel significatif.",
            pitch: {
                p1:
                    "Huit peuples envoient leur champion pour les représenter et tenter d'obtenir la faveur des Titans.",
                p2: "Chaque Héros possède une compétence unique.",
                p3: "Utilise ce pouvoir au bon moment pour prendre l'avantage !",
                title: "Héros",
            },
            razbrak: "Razbrak",
            razbrak_description:
                "Razbrak est le frère cadet du chef du clan Akta-Ross. Expert en maniement des armes, il affectionne en particulier la hache dont il se sert pour décapiter ses ennemis. Sous ses airs de brute sauvage et sanguinaire se cache un véritable artiste : il collectionne les crânes de ses victimes afin de les sculpter et d’en faire de magnifiques bougeoirs.",
            razbrak_power:
                "« Force de la Nature » (passif) : Les atouts « Tour » et « Forteresse » ne vous affectent pas.",
            razbrak_short_description:
                "Razbrak est un expert en maniement d’armes et affectionne particulièrement la hache. Il collectionne les cranes de ses victimes afin de les sculpter.",
            ulya: "Ulya",
            ulya_description:
                "Ulya fait partie des Yrilles, les chevaucheuses d’élite aux ordres de la reine aranéenne. Accompagnée de son Arakoss Vénisse, Ulya s’est distinguée par de nombreux exploits en tournoi et en terrassant un dragon des sables. Les tatouages qui couvrent son corps illustrent ses prouesses au combat. Le duo ne connaît à ce jour aucune défaite.",
            ulya_power:
                "« Domination » (passif) : Lorsque vous jouez une carte « Dame » vous pouvez vous déplacer de 3 cases au lieu de 2.",
            ulya_short_description:
                "Ulya et son Arakoss Vénisse font partie de l’élite de la société Aranéenne. Leurs prouesses sont légendaires et le duo ne connaît à ce jour aucune défaite.",
        },
        homepage: {
            block2: {
                p1: "Sur l'île des Titans, tous les coups sont permis !",
                p2: "Allie toi avec les autres joueurs contre le Héros le plus avancé,",
                p3: "Pour mieux les trahir par la suite !",
                title: "Défie tes futurs Ex-Amis",
            },
            block3: {
                p1: "Il suffit d'atteindre les temples des Titans pour gagner !",
                p2: "Simple non ?",
                p3: "C'était sans compter les Atouts...",
                p4: "Les Titans octroient à chaque Héros 4 Atouts.",
                p5: "De quoi faire du sale à tes adversaires !",
                title: "Un gameplay unique",
            },
            block4: {
                p1: "Chaque Héros possède un Pouvoir Spécifique",
                p2: "A toi d'en faire bonne usage !",
                p3: "Rappelle toi : un Grand Pouvoir implique...",
                p4: "De grandes représailles sur la Dernière Ligne !",
                title: "Déchaine ton Pouvoir",
            },
            block5: {
                p1: "Se déplacer à travers les terrains c'est bien.",
                p2: "Optimiser son chemin c'est mieux !",
                p3: "Mais attention...",
                p4: "Plus tu prends de l'avance,",
                p5: "Plus tu as des chances de devenir la cible des autres Héros !",
                title: "Adapte ta Stratégie",
            },
            families:
                "Quatre familles dominent l’Arène, utilisez l’influence de leurs membres pour pouvoir traverser les différentes zones !",
            heroes:
                "Choisissez votre héros parmi les 8 peuples et déchainez son pouvoir contre vos adversaires !",
            pitch: {
                p1: "Participe à la course ultime pour obtenir la faveur des Titans !",
                p2: "Crée ton parcours à travers les différents terrains,",
                p3: "Bloque tes adversaires avec tes Atouts,      ",
                p4: "Arrive en premier…       ",
                p5: "Et Survis !",
                title: "La fusion entre jeu de course et jeu de stratégie !",
            },
            slider1: "",
            slider2: "Défiez jusqu'à 7 de vos amis",
            slider3: "Version Bêta disponible !",
            tutorial: "<strong>Tutoriel</strong>",
        },
        moves: {
            assassin_black: "Assassin de la Montagne",
            assassin_black_moves:
                'Déplacement de deux cases "Montagne" en ligne ou en diagonal. Coup spécial : Assassinat pour faire reculer un joueur sur une case "Montagne".',
            assassin_blue: "Assassin de l'Eau",
            assassin_blue_moves:
                'Déplacement de deux cases "Eau" en ligne ou en diagonal. Coup spécial : Assassinat pour faire reculer un joueur sur une case "Eau".',
            assassin_red: "Assassin de la Forêt",
            assassin_red_moves:
                'Déplacement de deux cases "Forêt" en ligne ou en diagonal. Coup spécial : Assassinat pour faire reculer un joueur sur une case "Forêt".',
            assassin_yellow: "Assassin du Désert",
            assassin_yellow_moves:
                'Déplacement de deux cases "Désert" en ligne ou en diagonal. Coup spécial : Assassinat pour faire reculer un joueur sur une case "Désert".',
            bishop_black: "Fou de la Montagne",
            bishop_black_moves:
                'Déplacement de deux cases "Montagne" ou "Eau" en diagonale. Les cases peuvent être de deux couleurs différentes',
            bishop_blue: "Fou de l'Eau",
            bishop_blue_moves:
                'Déplacement de deux cases "Eau" ou "Désert" en diagonale. Les cases peuvent être de deux couleurs différentes',
            bishop_red: "Fou de la Forêt",
            bishop_red_moves:
                'Déplacement de deux cases "Forêt" ou "Montagne" en diagonale. Les cases peuvent être de deux couleurs différentes',
            bishop_yellow: "Fou du Désert",
            bishop_yellow_moves:
                'Déplacement de deux cases "Désert" ou "Forêt" en diagonale. Les cases peuvent être de deux couleurs différentes',
            desert: "Désert",
            forest: "Forêt",
            king_black: "Roi de la Montagne",
            king_black_moves: 'Déplacement de trois cases "Montagne" en ligne',
            king_blue: "Roi de l'Eau",
            king_blue_moves: 'Déplacement de trois cases "Eau" en ligne',
            king_red: "Roi de la Forêt",
            king_red_moves: 'Déplacement de trois cases "Forêt" en ligne',
            king_yellow: "Roi du Désert",
            king_yellow_moves: 'Déplacement de trois cases "Désert" en ligne',
            knight_black: "Cavalier de la Montagne",
            knight_black_moves: 'Déplacement d\'une case "Montagne" en L',
            knight_blue: "Cavalier de l'Eau",
            knight_blue_moves: 'Déplacement d\'une case "Eau" en L',
            knight_red: "Cavalier de la Forêt",
            knight_red_moves: 'Déplacement d\'une case "Forêt" en L',
            knight_yellow: "Cavalier du Désert",
            knight_yellow_moves: 'Déplacement d\'une case "Désert" en L',
            mountain: "Montagne",
            pitch: {
                p1:
                    "L'île des Titans se compose de 4 types de terrains : Forêt, Eau, Montagne et Désert.",
                p2:
                    "Les cartes Déplacements te permettent d'invoquer un Esprit qui te guidera à travers ces territoires.",
                p3: "Mais attention, chaque Esprit se déplace d'une façon bien particulière...",
                p4: "A toi d'optimiser tes cartes pour avancer le plus rapidement possible !",
                title: "Déplacements",
            },
            queen_black: "Reine de la Montagne",
            queen_black_moves: 'Déplacement de deux cases "Montagne" en ligne ou en diagonal',
            queen_blue: "Reine de l'Eau",
            queen_blue_moves: 'Déplacement de deux cases "Eau" en ligne ou en diagonal',
            queen_red: "Reine de la Forêt",
            queen_red_moves: 'Déplacement de deux cases "Forêt" en ligne ou en diagonal',
            queen_yellow: "Reine du Désert",
            queen_yellow_moves: 'Déplacement de deux cases "Désert" en ligne ou en diagonal',
            warrior_black: "Guerrier de la Montagne",
            warrior_black_moves: 'Déplacement d\'une case "Montagne" en ligne',
            warrior_blue: "Guerrier de l'Eau",
            warrior_blue_moves: 'Déplacement d\'une case "Eau" en ligne',
            warrior_red: "Guerrier de la Forêt",
            warrior_red_moves: 'Déplacement d\'une case "Forêt" en ligne',
            warrior_yellow: "Guerrier du Désert",
            warrior_yellow_moves: 'Déplacement d\'une case "Désert" en ligne',
            water: "Eau",
            wizard_black: "Magicien de la Montagne",
            wizard_black_moves:
                "Déplacement d'une case en ligne ou en diagonal. La case peut être de n'importe quelle couleur",
            wizard_blue: "Magicien de l'Eau",
            wizard_blue_moves:
                "Déplacement d'une case en ligne ou en diagonal. La case peut être de n'importe quelle couleur",
            wizard_red: "Magicien de la Forêt",
            wizard_red_moves:
                "Déplacement d'une case en ligne ou en diagonal. La case peut être de n'importe quelle couleur",
            wizard_yellow: "Magicien du Désert",
            wizard_yellow_moves:
                "Déplacement d'une case en ligne ou en diagonal. La case peut être de n'importe quelle couleur",
        },
        page_title: {
            create_game: "Créer une partie",
            founders: "Fondateurs",
            heroes: "Héros",
            home: "Accueil",
            not_found: "Page introuvable",
            play_game: "Jouer",
            synopsis: "Synopsis",
            trumps: "Atouts",
        },
        people: {
            header_1: "Orcs",
            header_2: "Aranéennes",
            header_3: "Ombres",
            header_4: "Centaures",
            header_5: "Démons",
            header_6: "Nains",
            header_7: "Elfes",
            header_8: "Elvains",
            story: {
                p1:
                    "Les Orcs forment un peuple fier et indépendant et ne se mélangent qu’à de très rares occasions avec les autres peuples. Mesurant en moyenne dans les deux mètres trente et pesant plus de cent kilos, la génétique a fait des Orcs des guerriers nés. Ils se distinguent néanmoins des autres peuples par une caractéristique bien particulière : les Orcs sont incapables d’utiliser l’art des runes et sont immunisés contre les attaques magiques.",
                p2:
                    "Malgré leur apparence humanoïde, les aranéennes font partie des créatures les plus étranges du Miroir. La société aranéenne repose sur une hiérarchie stricte en haut de laquelle se situe la reine et les Yrilles aussi connues sous le nom de chevaucheuses de mygales. Seules certaines femmes aranéennes sont capables de monter les femelles Arakoss, ces redoutables arachnides pouvant atteindre la taille d’un petit éléphant.",
                p3:
                    "Les Ombres sont la réincarnation des êtres humains dans le Miroir. Après la mort, chaque humain se réincarne en un enfant de 8 ans de l’autre côté, et oublie tout de sa précédente vie. Eduqués à la ZEFO ( Zone d'Entrainement et de Formation des Ombres), les Ombres apprennent les bases du combat au corps à corps, ainsi que les runes dès leur plus jeune âge, pour enfin se spécialiser dans ce qui leur correspond le mieux. Ce sont donc des êtres polyvalents, qui peuvent tout aussi bien maîtriser la magie qu’exceller dans le combat rapproché. ",
                p4:
                    "Les Centaures vivent en tribus et sont un peuple davantage nomade que sédentaire. Ils se déplacent à chaque nouvelle saison et les mouvements des hordes s’entendent sur plusieurs lieues. D’un naturel pacifique, les centaures préfèrent faire la fête aux combats et prennent rarement position lors de conflits qui ne les impactent pas directement. ",
                p5:
                    "Les démons sont des êtres capables de modifier leur apparence selon leur volonté. Chaque démon possède une forme première qui correspond à la forme physique pour laquelle il ne consomme aucune énergie. Les démons ont également la possibilité de demeurer sous forme d’esprit ; ils ne peuvent alors pas influer directement sur la matière. Chaque démon possède un sceau sur la poitrine indiquant son absence de cœur. Le sceau comporte des runes emprisonnement dont le niveau reflète la puissance du démon. Comme les Ombres, les Démons ont le pouvoir de se rendre dans le monde des humains.",
                p6:
                    "Le peuple des nains est l’un des plus vieux peuples du Miroir. Habitants des terres glacés de Nifelheim, les nains sont devenus des experts en ingénierie et sont souvent sollicités par les autres peuples pour leur savoir faire en conception de machines runiques. Les cités naines sont construites à flanc des montagnes ou à l’intérieur de ces dernières. Leur architecture associée au climat rigoureux en fait des forteresses particulièrement difficiles à prendre d’assaut.",
                p7:
                    "Le sud du Miroir abrite les Elfes, des créatures aussi fascinantes que difficiles à cerner. Certains Elfes sont parfaitement capables de s’intégrer au milieu d’autres peuples mais une grande majorité préfère rester dans les vastes forêts qui dissimulent leurs villes aux vues et sues de tous. Les Elfes possèdent une force physique supérieure à celle des Ombres et une maîtrise des runes sans égale dans le Miroir.",
                p8:
                    "Les Elvains sont un peuple cousin de celui des Elfes et des Nains. De petites tailles, les Elvains possèdent une agilité hors norme qui leur permet souvent de prendre de vitesse leur adversaire. Les mages Elvains sont réputés pour leurs invocations d’esprits runiques qui s’avèrent des armes ultra puissantes sur un champ de bataille. Les Elvains aiment voyager et il est fréquent d’en trouver vivant temporairement au milieu d’un autre peuple. La majorité des cartes du Miroir est le fruit de retranscription de leurs épopées.",
            },
        },
        rules: {
            heroes:
                "<h2>Héros</h2>\n                <p>En plus des pouvoirs offerts par les Titans, chaque héros possède une compétence unique (il faut bien qu’ils soient forts à défaut d’être beaux). Cette compétence peut être « passive » c'est-à-dire agir en continu dans l’Arène ou « activable » une fois ta jauge d’exploration suffisamment remplie.</p>",
            moves:
                '<h2>Déplacements</h2>\n                <p>Comme expliqué dans la présentation générale des règles (oui c’est mieux de lire dans l’ordre), l’Arène est divisée en plusieurs zones. Chaque couleur correspond à une zone contrôlée par une famille. Pour la traverser il faut donc avoir l’approbation d’un des membres de cette famille. Et pour avoir l\'approbation, il faut avoir de la chance !\nJe sens que je t’ai perdu alors je vais résumer : tu as une main de cartes aléatoires, donc pour avancer, tu cliques sur une carte puis sur la case où tu veux te déplacer. A chaque tour tu peux jouer jusqu’à deux cartes Déplacement. A toi d’optimiser tes déplacements pour prendre l’avantage !\n                </p>\n                <img src="/latest/assets/rules/aot-move.png"\n                     alt="The moves of the game" />',
            rules:
                '<h1>Général</h1>\n            <div class="half-column-left">\n                <p>Bienvenue dans l’Arène ! Le but est simple (faut pas trop compliquer la chose avec ces idiots de héros...) : la traverser d’un bout à l’autre. Facile non ? Pour ça il faudra juste réussir à se construire un chemin à travers les différentes zones contrôlées par les 4 familles représentant les Titans, esquiver les pièges et autres coups bas de tes ennemis et arriver à la porte de sortie avant eux… bon ok c’est peut-être pas si facile que ça en fait. Mais c\'est pas vraiment mon problème aha !</p>\n            </div>\n            <img class="half-column-right border-black"\n                 src="/latest/assets/homepage/board.png"\n                 alt="The board of the game" />',
            trumps:
                '<h2>Atouts</h2>\n                <p>On le sait, les Titans possèdent un sens de l’humour bien à eux. Pour rajouter un peu de piment à l’affrontement dans l’Arène, ils ont décidé d’octroyer des pouvoirs supplémentaires à chacun des participants. Les atouts te permettent de bloquer tes adversaires ou d’améliorer tes propres déplacements. Il n’appartient qu’à toi de t’acharner sur une personne en particulier ou au contraire de distribuer généreusement les malus à tous tes ennemis. Tu peux aussi t\'allier à d\'autres concurrents pour stopper un ennemi particulièrement avancé, pour ensuite les poignarder dans leur dos... Les plus malins savent quoi faire héhé...\n\nPour pouvoir utiliser tes atouts tu auras besoin d’acquérir des points d’exploration. A chaque zone de l’arène que tu traverseras tu obtiens 1 point d’exploration. Plus ta jauge d’exploration sera remplie et plus tu pourras utiliser des sorts dévastateurs !</p>\n                <img src="/latest/assets/rules/trumps.png"\n                     alt="The trumps" />',
        },
        slide: {
            centaur: "FINISSONS-EN RAPIDEMENT, LE BANQUET M'ATTEND !",
            elf: "ESSAYEZ DONC DE STOPPER CE QUI EST INVISIBLE !",
            orc: "PLUS FACILE D ETRE PREMIER LORSQU'IL NE RESTE PLUS D'ADVERSAIRES...",
        },
        synopsis: {
            story: {
                p1:
                    "Au commencement de tout, lorsque le monde n’était que néant, quatre êtres émergèrent de la matrice originelle que les Elfes nomment Aöctra : l’essence de toutes les essences. Ces créatures furent appelées les Titans. Deux femmes et deux hommes qui avaient pour noms Thézalia, Noya, Daïlum, et Kranth.",
                p2:
                    "Les Titans créèrent les forêts et les mers, les montagnes et les désets. Ils donnèrent ensuite la vie aux sept peuples que sont les Ombres, les Elfes, les Orcs, les Nains, les Arannéens, les Centaures et les Elvains. Ils furent rejoins plus tard par les Démons qui constituèrent le huitième peuple.",
                p3:
                    "Les peuples commencèrent à se battre pour obtenir le pouvoir de gouverner les différents territoires. Les Titans se désintéressèrent alors des peuples et de leurs guerres et créèrent une immense île loin du continent. Ils érigèrent chacun un temple et s'y enfermèrent avant de faire disparaître l'île dans la mer.",
                p4:
                    "Cependant, l'île des Titans refait surface tous les siècles pendant quelques minutes. Pendant ce court laps de temps, les temples des Titans sont de nouveau accessibles et chaque peuple envoie ses meilleurs Héros pour tenter des les atteindre !",
                p5:
                    "En utilisant les Esprits qui peuplent les territoites de l'île et les pouvoirs octroyés par les Titans, les participants doivent réussir à traverser l'île avant leurs concurrents et avant qu'elle ne disparaisse à nouveau ! Cette compétition acharnée où se mêle stratégie, chance et ruse est connue sous le nom de Dernière Course.",
            },
        },
    },
    trumps: {
        assassination: "Assassinat",
        assassination_description: "Permet de faire reculer un joueur d'une case",
        blizzard: "Blizzard",
        blizzard_description: "Réduis de 1 le nombre de cartes qu'un joueur peut jouer",
        fortress_black: "Forteresse de la Montagne",
        fortress_black_description:
            "Empêche le joueur de se déplacer sur les cases de la Montagne pendant deux tours.",
        fortress_blue: "Forteresse de l'Eau",
        fortress_blue_description:
            "Empêche le joueur de se déplacer sur les cases de l'Eau pendant deux tours.",
        fortress_red: "Forteresse de la Forêt",
        fortress_red_description:
            "Empêche le joueur de se déplacer sur les cases de la Forêt pendant deux tours.",
        fortress_yellow: "Forteresse du Désert",
        fortress_yellow_description:
            "Empêche le joueur de se déplacer sur les cases du Désert pendant deux tours.",
        max_number_played_trumps: "Tu ne peux plus jouer d'atouts pendant ce tour",
        max_number_trumps: "Ce joueur ne peut plus être la cible de plus d'atouts pendant ce tour",
        ram: "Bélier",
        ram_description: "Détruit les tours et réduit le temps d'effet des forteresses",
        reinforcements: "Renforcements",
        reinforcements_description:
            "Autorise le joueur à jouer une carte déplacement supplémentaire",
        tower_black: "Tour de la Montagne",
        tower_black_description: "Empêche le joueur de se déplacer sur les cases de la Montagne",
        tower_blue: "Tour de l'Eau",
        tower_blue_description: "Empêche le joueur de se déplacer sur les cases de l'Eau",
        tower_red: "Tour de la Forêt",
        tower_red_description: "Empêche le joueur de se déplacer sur les cases de la Forêt",
        tower_yellow: "Tour du Désert",
        tower_yellow_description: "Empêche le joueur de se déplacer sur les cases du Désert",
    },
};
