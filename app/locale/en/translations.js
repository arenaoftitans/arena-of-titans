export default {
    actions: {
        discarded_card: "{{playerName}} just discarded a card",
        nothing_happened: "Nothing happened",
        passed_turn: "{{playerName}} just passed his/her turn",
        played_card: "{{playerName}} just played a card",
        played_special_action: "{{playerName}} just played a special action on {{targetName}}",
        played_trump: "{{playerName}} just played a trump on {{targetName}}",
        played_trump_no_effect: "The trump played had no effect !",
        problem: "A problem occurred",
        special_action_assassination:
            "Click on the pawn of a player. You will then be able to move it back.",
        special_action_info_popup: "You just played a card with a special action {{action}}",
        trump_played_by: "Played by {{initiator}}",
    },
    cards: {
        assassin:
            "Move two squares in line or diagonal. You can make a player move back on box of the color of the Assassin.",
        assassin_black: "Mountain Assassin",
        assassin_blue: "Water Assassin",
        assassin_complementary_description:
            "Special action: Assassination to make a player move back.",
        assassin_red: "Forest Assassin",
        assassin_yellow: "Desert Assassin",
        bishop: "Move two squares in diagonal. Can move on two different colors.",
        bishop_black: "Mountain Bishop",
        bishop_blue: "Water Bishop",
        bishop_red: "Forest Bishop",
        bishop_yellow: "Desert Bishop",
        king: "Move three squares in line.",
        king_black: "Mountain King",
        king_blue: "Water King",
        king_red: "Forest King",
        king_yellow: "Desert King",
        knight: "Move one square in L.",
        knight_black: "Mountain Knight",
        knight_blue: "Water Knight",
        knight_red: "Forest Knight",
        knight_yellow: "Desert Knight",
        queen: "Move two squares in line or diagonal.",
        queen_black: "Mountain Queen",
        queen_blue: "Water Queen",
        queen_red: "Forest Queen",
        queen_yellow: "Desert Queen",
        warrior: "Move one square in line.",
        warrior_black: "Mountain Warrior",
        warrior_blue: "Water Warrior",
        warrior_red: "Forest Warrior",
        warrior_yellow: "Desert Warrior",
        wizard: "Move one squares in line or diagonal. Can move on a square of any color.",
        wizard_black: "Mountain Wizard",
        wizard_blue: "Water Wizard",
        wizard_red: "Forest Wizard",
        wizard_yellow: "Desert Wizard",
    },
    errors: {
        player_already_connected: "You are already connected with this browser.",
    },
    game: {
        black: "Mountain",
        blue: "Water",
        connection_lost: "Lost connection with the server",
        create: {
            AI: "Computer",
            CLOSED: "Closed",
            OPEN: "Open",
            TAKEN: "Taken",
            create: "Create the game",
            heroes: "Heroes",
            invite: "Invite",
            invite_text: "To join this game, share this link:",
            players: "Players",
            slot: "Slot",
        },
        force_landscape: "Please rotate your phone in landscape for the game to work",
        options: "Options",
        play: {
            back_home_popup_title: "What do you want to do?",
            board_select_square: "Please click on the square to want to change",
            board_select_square_color: "Choose the new color of the square",
            complete_turn: "Complete the turn",
            complete_turn_confirm_message: "Are you sure you want to complete your turn?",
            discard: "Discard",
            discard_confirm_message: "Are you sure you want to discard {{cardName}}?",
            discard_no_selected_card: "You must select a card",
            game_over: "You just completed the game! Your rank:",
            game_over_pop_up_rank: "Rank :",
            game_over_pop_up_title: "Game Over !",
            no_action: "No action yet",
            no_active_trump_on_player: "No active trumps on player.",
            no_possible_target_for_trump:
                "You cannot play this trump. No player can be targeted at this time.",
            pass: "Pass",
            pass_confirm_message: "Are you sure you want to pass your turn?",
            pass_special_action: "Pass action",
            pass_special_action_confirm_message:
                "Are you sure you want to pass the special action?",
            player_box_cards: "Last played cards",
            player_box_trumps: "Trumps active on player",
            player_played_no_card: "Player played no card.",
            select_trump_target: "Who should be the target of {{trumpname}}?",
            whose_turn_message:
                'It is the turn of <br /><strong class="blue-text">{{playerName}}</strong>',
            your_turn: "It's your turn!",
        },
        red: "Forest",
        yellow: "Desert",
    },
    global: {
        alias: "Alias",
        back_home: "Home page",
        cancel: "Cancel",
        cannot_do_action: "You cannot perform this action:",
        create_new_game: "New Game",
        no: "No",
        ok: "OK",
        propose_in_game_help_option: "View in game help",
        sound_option: "Sound",
        source_code: "Source code",
        yes: "Yes",
    },
    powers: {
        domination: "Domination",
        domination_description: '\nYour "Queen" cards can move on 3 spaces instead of 2.',
        force_of_nature: "Force of Nature",
        force_of_nature_description: "Neither Towers nor Forterresses can affect you.",
        impassable: "Impassable",
        impassable_description:
            'Your trumps "Tower" and "Fortress" can not be canceled by the effect of the trump "Ram"',
        inveterate_ride: "Inveterate Ride",
        inveterate_ride_description: '\nYour "Riders" cards can move on squares of any color.',
        metamorphosis: "Metamorphosis",
        metamorphosis_description:
            "\nDuring 1 turn you can copy the hero skill of any player of your choice and its cost of use is zero.",
        night_mist: "Night Mist",
        night_mist_description:
            "Disappear from the board so you cannot be targeted by other players.",
        secret_blade: "Secret Blade",
        secret_blade_description: "Warriors can make a player move back on a box of their color",
        terraforming: "Terraforming",
        terraforming_description: "Change the color of a square of your choice",
    },
    site: {
        founders: {
            story: {
                p1:
                    "A white paper mask, a suit and a black hat. We do not know much more about this strange character who would have discovered the island of the Titans first. Many rumors run on M.A.D., some claim to have seen him in the World of Humans and others in the Mirror. It is thought that it is a Shadow having the power to cross the Worlds but it could also belong to no known peoples ...",
                p2:
                    "Disciple of the great dwarf architect Djör, he is the contender found by M.A.D. for the run. Although he has a questionable sense of beauty, the buildings he builds go through the years, unlike those of Djör which only last one turn. At least, we suppose: we don't know whether he truly built something alone, without the directions of his master. Some say that his made made him an exile from the kingdom of the dwarves because one of his miscalculations had almost shattered the castle of King Rognir. Others say that he was shadowing his master. One thing is certain: he raises Pythons who, according to rumors, are able to eat elephants.",
                p3:
                    "From the depths of the abyss, this lazy demon has been able to rise in the hierarchy to reach the position of founding architect. How did he do it? His methods to get there are, to date, quite obscure, but some say he has greased the leg of a Titan, while others think it happened at a time when the Titans had not the luxury of being able to do the difficult ... In any case, one thing is certain, his rank of demon very inferior, coupled with the rumors about his social escalation, earned him the nickname of the Impostor.",
                p4:
                    "Of uncertain origin, but of human appearance, Apenett has long traveled the world to increase its magical powers. The Sorcerer now lives reclusively in his tower. Paranoid, he surrounded his benchmark with traps. However, with her old age, her memory is not what it was and it happens - during its very rare excursions - to trigger its own malicious mechanisms. He becomes very grumpy when it happens to him and always blames his gardener.",
                p5:
                    "In seeking the perfection of his soul, Paladin Aurelion wanted to exteriorize his desires with the help of a powerful ritual. Unfortunately the incantation turned out badly and instead of enclosing his impulses he gave them an own conscience. Since then, these strange spirits whisper in the ear of the warrior sometimes pushing him to the edge of madness. It is undoubtedly this particularity which interested M.A.D. and led him to fetch Aurelion from the cliffs where he had entrenched himself. Only art and the search for beauty can still calm the spirit of the paladin and it is thus that he was offered the role of Grand Decorator of the arena.",
            },
        },
        header_contributors: "Contributors",
        header_founders: "Founders",
        header_founders_1: "M.A.D.",
        header_founders_2: "Huitus The Great",
        header_founders_3: "YuPi The Usurper",
        header_founders_4: "Apenett Tarondel",
        header_founders_5: "Aurelion",
        header_people: "People",
        header_play: "Play",
        header_rules: "Rules",
        header_synopsis: "Synopsis",
        heroes: {
            arline: "Arline",
            arline_description:
                "\nExceptional hunter, Arline is an Elf from a modest family of blacksmiths. She learned how to handle the bow from an early age and built herself a strong reputation as an elite archer even among the high castes of Elvish society. Those who underestimated her are no longer able to regret it.",
            arline_power:
                '\n"Night Mist" (active): When you trigger this skill, you disappear from the board and your opponents can not target you for 1 turn.',
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
                "\nKharliass is a major class demon known to have caused panic in various countries of the human world and orchestrated a number of particularly bloody riots in ancient times. She plunges her prey into a state of total confusion by taking their own appearance just before killing them.",
            kharliass_power:
                '\n"Metamorphosis" (active): During 1 turn you can take the appearance of one of your opponents. This skill is then replaced by the hero skill of the selected player and its cost of use is zero.',
            kharliass_short_description:
                "\nKharliass is a major class demon who plunges his prey into a state of total confusion by taking their own appearance just before killing them.",
            luni: "Luni",
            luni_description:
                "\nLuni is a young Shadow with unknown war exploits until this day. She masters the art of runes as well as close combat and her exceptional agility makes her a formidable warrior. After graduating from Zefo, she joined the Intelligence Division at the service of the King of Shadows.",
            luni_power:
                '"Secret Blade" (active): Warriors can make a player move back on a box of their color',
            luni_short_description:
                "Luni is a young Shadow with unknown war exploits until this day. Her mastery of runes and exceptional agility make her a formidable warrior.",
            mirindrel: "Mirïndrel",
            mirindrel_description:
                "Regarded as one of the most powerful mages of his generation, Mirindrel has been illustrated in the last two great wars against demons by deploying particularly ingenious stratagems. He uses the terrain around him to trap his opponents or to gain a significant competitive advantage.",
            mirindrel_power:
                '\n"Terraforming" (active): When this skill is activated, you have the option to change the color of any square on the game board. The color change is permanent.',
            mirindrel_short_description:
                "Mirindrel is considered one of the most powerful mages of his generation. He uses the field to trap his opponents or to offer himself a significant competitive advantage.",
            pitch: {
                p1:
                    "Eight peoples send their champion to represent them and try to get the favor of the Titans.",
                p2: "Each Hero has a unique skill.",
                p3: "Use this power at the right time to take advantage!",
                title: "Heroes",
            },
            razbrak: "Razbrak",
            razbrak_description:
                "Razbrak is the younger brother of the chief of the Akta-Ross clan. Expert in handling weapons, he particularly likes the ax he uses to behead his enemies. Under his air of savage and bloodthirsty brute hides a true artist: he collects the skulls of his victims to sculpt them and make beautiful candlesticks.",
            razbrak_power:
                '"Force of Nature" (passive): The assets "Tower" and "Fortress" do not affect you.',
            razbrak_short_description:
                "Razbrak is an expert in weapons handling and is particularly fond of ax. He collects the skulls of his victims to carve them.",
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
                p1: "In the Island of Titans, all shots are allowed!",
                p2: "Team-up with other players against the most advanced Hero,",
                p3: "And betray them later!",
                title: "Challenge your future Ex-Friends",
            },
            block3: {
                p1: "Just reach the temples of the Titans to win!",
                p2: "Easy, isn't it ?",
                p3: "It was without taking into accont Trumps cards ...",
                p4: "The Titans give each Hero 4 Trumps",
                p5: "Enough to do nasty things to your opponents !",
                title: "A unique gameplay",
            },
            block4: {
                p1: "Each Hero has a Specific Power",
                p2: "It's up to you to use it well !",
                p3: "Remember : with a Great Power comes...",
                p4: "Great Retaliation on the Last Line !",
                title: "Unleash your Power",
            },
            block5: {
                p1: "Moving through the fields is a start",
                p2: "But optimizing your moves is the real deal",
                p3: "Be careful...",
                p4: "The more you get ahead,",
                p5: "the more likely you are to become the target of other Heroes !",
                title: "Adapt your Strategy",
            },
            pitch: {
                p1: "Participate in the ultimate race to get the favor of the Titans!",
                p2: "Create your path through the different fields,",
                p3: "Block your opponents with your trumps,",
                p4: "Arrive fist…",
                p5: "And survive!",
                title: "The fusion between racing and strategy game !",
            },
        },
        moves: {
            assassin_black: "Mountain Assassin",
            assassin_black_moves:
                "Move two Mountain squares in line or diagonal. Special action: Assassination to make a player move back on a Mountain square.",
            assassin_blue: "Water Assassin",
            assassin_blue_moves:
                "Move two Water squares in line or diagonal. Special action: Assassination to make a player move back on a Water square.",
            assassin_red: "Forest Assassin",
            assassin_red_moves:
                "Move two Forest squares in line or diagonal. Special action: Assassination to make a player move back on a Forest square.",
            assassin_yellow: "Desert Assassin",
            assassin_yellow_moves:
                "Move two Desert squares in line or diagonal. Special action: Assassination to make a player move back on a Desert square.",
            bishop_black: "Mountain Bishop",
            bishop_black_moves:
                "Move two Mountain squares in diagonal. Can move on two different colors.",
            bishop_blue: "Water Bishop",
            bishop_blue_moves:
                "Move two Water squares in diagonal. Can move on two different colors.",
            bishop_red: "Forest Bishop",
            bishop_red_moves:
                "Move two Forest squares in diagonal. Can move on two different colors.",
            bishop_yellow: "Desert Bishop",
            bishop_yellow_moves:
                "Move two Desert squares in diagonal. Can move on two different colors.",
            desert: "Desert",
            forest: "Forest",
            king_black: "Mountain King",
            king_black_moves: "Move three Mountain squares in line.",
            king_blue: "Water King",
            king_blue_moves: "Move three Water squares in line.",
            king_red: "Forest King",
            king_red_moves: "Move three Forest squares in line.",
            king_yellow: "Desert King",
            king_yellow_moves: "Move three Desert squares in line.",
            knight_black: "Mountain Knight",
            knight_black_moves: "Move one Mountain square in L.",
            knight_blue: "Water Knight",
            knight_blue_moves: "Move one Water square in L.",
            knight_red: "Forest Knight",
            knight_red_moves: "Move one Forest square in L.",
            knight_yellow: "Desert Knight",
            knight_yellow_moves: "Move one Desert square in L.",
            mountain: "Mountain",
            pitch: {
                p1:
                    "The Island of Titans is divided between 4 types of fields: Forest, Water, Mountain and Desert.",
                p2:
                    "Movement cards allow you to summon a Spirit who will guide you through these territories.",
                p3: "But be careful, each Spirit moves in a very particular way ...",
                p4: "It's up to you to optimize your cards to advance as fast as possible!",
                title: "Moves",
            },
            queen_black: "Mountain Queen",
            queen_black_moves: "Move two Mountain squares in line or diagonal.",
            queen_blue: "Water Queen",
            queen_blue_moves: "Move two Water squares in line or diagonal.",
            queen_red: "Forest Queen",
            queen_red_moves: "Move two squares in line or diagonal.",
            queen_yellow: "Desert Queen",
            queen_yellow_moves: "Move two Desert squares in line or diagonal.",
            warrior_black: "Mountain Warrior",
            warrior_black_moves: "Move one Mountain square in line.",
            warrior_blue: "Water Warrior",
            warrior_blue_moves: "Move one Water square in line.",
            warrior_red: "Forest Warrior",
            warrior_red_moves: "Move one Forest square in line.",
            warrior_yellow: "Desert Warrior",
            warrior_yellow_moves: "Move one Desert square in line.",
            water: "Water",
            wizard_black: "Mountain Wizard",
            wizard_black_moves:
                "Move one Mountain square in line or diagonal. Can move on a square of any color.",
            wizard_blue: "Water Wizard",
            wizard_blue_moves:
                "Move one Water square in line or diagonal. Can move on a square of any color.",
            wizard_red: "Forest Wizard",
            wizard_red_moves:
                "Move one Forest square in line or diagonal. Can move on a square of any color.",
            wizard_yellow: "Desert Wizard",
            wizard_yellow_moves:
                "Move one Desert square in line or diagonal. Can move on a square of any color.",
        },
        page_title: {
            create_game: "Create Game",
            founders: "Founders",
            heroes: "Heroes",
            home: "Home",
            moves: "Moves",
            not_found: "Not Found",
            people: "People",
            play_game: "Play",
            privacy: "Privacy",
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
        privacy_common:
            "We only use cookies to track visitors. We support Do Not Track, we only log the 2 first bytes of your IP address and the tracking cookie has a lifetime of 13 months to respect your privacy. In a nutshell, our Matomo instance follows the recommendations of CNIL (French privacy regulator) so we don't have to ask your consent about cookies. We didn't forget, we are just tracking too little!",
        privacy_warning:
            "If nothing displays below this message, it means your browser is blocking cookies and we cannot display the opt-out form. It also means you are not tracked.",
        slide: {
            centaur: "CAN WE QUICKLY FINISH THIS ? THE BANQUET IS WAITING FOR ME !",
            elf: "TRY TO STOP WHAT IS INVISIBLE",
            orc: "EASIER TO BE NUMBER ONE WHEN THERE IS NO COMPETITORS LEFT...",
        },
        synopsis: {
            story: {
                p1:
                    "At the beginning of everything, when the world was nothingness, four beings emerged from the original matrix that the Elves call Aöctra: the essence of all essences. These creatures were called the Titans. Two women and two men whose names were Thezalia, Noya, Daimum, and Kranth.",
                p2:
                    "The Titans created forests and seas, mountains and deserts. They gave birth to the seven peoples of the Shadows, Elves, Orcs, Dwarves, Aranneans, Centaurs and Dwelves. They were later joined by the Demons who made up the eighth people.",
                p3:
                    "The peoples began to fight for the power to govern the different territories. The Titans then lost interest in the peoples and their wars and created a huge island far from the mainland. They each erected a temple and locked themselves in before making the island disappear into the sea.",
                p4:
                    "However, the island of Titans resurfaced every century for a few minutes. During this short time, the temples of the Titans are accessible again and each people sends their best Heroes to try to reach them!",
                p5:
                    "By using the spirits that inhabit the territories of the island and the powers granted by the Titans, participants must cross the island before their competitors and before it disappears again! This fierce competition of strategy, luck and trickery is known as Last Run.",
            },
        },
    },
    trumps: {
        assassination: "Assassination",
        assassination_description: "Make an other player move back",
        blizzard: "Blizzard",
        blizzard_description: "Reduce the number of cards a player can play by 1.",
        fortress_black: "Mountain Fortress",
        fortress_black_description: "Prevent the player to move on Mountain squares for two turns.",
        fortress_blue: "Water Fortress",
        fortress_blue_description: "Prevent the player to move on Water squares for two turns.",
        fortress_red: "Forest Fortress",
        fortress_red_description: "Prevent the player to move on Forest squares for two turns.",
        fortress_yellow: "Desert Fortress",
        fortress_yellow_description: "Prevent the player to move on Desert squares for two turns.",
        max_number_played_trumps: "You cannot play more trumps during this turn",
        max_number_trumps: "This player cannot be the target of anymore trump during this turn",
        metamorphosis: "Metamorphosis",
        metamorphosis_description:
            "\nDuring 1 turn you can copy the hero skill of any player of your choice and its cost of use is zero.",
        ram: "Ram",
        ram_description: "Destroy towers and reduce duration for fortress",
        reinforcements: "Reinforcements",
        reinforcements_description: "Allow the player to play one more move.",
        tower_black: "Mountain Tower",
        tower_black_description: "Prevent the player to move on Mountain squares.",
        tower_blue: "Water Tower",
        tower_blue_description: "Prevent the player to move on Water squares.",
        tower_red: "Forest Tower",
        tower_red_description: "Prevent the player to move on Forest squares.",
        tower_yellow: "Desert Tower",
        tower_yellow_description: "Prevent the player to move on Desert squares.",
    },
};
