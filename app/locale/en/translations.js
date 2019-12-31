export default {
    actions: {
        dicarded_card: "{{playerName}} just discarded a card",
        passed_turn: "{{playerName}} just passed his/her turn",
        played_card: "{{playerName}} just played a card",
        played_special_action: "{{playerName}} just played a special action on {{targetName}}",
        played_trump: "{{playerName}} just played a trump on {{targetName}}",
        problem: "A problem occured",
        special_action_assassination:
            "Click on the pawn of a player. You will then be able to move it back.",
        special_action_info_popup: "You just played a card with a special action {{action}}",
        trump_played_by: "Played by {{initiator}}",
    },
    cards: {
        assassin: "Move two squares in line or diagonal.",
        assassin_black: "Black Assassin",
        assassin_blue: "Blue Assassin",
        assassin_complementary_description:
            "Special action: Assassination to make a player move back.",
        assassin_red: "Red Assassin",
        assassin_yellow: "Yellow Assassin",
        bishop: "Move two squares in diagonal. Can move on two different colors.",
        bishop_black: "Black Bishop",
        bishop_blue: "Blue Bishop",
        bishop_red: "Red Bishop",
        bishop_yellow: "Yellow Bishop",
        king: "Move three squares in line.",
        king_black: "Black King",
        king_blue: "Blue King",
        king_red: "Red King",
        king_yellow: "Yellow King",
        knight: "Move one square in L.",
        knight_black: "Black Knight",
        knight_blue: "Blue Knight",
        knight_red: "Red Knight",
        knight_yellow: "Yellow Knight",
        queen: "Move two squares in line or diagonal.",
        queen_black: "Black Queen",
        queen_blue: "Blue Queen",
        queen_red: "Red Queen",
        queen_yellow: "Yellow Queen",
        warrior: "Move one square in line.",
        warrior_black: "Black Warrior",
        warrior_blue: "Blue Warrior",
        warrior_red: "Red Warrior",
        warrior_yellow: "Yellow Warrior",
        wizard: "Move one squares in line or diagonal. Can move on a square of any color.",
        wizard_black: "Black Wizard",
        wizard_blue: "Blue Wizard",
        wizard_red: "Red Wizard",
        wizard_yellow: "Yellow Wizard",
    },
    errors: {
        player_already_connected: "You are already connected with this browser.",
    },
    game: {
        connection_lost: "Lost connection with the server",
        create: {
            AI: "Computer",
            CLOSED: "Closed",
            OPEN: "Open",
            TAKEN: "Taken",
            add: "Add Slot",
            create: "Create the game",
            enter_name: "Enter your name:",
            heroes: "Heroes",
            invite: "Invite",
            invite_text: "To join this game, share this link:",
            others: "Other Players",
            popup_select_avatar: "Select your avatar",
            slot: "Slot",
        },
        game_over: "Game Over",
        play: {
            back_home_popup_title: "What do you want to do?",
            board_select_square: "Please click on the square to want to change",
            board_select_square_color: "Choose the new color of the square",
            cancel_special_action: "Skip special action",
            complete_turn: "Complete the turn",
            complete_turn_confirm_message: "Are you sure you want to complete your turn?",
            discard: "Discard",
            discard_confirm_message: "Are you sure you want to discard {{cardName}}?",
            discard_no_selected_card: "You must select a card",
            game_over: "You just completed the game! Your rank:",
            no_action: "No action yet",
            pass: "Pass",
            pass_confirm_message: "Are you sure you want to pass your turn?",
            pass_special_action: "Pass action",
            pass_special_action_confirm_message:
                "Are you sure you want to pass the special action?",
            player_box_cards: "Last played cards",
            player_box_trumps: "Trumps active on player",
            select_trump_target: "Who should be the target of {{trumpname}}?",
            whose_turn_message:
                'It is the turn of <br /><strong class="blue-text">{{playerName}}</strong>',
            your_turn: "It's your turn!",
        },
        visit: {
            cards:
                "To do this, you need to use the cards. Click on one and the squares on which you can move will be hightlighted.",
            goal:
                "The goal of the game is to go to the last line as fast as you can and stay there for a turn.",
            intro: "You look like a newcomer. Let me help you.",
            notifications: "The last played actions are visible here.",
            propose: "Do you want to see the tutorial?",
            title: "Tutorial",
            trumps: "You can also use trumps to get bonuses or hinder your oponents.",
        },
    },
    global: {
        alias: "Alias",
        back_home: "Home page",
        cancel: "Cancel",
        cannot_do_action: "You cannot perform this action:",
        create_new_game: "New Game",
        edit: "Edit",
        name: "Name: {{playerName}}",
        no: "No",
        ok: "OK",
        propose_in_game_help_option: "View in game help",
        propose_tutorial_option: "Tutorial",
        save: "Save",
        sound_option: "Sound",
        yes: "Yes",
    },
    powers: {
        domination: "Domination",
        domination_description: "Queen can move from 3 squares instead of 2.",
        force_of_nature: "Force of Nature",
        force_of_nature_description: "Neither Towers nor Forterresses can affect you.",
        inveterate_ride: "Inveterate Ride",
        inveterate_ride_description: "Knight can move on squares of any color",
        night_mist: "Night Mist",
        night_mist_description:
            "Disappear from the board so you cannot be targeted by other players.",
        secret_blade: "Secret Blade",
        secret_blade_description: "transform Bishops into Assassins",
        terraforming: "Terraforming",
        terraforming_description: "Change the color of a square",
    },
    site: {
        connection_button: "Connect",
        connection_game: "Play",
        connection_label: "Connection",
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
        header_community: "Community",
        header_founders: "Founders",
        header_founders_1: "M.A.D.",
        header_founders_2: "Huitus The Great",
        header_founders_3: "YuPi The Usurper",
        header_founders_4: "Apenett Tarondel",
        header_founders_5: "Aurelion",
        header_moves: "Moves",
        header_news: "News",
        header_people: "People",
        header_play: "Play",
        header_ranking: "Ranking",
        header_rules: "Rules",
        header_synopsis: "Synopsis",
        heroes: {
            arline: "Arline",
            arline_description:
                "\nExceptional hunter, Arline is an Elf from a modest family of blacksmiths. She learned how to handle the bow from an early age and built herself a strong reputation as an elite archer even among the high castes of Elvish society. Those who underestimated her are no longer able to regret it.",
            arline_power:
                '\n"Nightmist" (active): When you trigger this skill, you disappear from the board and your opponents can not target you for 1 turn.',
            arline_short_description:
                "Arline has built herself a strong reputation as an elite archer even among the high castes of elvish society. Those who underestimated him are no longer able to regret it.",
            djor: "Djör",
            djor_description:
                "Djör is a legendary builder whose fame far exceeds the borders of Nifelheim, the kingdom of the dwarves. It is said that he made his fortune by erecting the castle of King Rognïr and since then he travels the lands of the Mirror in search of adventures and new challenges",
            djor_power:
                '"Impassable" (passive): Your trumps "Tower" and "Fortress" can not be canceled by the effect of asset "Aries"',
            djor_short_description:
                "Djör est un bâtisseur légendaire dont la renommée dépasse les frontières du royaume des nains. Il parcourt les terres du Miroir à la recherche d’aventures et de nouveaux défis.",
            garez: "Garez",
            garez_description:
                "\nLike most Centaurs, Garez enjoy drinks, grills and women. When he is not busy feasting, he takes on the role of Commander of the Armies of Warlord Rennack. Not particularly enjoying the fight, he eliminates his enemies in record time. Those on the road can expect a fast and unpredictable death.",
            garez_power:
                '\r\n"Intrepid Riding" (passive): Your "Riders" cards can advance on squares of any color.',
            garez_short_description:
                "\nGarez does not particularly like fighting. Those on his road can expect a fast and unpredictable death.",
            kharliass: "Kharliass",
            kharliass_description:
                "(en) Kharliass est un démon de classe majeure connue pour avoir semé la panique dans divers pays du monde des humains et orchestré un certains nombres d’émeutes particulièrement sanglantes durant l’Antiquité. Elle plonge ses proies dans un état de confusion totale en revêtant leur propre apparence juste avant de les tuer.",
            kharliass_power:
                "(en) « Métamorphose» (actif) : Pendant 1 tour vous pouvez prendre l’apparence d’un de vos adversaires. Cette compétence est alors remplacée par la compétence héros du joueur sélectionné et son coût d’utilisation est nul.",
            kharliass_short_description:
                "\nKharliass is a major class demon known to have sown panic in various countries of the human world and orchestrated a number of particularly bloody riots in ancient times. She plunges her prey into a state of total confusion by donning their own appearance just before killing them.",
            luni: "Luni",
            luni_description:
                "(en) Luni est une jeune Ombre aux faits d’armes encore inconnus. Elle maîtrise aussi bien l’art des runes que celui du combat rapproché et son agilité exceptionnelle fait d’elle un adversaire redoutable. Après avoir obtenu son diplôme de la Zefo, elle s’est engagée dans la division des renseignements au service du roi des Ombres.",
            luni_power:
                "(en) « Lame secrète » (actif) :  transforme vos cartes « Fou » en cartes « Assassin »",
            luni_short_description:
                "Luni est une jeune Ombre aux faits d’armes encore inconnus. Sa maîtrise de l’art des runes et son agilité exceptionnelle font d’elle un adversaire redoutable.",
            mirindrel: "Mirïndrel",
            mirindrel_description:
                "(en) Considéré comme l’un des mages les plus puissants de sa génération, Mirïndrel s’est illustré lors des deux dernières grandes guerres contre les démons en déployant des stratagèmes particulièrement ingénieux. Il utilise le terrain qui l’entoure pour piéger ses adversaires ou s’offrir un avantage concurrentiel significatif.",
            mirindrel_power:
                "(en) « Terraformage » (actif) : Lorsque cette compétence est activée, vous avez la possibilité de changer la couleur de n’importe quelle case du plateau de jeu. Le changement de couleur est permanent.",
            mirindrel_short_description:
                "Mirïndrel  est considéré comme l’un des mages les plus puissants de sa génération. Il utilise le terrain pour piéger ses adversaires ou s’offrir un avantage concurrentiel significatif.",
            razbrak: "Razbrak",
            razbrak_description:
                "Razbrak is the younger brother of the chief of the Akta-Ross clan. Expert in handling weapons, he particularly likes the ax he uses to behead his enemies. Under his air of savage and bloodthirsty brute hides a true artist: he collects the skulls of his victims to sculpt them and make beautiful candlesticks.",
            razbrak_power:
                '"Force of Nature" (passive): The assets "Tower" and "Fortress" do not affect you.',
            razbrak_short_description:
                "Razbrak is an expert in weapons handling and is particularly fond of ax. He collects the skulls of his victims to carve them.",
            title: "Heroes",
            ulya: "Ulya",
            ulya_description:
                "\nUlya belongs to the Yrilles, the elite riders under the orders of the Aranean Queen. Accompanied by her Arakoss Veniss, Ulya has distinguished herself with numerous tournament feats and slamming a sand dragon. The tattoos that cover her body illustrate his prowess in combat. So far, the duo has never been defeated.",
            ulya_power:
                '\n"Domination" (passive): When you play a "Queen" card you can move 3 spaces instead of 2.',
            ulya_short_description:
                "Ulya and her Arakoss Veniss belong to the top of the Aranean society. Their feats are legendaries and so far, the duo has never been defeated.",
        },
        homepage: {
            block2: {
                p1: "",
                p2: "",
                p3: "",
                title: "",
            },
            block3: {
                p1: "",
                p2: "",
                p3: "",
                p4: "",
                p5: "",
                title: "A unique gameplay",
            },
            block4: {
                p1: "",
                p2: "",
                p3: "",
                p4: "",
                title: "",
            },
            block5: {
                p1: "",
                p2: "",
                p3: "",
                p4: "",
                p5: "",
                title: "",
            },
            families:
                "Four families control the Arena, use the influence of their members in order to cross the different areas !",
            heroes:
                "Choose your Hero among the 8 people and unleash his power against your opponents !",
            pitch: {
                p1:
                    "<strong>Will you dare enter in the Arena of Titans?</strong><br>                 Create your path with the movements cards,<br>                 Use those of your oponents to move faster,<br>                 Block them with your trumps,<br>                 Arrive fist…<br>                 And survive!",
                p2:
                    "<strong>Will you dare enter in the Arena of Titans?</strong><br>                 Create your path with the movements cards,<br>                 Use those of your oponents to move faster,<br>                 Block them with your trumps,<br>                 Arrive fist…<br>                 And survive!",
                p3:
                    "<strong>Will you dare enter in the Arena of Titans?</strong><br>                 Create your path with the movements cards,<br>                 Use those of your oponents to move faster,<br>                 Block them with your trumps,<br>                 Arrive fist…<br>                 And survive!",
                p4:
                    "<strong>Will you dare enter in the Arena of Titans?</strong><br>                 Create your path with the movements cards,<br>                 Use those of your oponents to move faster,<br>                 Block them with your trumps,<br>                 Arrive fist…<br>                 And survive!",
                p5:
                    "<strong>Will you dare enter in the Arena of Titans?</strong><br>                 Create your path with the movements cards,<br>                 Use those of your oponents to move faster,<br>                 Block them with your trumps,<br>                 Arrive fist…<br>                 And survive!",
                title:
                    "<strong>Will you dare enter in the Arena of Titans?</strong><br>                 Create your path with the movements cards,<br>                 Use those of your oponents to move faster,<br>                 Block them with your trumps,<br>                 Arrive fist…<br>                 And survive!",
            },
            slider1: "",
            slider2: "Challenge up to 7 of your friends",
            slider3: "Beta Version is available !",
            tutorial: "<strong>Tutorial</strong>",
        },
        page_title: {
            create_game: "Create Game",
            founders: "Founders",
            heroes: "Heroes",
            home: "Home",
            not_found: "Not Found",
            play_game: "Play",
            synopsis: "Synopsis",
            trumps: "Trumps",
        },
        people: {
            header_1: "Orcs",
            header_2: "Araneans",
            header_3: "Shadows",
            header_4: "Centaurs",
            header_5: "Demons",
            header_6: "Dwarves",
            header_7: "Elfves",
            header_8: "Dwelves",
            story: {
                p1:
                    "\nOrcs form a proud and independent people and only mix with other peoples on very rare occasions. Measuring two and a half meters and weighing more than one hundred kilos on average, genetics made Orcs born warriors. However, they are distinguished from other peoples by a very particular characteristic: Orcs are unable to use the art of runes and are immune to magic attacks.",
                p2:
                    "In spite of their humanoid appearance, Araneans are among the strangest creatures of the Mirror. The Aranean society is based on a strict hierarchy at the top of which is the queen and the Yrilles also known as Tarantulas Riders. Only certain Aranean women are able to ride the Arakoss females, these formidable arachnids which can reach the size of a small elephant.",
                p3:
                    "\nShadows are the reincarnation of human beings in the Mirror. After death, each human is reincarnated into an 8-year-old child on the other side, and forgets everything about his previous life. Educated at the SETA (Shadows Education and Training Area), Shadows learn the basics of melee combat, as well as runes, from an early age, to finally specialize in what suits them best. They are polyvalent warriors who can control magic as well as excel in close combat.",
                p4:
                    "\nCentaurs live in tribes and are a nomadic rather than sedentary people. They move at each new season and the movements of the hordes are spread over several leagues. Of a peaceful nature, centaurs prefer to party than to fight and rarely take positions in conflicts that do not directly impact them.",
                p5:
                    "\r\nDemons are beings that can change their appearance according to their will. Each demon has a first form that corresponds to the physical form for which it consumes no energy. Demons also have the opportunity to remain in spirit form; they can not then directly influence the matter. Each demon has a seal on his chest indicating his lack of heart. The seal has imprisonment runes whose level reflects the power of the demon. Like Shadows, Demons have the power to travel to the world of humans.",
                p6:
                    "\nThe dwarven people is one of the oldest peoples of the Mirror. Residents of the icy lands of Nifelheim, Dwarves have become experts in engineering and are often asked by other peoples for their expertise in runic machine design. Dwarven cities are built on the mountainsides or inside mountains. Their architecture, combined with the harsh climate, make them particularly difficult fortresses to storm.",
                p7:
                    "\nThe southern Mirror is home to the Elves, creatures as fascinating as they are difficult to define. Some Elves are perfectly capable of integrating with other peoples, but a large majority prefer to stay in the vast forests that hide their cities from the views and knowledge of all. Elves have greater physical strength than Shadows and unrivaled mastery of runes in the Mirror.",
                p8:
                    "\nDwelves are a people cousin of Elves and Dwarves. Small in size, Dwelves have an extraordinary agility that often allows them to speed up their opponent. Dwelven mages are known for their invocations of runic spirits that prove to be ultra-powerful weapons on a battlefield. Dwelves love to travel and it is common to find them living temporarily in the middle of another people. The majority of Mirror cards are the result of their epic traveling.",
            },
        },
        rules: {
            heroes:
                '<h2>Heroes</h2>\n                <p>As it is never enough, each hero has got a special skill (being ugly, strength is all that\'s left). This skill can be "passive" (working all the time as a bonus generally), or "active" (need to activate it make it work) once your exploration gauge is full.</p>',
            moves:
                '<h2>Moves</h2>\n                <p>As explained before (yeah you should read in the order we wrote), the Arena is divided in several areas. Each color refers to a family, so areas are under the control of families depending on their color. To cross it, you will need the approval of a family member. And to get this approval, you need luck!\nOkay I think I lost you there, let me wrap it up: you start with a random hand of cards, so, to advance, you click on a card and then on the tile you want to move to. You can use up to 2 movement cards by turn. So you need to figure how to optimize your moves on your own to get the upper hand!\n                </p>\n                <img src="/latest/assets/rules/aot-move.png"\n                     alt="The moves of the game" />',
            rules:
                '<h1>General</h1>\n            <div class="half-column-left">\n                <p>Welcome to the Arena! The goal is simple (better not to make difficult rules for those dumb heroes...): you just need to reach the opposite side from your starting point. Easy peasy right?  To reach the final point, you need to make your own path through areas controlled by the 4 great families (each of them represents a Titan), and avoid enemies\' traps and other low blows to arrive at the end before them. Yeah fair enough, it finally may not be as easy as I said. But you know what? I don\'t care haha!</p>\n            </div>\n            <img class="half-column-right border-black"\n                 src="/latest/assets/homepage/board.png"\n                 alt="The board of the game" />',
            trumps:
                '<h2>Trumps</h2>\n                <p>We know that Titans have a very special sense of humor. They decided to bestow abilities to heroes to make more thrilling battles! Those skills can boost their movements, or obstruct enemies\'. So you can either choose to focus on 1 particular enemy and make a hell of his Arena life, or to choose to be fair and hamper everyone equally. Another option would be to make alliance with other players, to obstruct one particular enemy ahead of everyone, to finally stab them in their back to make your way through victory... The cunning foxes know what to do eheh...\n\nTo use skills, tu will need to gather exploration points. Each area explored will grant you 1 exploration point. The more your exploration gauge will be filled, the more devastating skills you will be able to use!</p>\n                <img src="/latest/assets/rules/trumps.png"\n                     alt="The trumps" />',
        },
        slide: {
            centaur: "CAN WE QUICKLY FINISH THIS ? THE BANQUET IS WAITING FOR ME !",
            elf: "TRY TO STOP WHAT IS INVISIBLE",
            orc: "EASIER TO BE NUMBER ONE WHEN THERE IS NO COMPETITORS LEFT HEHE...",
        },
        synopsis: {
            story: {
                p1:
                    '<h1>Synopsis</h1>\n                <p class="big-column-center">Au commencement de tout, lorsque le monde n’était que néant, quatre êtres émergèrent de la matrice originelle que les arlinees nomment Aöctra : l’essence de toutes les essences. Ces créatures furent appelées les Titans. Deux femmes et deux hommes qui avaient pour noms Thézalia, Noya, Daïlum, et Kranth.</p>',
                p2:
                    "Les Titans créèrent les continents et les mers, les montagnes et les forêts. Ils donnèrent ensuite la vie aux sept peuples que sont les Ombres, les Elfes, les Orcs, les Nains, les Arannéens, les Centaures et les Elvains. Ils furent rejoins plus tard par les Démons qui constituèrent le huitième peuple.",
                p3:
                    "Les peuples commencèrent à se battre pour obtenir le pouvoir de gouverner les différents territoires, et avant de disparaître, les Titans créèrent une immense arène afin de les départager. Chaque Titan créa une famille à son effigie et lui assigna le contrôle de plusieurs zones de l’Arène.",
                p4:
                    "Depuis ce jour, chaque peuple envoie ses meilleurs combattants relever le défi de l’Arène des Titans : en utilisant l’influence des quatre familles et les pouvoirs octroyés par les Titans, les participants doivent réussir à traverser l’Arène…avant les autres concurrents !",
                p5: "Le pouvoir ultime se mérite",
            },
        },
    },
    trumps: {
        assassination: "Assassination",
        assassination_description: "Make an other player move back",
        blizzard: "Blizzard",
        blizzard_description: "Reduce the number of cards a player can play by 1.",
        fortress_black: "Black Fortress",
        fortress_black_description: "Prevent the player to move on black squares for two turns.",
        fortress_blue: "Blue Fortress",
        fortress_blue_description: "Prevent the player to move on blue squares for two turns.",
        fortress_red: "Red Fortress",
        fortress_red_description: "Prevent the player to move on red squares for two turns.",
        fortress_yellow: "Yellow Fortress",
        fortress_yellow_description: "Prevent the player to move on yellow squares for two turns.",
        max_number_played_trumps: "You cannot play more trumps during this turn",
        max_number_trumps: "This player cannot be the target of anymore trump during this turn",
        ram: "Ram",
        ram_description: "Destroy towers and reduce duration for fortress",
        reinforcements: "Reinforcements",
        reinforcements_description: "Allow the player to play one more move.",
        tower_black: "Black Tower",
        tower_black_description: "Prevent the player to move on black squares.",
        tower_blue: "Blue Tower",
        tower_blue_description: "Prevent the player to move on blue squares.",
        tower_red: "Red Tower",
        tower_red_description: "Prevent the player to move on red squares.",
        tower_yellow: "Yellow Tower",
        tower_yellow_description: "Prevent the player to move on yellow squares.",
    },
};
