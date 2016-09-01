Arena of Titans
===============

.. contents::


Setup
=====

- NodeJS (latest version, https://nodejs.org/en/)
- Windows Users: you need to install `additional dependencies to install browser sync <https://www.browsersync.io/docs/#windows-users>`_:

  - `python 2 <https://www.python.org/downloads/release/python-2710/>`__ (please tick 'Add python.exe to Path' during install).
  - `Microsoft Visual Studio C++ 2013 <https://www.microsoft.com/en-gb/download/details.aspx?id=44914>`__. See `here in case of installation problems <https://github.com/nodejs/node-gyp/blob/master/README.md#installation>`_.

You can now install the node dependencies. To do so, launch in the folder in which you cloned this repository:

- Install node modules: ``npm install``

Configuration
-------------

The configuration of the front end (used to choose on which host it must connect to the api and to enable the debug mode) is written in ``./config/application.js`` based on values from:

- ``./config/config.dev.toml`` when building for development.
- ``./config/config.prod.toml`` when building for production. The values in this file are used to deploy the application on the server and thus are tracked by git. They must not be tampered with unless you know what you are doing.
- ``./config/config.staging.toml`` when building for staging. The values in this file are used to deploy the application on the server and thus are tracked by git. They must not be tampered with unless you know what you are doing.
- ``./config/config.testing.toml`` when buiding for testing. See the README of the API for more information on that.

Use the API from staging when developing the frontend
+++++++++++++++++++++++++++++++++++++++++++++++++++++

This allows you to develop the frontend without running an API locally. This is specially useful if you develop only on the frontend (eg you are a designer) and don't want to bother with the API.

To build the frontend for development and use the API from the staging server, copy ``./config/config.staging.toml`` into ``./config/config.dev.toml``.

Use a local version of the API
++++++++++++++++++++++++++++++

Copy ``./config/config.staging.toml`` into ``./config/config.dev.toml``. Then, adapt the values in it. There are two cases (look at the README for the API to learn more about them):

#. Launch the API and make it directly accessible. In this case, you want to update the values below in the ``api`` section (the given values suppose that you are using the default values for the API):

   .. code:: ini

      host = '127.0.0.1'
      path = ''
      port = 9000

#. Run the API behind a proxy. In this case, you want to the values of host, port and path to match your proxy configuration. For instance:

   .. code:: ini

      host = 'api.aot'
      path = '/ws/{version}'


Usage
=====

- To launch the development server, use ``npm run dev``. This will compile the app for development in memory, launch a webserver, watch for any changes and reload your page once the changes are taken into account. If you get an error like ``python3 not found``, check that:

  - When you installed Python, you added it to the PATH
  - Copy your ``python.exe`` from your Python install directory into ``python3.exe``

- To launch tests on time, use ``npm run test``
- To launch tests automatically when a modification is done, use ``npm run tdd``
- To build all the files as in dev, use ``npm run builddev``
- To build the files for prod, use ``npm run buildprod``
- To build the config like in dev, use ``npm run config -- --type dev --version latest`` You can adapt the build type and the version if needed.
- To clean the build folder, use ``npm run clean``
- To lint the JS and SCSS files, use ``npm run lint`` This is equivalent to running ``npm run jslint && npm run stylelint``
- To lint only the JS files, use ``npm run jslint``
- To lint only the SCSS files, use ``npm run stylelint``
- To update the translations, use ``npm run translate``.
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

pre-commit
~~~~~~~~~~

.. code:: bash

   #!/usr/bin/env bash

   set -e

   npm run lint

pre-push
~~~~~~~~

This is only useful if you don't use ``npm run tdd`` during development.

.. code:: bash

   #!/usr/bin/env bash

   set -e

   npm run test

Translations
============

The translations are generated from `this google doc <https://docs.google.com/spreadsheets/d/1YWBqm7OUVshYZhVrKiCnbuYBUcPlLtB0dR7rqpWbevU/edit#gid=1072267331>`__. Each sheet correspond to a part of the application: site (for all the pages of the site), game (for gobal game traductions), game/create, game/play, global (for global translations), cards (for the translations of names and descriptions of the cards), trumps (for the translations of the names and descriptions of the trumps). To update the JSON in the frontend, use either:

- `npm run translate`
- `python3 scripts/translate.py`

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


Add a hero
==========

#. Add the main image in ``asserts/game/heroes/<hero-name>.png`` (used in hero selection)
#. Add the circled image in ``asserts/game/heroes/<hero-name>-circle.png`` (used in the game)
#. Add the name of the hero in the static array named ``heroes`` in ``app/game/game.js``
