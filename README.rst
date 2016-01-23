Arena of Titans
===============

.. contents::


Requirements
============

Dependencies
------------

- NodeJS (latest version, https://nodejs.org/en/)
- Windows Users: you need to install `additional dependencies to install browser
  sync <https://www.browsersync.io/docs/#windows-users>`_:

  - python 2: https://www.python.org/downloads/release/python-2710/ (please tick
    'Add python.exe to Path' during install).
  - Microsoft Visual Studio C++ 2013:
    https://www.microsoft.com/en-gb/download/details.aspx?id=44914 See `here in
    case of installation problems
    <https://github.com/nodejs/node-gyp/blob/master/README.md#installation>`_.

You can now install the JS dependencies for AoT (launch these commands in the
AoT folder):

- Install node modules: ``npm install``. This will install the dependencies in
  ``./node_modules``.
- Global programs: ``npm install -g jspm gulp`` If you are on Linux or Unix like
  operating system and don't want to launch this command as root, you can use
  `these instructions
  <http://www.jujens.eu/posts/en/2014/Oct/24/install-npm-packages-as-user/>`_.
- Install jspm dependencies (used in the front end): ``jspm install -y``. This
  will install the dependencies in ``./jspm_packages``.

The configuration of the front end (used to choose on which host it must connect
to the api and to enable the debug mode) is generated based on values from
``./config/config.dist.toml`` and ``./config/config.dev.toml``. The values of
``config.dist.toml`` are used to deploy the application on the server and thus
must not be tampered with. You can override any value of this file by using the
relevant section and keys in ``config.dev.toml``. The resulting configuration is
written in ``./config/application.json``.


Usage
=====

- If you don't want to run the api and redis on your compturer, you can use the
  configuration values from ``config.dist.toml`` in your ``config.dev.toml``
  file to use the API from http://api.arenaoftitans.com
- To launch the development server, use ``gulp serve``. This will compile the
  app for development in the *dist* folder, launch a webserver, watch for any
  changes and reload your page once the changes are taken into account.
- To launch the development server and regenerate the files in ``./dist``, use
  ``gulp watch``.
- To launch tests, use ``gulp test``.
- To launch coverage, use ``gulp cover``.
- To relauch the tests when a file is modified, use ``gulp tdd``.
- To lint the js and css files, use ``gulp lint``.
- To view the list of tasks you may need with their description, use ``gulp`` or
  ``gulp help``.


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

   gulp lint || exit 1
