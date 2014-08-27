broccoli-duplicate-watched-tree-finder
======================================

A utility to list all watched [Broccoli](https://github.com/broccolijs/broccoli)
trees and find duplicates.

Duplicate watched trees might consume extra resources on your machine. So why
not avoid them?


## Installation

```
npm install -g broccoli-duplicate-watched-tree-finder
```

## Usage

`cd` into a directory that contains a `Brocfile.js`. An example `Brocfile.js`
with duplicate watched trees could be:

```javascript
var pickFiles = require('broccoli-static-compiler'),
    compileSass = require('broccoli-sass'),
    mergeTrees = require('broccoli-merge-trees');

var app = 'app';

var styles = 'app/styles'
var styles = compileSass(styles, 'app.scss', 'assets/app.css');

module.exports = mergeTrees([app, styles]);
```

Then run the `broccoli-duplicate-watched-tree-finder` command within the
directory and you will see output like:

```
$ broccoli-duplicate-watched-tree-finder
All watched trees:
  - app
  - app/styles

Duplicate watched trees:
 - app/styles is inside app
You should wrap the trees shown in blue in broccoli-unwatched-tree.
```

You can fix the problem by requiring [broccoli-unwatched-tree](https://github.com/rwjblue/broccoli-unwatched-tree)
and wrapping `'/app/styles'` in it:

```javascript
var pickFiles = require('broccoli-static-compiler'),
    unwatched = require('broccoli-unwatched-tree'),
    compileSass = require('broccoli-sass'),
    mergeTrees = require('broccoli-merge-trees');

var app = 'app';

var styles = unwatched('app/styles')
var styles = compileSass(styles, 'app.scss', 'assets/app.css');

module.exports = mergeTrees([app, styles]);
```

Running the command again will now give you:

```
$ broccoli-duplicate-watched-tree-finder
All watched trees:
  - app

Nice! You do not have any duplicate watched paths.
```

Notice: The finder performs a full Broccoli build, so the command might take a
few seconds to finish depending on how complex your build is.
