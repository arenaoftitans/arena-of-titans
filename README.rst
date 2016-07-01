Arena of Titans
===============

.. contents::


Requirements
============

Dependencies
------------

- NodeJS (latest version, https://nodejs.org/en/)

You can now install the JS dependencies for AoT (launch these commands in the
AoT folder):

- Install node modules: ``npm install``. This will install the dependencies in
  ``./node_modules``.

The configuration of the front end (used to choose on which host it must connect
to the api and to enable the debug mode) is generated based on values from
``./config/config.prod.toml`` and ``./config/config.dev.toml``. The values of
``config.prod.toml`` are used to deploy the application on the server and thus
must not be tampered with. You can override any value of this file by using the
relevant section and keys in ``config.dev.toml``. The resulting configuration is
written in ``./config/application.json``.


Usage
=====

- If you don't want to run the api and redis on your compturer, you can use the
  configuration values from ``config.prod.toml`` in your ``config.dev.toml``
  file to use the API from http://api.arenaoftitans.com
- To launch the development server, use ``npm run dev``. This will compile the
  app for development in memory, launch a webserver, watch for any
  changes and reload your page once the changes are taken into account.
- To launch tests, use ``npm run test``.
- To lint the js and css files, use ``npm run lint``.
- To build all the files as in dev, use ``npm run build``.
- To build the files for prod, use ``npm run prod``.
- To build the files to test the prod, use ``npm run mock``. The configuration
  will be loaded from ``config/config.test.toml``.
- To deploy the app, use ``npm run deploy``.
- To depoly the test version of the app, use ``npm run devdepoly``.
- To update the translations, use ``npm run translate``.
- To update the sprites of the cards, use ``npm run sprites``.


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
- Use 4 spaces to indent and 8 for continuation indentation. It is intended to
  avoid lines starting far at in the right.

Commit
------

We try to follow the same `rules as the angular project
<https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit>`__
towards commits. Each commit is constituted from a summary line, a body and
eventually a footer. Each part are separated with a blank line.

The summary line is as follow: ``<type>(<scope>): <short description>``. It must
not end with a dot and must be written in present imperative. Don't capitalize
the fist letter. The whole line shouldn't be longer than 80 characters and if
possible be between 70 and 75 characters. This is intended to have better
logs.

The possible types are :

- chore for changes in the build process or auxiliary tools.
- doc for documentation
- feat for new features
- ref: for refactoring
- style for modifications that not change the meaning of the code.
- test: for tests

The body should be written in imperative. It can contain multiple
paragraph. Feel free to use bullet points.

Use the footer to reference issue, pull requests or other commits.

This is a full example:

::

   feat(css): use CSS sprites to speed page loading

   - Generate sprites with the gulp-sprite-generator plugin.
   - Add a build-sprites task in gulpfile

   Close #24

Lint
----

Please use ``gulp lint`` to lint the js and css files before committing. This
can be done automatically by using the pre-commit hook. To enable it, put in
``.git/hoosk/pre-commit``:

.. code:: bash

   #!/usr/bin/env bash

   set -e

   npm run lint


Translations
============

The translations are generated from `this google doc
<https://docs.google.com/spreadsheets/d/1YWBqm7OUVshYZhVrKiCnbuYBUcPlLtB0dR7rqpWbevU/edit#gid=1072267331>`__. Each
sheet correspond to a part of the application: site (for all the pages of the
site), game (for gobal game traductions), game/create, game/play, global (for
global translations), cards (for the translations of names and descriptions of
the cards), trumps (for the translations of the names and descriptions of the
trumps). To update the JSON in the frontend, use either:

- `npm run translate`
- `python3 scripts/translate.py`

The translations are performed in the browser by the `aurelia-i18n
<https://github.com/aurelia/i18n>`__ plugin.

To translate something:

#. Add the relevant key in the spreadsheet.
#. Update the JSON files containing the translations.
#. In the HTML, use if possible (ie text/html that don't rely on aurelia
   binding):

   - the ``t`` tag with the key as value. For instance: ``<span
     t="site.connection_button"></span>``. If the translated text contains HMTL,
     add ``[html]`` before the key: ``<span
     t="[html]site.homepage.pitch"></span>``. If you need some value provided by
     aurelia in the code, delimit it with __ and use the ``t-params.bind`` to
     supply the value. Eg, use the value ``C'est le tour de <br
     /><strong>__playerName__</strong>`` and this code to supply ``playerName``:

     .. code:: html

        <p class="centered-important"
           t="[html]game.play.whose_turn_message"
           t-params.bind="{playerName: currentPlayerName}">
        </p>

   - the TValueConverter (if you cannot use the option above): ``${ 'TAKEN' | t}``.

#. If you need to translate trough the code:

   #. Inject the I18N service.
   #. Translate with ``this._i18n.tr('cards.queen_red')`` or
      ``this._i18n.tr('cards.queen_red', {toto: 'toto'})`` if the value
      requires some string to be replaced.

See the plugin page on github for the full documentation.


Add a hero
==========

#. Add the main image in ``asserts/game/heroes/<hero-name>.png`` (used in hero selection)
#. Add the circled image in ``asserts/game/heroes/<hero-name>-circle.png`` (used in the game)
#. Add the name of the hero in the static array named ``heroes`` in ``app/game/game.js``
