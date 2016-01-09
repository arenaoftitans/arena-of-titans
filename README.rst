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

  - python 2: https://www.python.org/downloads/release/python-2710/ (penser à
    ajouter 'Add python.exe to Path' à l'installation).
  - Microsoft Visual Studio C++ 2013:
    https://www.microsoft.com/en-gb/download/details.aspx?id=44914 See `here in
    case of installation problems
    <https://github.com/nodejs/node-gyp/blob/master/README.md#installation>`_.

You can now install the JS dependencies for AoT (launch these commands in the
AoT folder):

- Install node modules: ``npm install``. If you are on Linux or Unix like
  operating system and don't want to launch this command as root, you can use
  `these instructions
  <http://www.jujens.eu/posts/en/2014/Oct/24/install-npm-packages-as-user/>`_.
- Global problems: ``npm install -g jspm gulp``
- Install jspm dependencies: ``jspm install -y``

This will install the dependencies in ``./node_modules`` and ``jspm_packages``
folders.

Some file are generated from a template and configuration values. These values
are stored in *config-dev.toml* and *config-prod.toml*. You can see an example in
*config.dist.toml*.


Usage
=====

- If you don't want to run the api and redis on your compturer, you can use the
  configuration values from *config.dist.toml* in your *config-dev.toml* file to
  use the API from http://api.arenaoftitans.com.
- To launch the development server, use ``gulp serve``. This will compile the
  app for development in the *dist* folder, launch a webserver, watch for any
  changes and reload your page once the changes are taken into account.
- To launch tests, use ``gulp test``.
- To launch coverage, use ``gulp cover``.
- To relauch the tests on file modication, use ``gulp tdd``.


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
- For javascript, JSON and HTML, use 4 spaces to indent and 8 for continuation
  indentation. It is intended to avoid lines starting far at in the right.

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
