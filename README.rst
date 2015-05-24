.. contents::


Requirements
============

API
---

You will need at least java 8 to work on this project. The build process relies
on maven.

Frontend
--------

We use `gulp <http://gulpjs.com>`_ to generate our HTML, CSS and JS files.

You must install `nodejs <https://nodejs.org/download/>`__ in order to install
and use it. With nodejs, comes npm the package manager for node. To install all the
project dependencies for the frontend, run in the project root folder:

::

   npm install

This will install the dependencies in the ``./node_modules`` folder. Too ease the
development, you may install gulp globally with ``npm install -g gulp``. This will
allow you to type ``gulp`` instead of ``./node_modules/gulp/bin/gulp.js``. If you
are on Linux or Unix like operating system and don't want to launch this command
as root, you can use `these instructions
<http://r.duckduckgo.com/l/?kh=-1&uddg=http%3A%2F%2Fwww.jujens.eu%2Fposts%2Fen%2F2014%2FOct%2F24%2Finstall-npm-packages-as-user%2F>`_.

Some file are generated from a template and configuration values. These values
are stored in *config-dev.ini* and *config-prod.ini*. You can see an example in
*config.dist.ini*.


Working
=======

The API and the frontend are independent.

API
---

The API currently requires Glassfish and a redis database to work. We advise
that you use the netbeans IDE which comes with glassfish and launch the project
from there.

Frontend
--------

If you don't want to run Glassfish and redis on your compturer, you can use the
configuration values from *config.dist.ini* in your *config-dev.ini* file to use
the API from http://www.arenaoftitans.com.

In order to generate all the files with sourcemaps, use ``gulp dev``.

In order for the site to work correctly, you need a local webserver. You can use
``gulp serve`` to launch one. You can then access the site on
http://localhost:8282.

Each time you modify a CSS, JS or HTML file, the files used by the site must be
regenerated. In order to use this process, ``gulp`` can watch these files and
regenerate them as soon as you save them. Use ``gulp watch`` to do that. This
will:

- build all the files for development
- start the watcher that will rebuilt the files that need to be rebuilt once you
  save them
- start the small webserver

You can list all the tasks you can launch simply by typing ``gulp`` or ``gulp
help``. More tasks are available, but you shouldn't have to launch them. Read the
gulpfile for more information.


Contributing
============

Be sure that (this can be configured in your text editor or your IDE):

- Your files are encoded in UTF-8
- You use Unix style line ending (also called LF)
- You remove the trailing whitespaces
- You pull your code using ``git pull --rebase=preserve``

Code style
----------

- Wrap your code in 100 characters to ease reading
- Use spaces, not tabs
- For javascript, JSON and HTML, use 2 spaces to indent and 4 for continuation
  indentation. It is intended to avoid lines starting far at in the right.
- For java, use 4 spaces.

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
