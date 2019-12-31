Arena of Titans
===============

.. contents::


Setup
=====

- NodeJS (latest version, https://nodejs.org/en/)
- Firefox, Chrome or PhantomJS to launch unit tests

You can now install the node dependencies. To do so, launch in the folder in which you cloned this repository:

- Install node modules with yarn (recommended) ``yarn`` or ``npm install``

Configuration
-------------

We rely on environment files managed by Aurelia for the configuration of the application. They can be found in ``./aurelia_project/environments``. They are named like ``ENV.json`` where ``ENV`` corresponds the environment (dev, staging, prod) they relate to. The file used by the application is written in ``./app/environment.js`` during the transpile step.

You can override the host and port of the api to use for any environment as well as provide a `Rollbar <https://rollbar.com>`__ access token by creating a ``.env`` file at the root of the project. Put in it only the lines you need. A full ``.env`` file will look like:

.. code::

    API_HOST=newhost
    API_PORT=8080
    ROLLBAR_ACCESS_TOKEN=token

The list of assets to preload is also generated during the transpile step. It is only done once.

Use the API from staging when developing the frontend
+++++++++++++++++++++++++++++++++++++++++++++++++++++

This allows you to develop the frontend without running an API locally (which is the default for the ``dev`` environment). This is specially useful if you develop only on the frontend (eg you are a designer) and don't want to bother with the API.

To build the frontend for development and use the API from the staging server, create a ``.env`` file at the root of the project with this content:

.. code::

    API_HOST=devapi.arenaoftitans.com
    API_PORT=80


Usage
=====

- To launch the development server, use ``npm run dev``. This will compile the app for development in memory, launch a webserver, watch for any changes and reload your page once the changes are taken into account.
- To launch tests on time, use ``npm run test`` You can choose the browsers on which the tests will be executed with the ``-b BROWSER`` option. For instance: ``npm run test -- -b Chrome`` or ``npm run test -- -b Chrome -b Firefox``. Default browsers are Firefox and Chrome. You can view the list of available browsers in `karma's documentation <http://karma-runner.github.io/1.0/config/browsers.html>`__.
- To launch tests automatically when a modification is done, use ``npm run tdd`` You can choose the browsers on which the tests will be executed. See above.
- To build the files for an environment, use ``npm run build -- --env ENV``. You can also specify the version to use with ``--version VERSION``. For instance to build for production: ``npm run build -- --version latest --env prod``
- To clean the build folder, use ``npm run clean``
- To lint the JS, SCSS and template files, use ``npm run lint``.
- To update the translations, use ``npm run translate``.
- To update the default names, use ``npm run default-names``.
- To update the sprites of the cards, use ``npm run sprites``. **Check that in the url( statements no quotes are used!**


Contributing
============

Be sure that (this can be configured in your text editor or your IDE):

- Your files are encoded in UTF-8
- You use Unix style line ending (also called LF)
- You remove the trailing whitespaces
- You pull your code using ``git pull --rebase=preserve``

Code style
----------

- Wrap your code in 100 characters to ease reading.
- Use spaces, not tabs.
- Use 4 spaces to indent and 8 for continuation indentation. It is intended to avoid lines starting far at in the right.

Code organization
-----------------

The code is written with the `Aurelia JavaScript framework <http://aurelia.io/>`__. We can distinguish three main categories:

- Pages: a web page used in the routers.
- Services: they are instanced once and injected as needed in the others elements (services or widgets) of the application. They provide state and useful methods. They are similar to services in AngularJS.
- Widgets: It is an element (component or Custom Element in Aurelia's terminology) instantiated in the DOM of the application. A widget can be instantiated multiple times and each instance is independent of the others. It consists of a JS file, an HTML template and, if needed, a SCSS file for its style. All these files are grouped in a folder named after the widget. They are similar to directives in AngularJS.

The code is then organized as follow:

- The ``app`` folder contains the code of the application (JS and HTML). It is structured as follow:

  - Directly in the folder the bootstrap files for the application.
  - The ``game`` folder for everything related to the game. This folder is then split in:

    - ``game.js`` and ``game.html`` the main page for the game. It contains a router to navigate between create and play.
    - ``create`` for widgets and services used to create the game.
    - ``play`` for widgets and services used to play the game.
    - ``services`` for services common to create and play.
    - ``widgets`` for widgets common to create and play.

  - The ``site`` folder for the page of the site and its widgets.
  - The ``style`` folder for global SCSS files.
  - The ``widgets`` folder for global widgets.

- The ``assets`` folder contains all the images, fonts, media files (if small!) of the application.
- The ``aurelia_project`` folder contains:

  - ``aurelia.json`` the configuration file of `aurelia-cli <https://github.com/aurelia/cli>`__.
  - The tasks and libraries used by aurelia-cli to work.

- The ``dist`` folder (un-tracked) will contain the built bundles that are used in the browser.
- The ``locale`` folder contains a subdirectory per lang. Each subdirectory contains a JS file exporting an object containing the translations for this language. These JS files are updated with ``npm run translate``.
- The ``scripts`` folder contains: JS scripts that don't belong to the app but are required for it to work (eg: tracking.js, polyfills.js).
- The ``templates`` folder contains templates (eg: index.html, rollbar.js).
- Unit tests go into the ``test/unit`` folder. The structure of the ``test/unit`` folder should reflect the structure of the app.

Code conventions
----------------

- Tests files should have the same name than the file they are testing and end with the ``.spec.js`` extension.
- Private methods and attributes starts with an underscore ``_``. In a service this means that the method or the attribute shouldn't be accessed outside of it. In the JS part of a Custom Element, it means the method or attribute shouldn't be used in the HTML template.

Commit
------

We try to follow the same `rules as the angular project <https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit>`__ towards commits. Each commit is constituted from a summary line, a body and eventually a footer. Each part are separated with a blank line.

The summary line is as follow: ``<type>(<scope>): <short description>``. It must not end with a dot and must be written in present imperative. Don't capitalize the fist letter. The whole line shouldn't be longer than 80 characters and if possible be between 70 and 75 characters. This is intended to have better logs.

The possible types are :

- chore for changes in the build process or auxiliary tools.
- doc for documentation
- feat for new features
- ref: for refactoring
- style for modifications that not change the meaning of the code.
- test: for tests

The body should be written in imperative. It can contain multiple paragraph. Feel free to use bullet points.

Use the footer to reference issue, pull requests or other commits.

This is a full example:

::

   feat(css): use CSS sprites to speed page loading

   - Generate sprites with the gulp-sprite-generator plugin.
   - Add a build-sprites task in gulpfile

   Close #24

git hooks
---------

git hooks allow you to launch a script before or after a git command. They are very handy to automatically perform checks. If the script exits with a non 0 status, the git command will be aborted. You must write them in the `.git/hooks/` folder in a file following the convention: ``<pre|post>-<git-action>``. You must not forget to make them executable, eg: ``chmod +x .git/hooks/pre-commit``.

In the case you don't want to launch the hooks, append the ``--no-verify`` option to the git command you want to use.

This project uses `pre-commit <https://pre-commit.com/>`__ to handle git hooks automatically. To install the hooks, run ``pre-commit install`` and ``pre-commit install --hook-type pre-push``.

Translations
============

The translations are generated from `this google doc <https://docs.google.com/spreadsheets/d/1YWBqm7OUVshYZhVrKiCnbuYBUcPlLtB0dR7rqpWbevU/edit#gid=1072267331>`__. Each sheet correspond to a part of the application: site (for all the pages of the site), game (for gobal game traductions), game/create, game/play, global (for global translations), cards (for the translations of names and descriptions of the cards), trumps (for the translations of the names and descriptions of the trumps). To update the JSON in the frontend, use either: ``npm run translate``

The translations are performed in the browser by the `aurelia-i18n <https://github.com/aurelia/i18n>`__ plugin.

To translate something:

#. Add the relevant key in the spreadsheet.
#. Update the JSON files containing the translations.
#. In the HTML, use if possible (ie text/html that don't rely on aurelia binding):

   - the ``t`` tag with the key as value. For instance: ``<span t="site.connection_button"></span>``. If the translated text contains HMTL, add ``[html]`` before the key: ``<span t="[html]site.homepage.pitch"></span>``. If you need some value provided by aurelia in the code, delimit it with __ and use the ``t-params.bind`` to supply the value. Eg, use the value ``C'est le tour de <br><strong>__playerName__</strong>`` and this code to supply ``playerName``:

     .. code:: html

        <p class="centered-important"
           t="[html]game.play.whose_turn_message"
           t-params.bind="{playerName: currentPlayerName}">
        </p>

   - the TValueConverter (if you cannot use the option above): ``${ 'TAKEN' | t}``.

#. If you need to translate trough the code:

   #. Inject the I18N service.
   #. Translate with ``this._i18n.tr('cards.queen_red')`` or ``this._i18n.tr('cards.queen_red', {toto: 'toto'})`` if the value requires some string to be replaced.

See `the plugin page on github <https://github.com/aurelia/i18n>`__ for the full documentation.

Translate routes titles
-----------------------

Put the id of the translation (eg ``site.page_title.home``) in the title property of the route definition.

Translate text in a popup
-------------------------

In order for the translations to be correctly applied to the popup, the ``data`` object passed to the ``popup.display`` function must contain a translate key. This key must be associated with an object like:

.. code:: javascript

    {
        // The messages used in the popup template (like ``title``) associated with their translation key.
        messages: {
            POPUP_KEY: TRANSLATION_KEY,
        },
        // Dynamic parameters to use in the translation of messages strings.
        // They will be translated before the messages. This is required to
        // translate the parameters before they are injected in the message
        // string.
        paramsToTranslate: {
            PARAM_NAME: TRANSLATION_KEY,
        },
        // Optionnal params for the translations that don't need translations.
        params: {
            PARAM_NAME: VALE,
        }
    }

Complete ``data`` example:

.. code:: javascript

    let popupData = {
        selectedChoice: otherPlayerNames[selectedIndex],
        choices: otherPlayerNames,
        translate: {
            messages: {
                title: `trumps.${this.normalizeTrumpName()}`,
                description: `trumps.${this.normalizeTrumpName()}_description`,
                message: 'game.play.select_trump_target',
            },
            paramsToTranslate: {
                trumpname: `trumps.${this.normalizeTrumpName()}`,
            },
        },
    };

Associated translation to the ``'game.play.select_trump_target'`` to illustrate usage of the params:

::

    "Who should be the target of {{trumpname}}?"


Add a hero
==========

#. Add the main image in ``assets/game/heroes/<hero-name>.png`` (used in hero selection)
#. Add the circled image in ``assets/game/heroes/<hero-name>-circle.png`` (used in the game)
#. Add the name of the hero in the array named ``heroes`` in all the environment files in ``aurelia_project/environments``
#. Add the image of its power under ``assets/game/cards/powers`` as :

   - The normalized name of the power (see existing files in this folder for examples).
   - Symlink this file with ``ln -s POWER_NAME.png HERO_NAME.png``


Modify the aliases used by default
==================================

#. Modify the list located here: https://docs.google.com/spreadsheets/d/1Ees-A_yNQTfba7wH-flbrJunLMiTcTOUsbHqUTyOKm8/edit#gid=0
#. Run ``npm run default-names``


Add a popup
===========

#. Create the model and its view in the ``app/game/widgets/popups`` folder. They must be named after the type of the popup. So for the ``transition`` popup, you will need ``transition.js`` and ``transition.html``.
#. Add the require to the file in ``app/game/widgets/popups/popups.html``
#. If you need specific style for your popup, add a SCSS file named after the type of the popup and wrap your code in ``aot-popup .popup-TYPE``. You can then require the style file as usual in the view: ``<require from="./TYPE.css"></require>``.
#. That's it, the ``compose`` element will take care of the rest.


Update the dependencies
=======================

#. Change the versions in ``package.json``.
#. Run ``npm install`` to update them.
#. Build the application for dev, prod and run the tests to check everything is running as expected.

Update aurelia-cli
------------------

#. Update the version in ``package.json``.
#. Diff the ``aurelia_project`` folder with one from a new and similar project. To create a project:

   #. Run ``au new tmp``.
   #. Follow the instructions. Use ES6 and SASS to have similar tasks.

#. Update files in ``aurelia_project/tasks`` based on the diff.
#. Check that the build and test tasks are running correctly.

Update Rollbar
--------------

#. Fetch the release from https://github.com/rollbar/rollbar.js/releases Look at the latest release and browse the files under ``dist``.
#. Push the new rollbar script to static.arenaoftitans.com
#. Update ``scripts/rollbar.js`` and set ``rollbarJsUrl`` to the new value
