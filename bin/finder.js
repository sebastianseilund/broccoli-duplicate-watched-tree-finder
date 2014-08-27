#!/usr/bin/env node

var path = require('path'),
    fs = require('fs'),
    colors = require('colors'),
    find = require('../');

var projectDir = process.cwd(),
    brocfilePath = path.join(projectDir, 'Brocfile.js');

if (!fs.existsSync(brocfilePath)) {
    console.log(colors.red('You need to cd into a directory that contains a Brocfile.js'));
    process.exit(1);
}

var tree = require(brocfilePath);

find(projectDir, tree)
    .then(function(result) {
        var watched = result.watched,
            duplicates = result.duplicates;
        if (watched.length > 0) {
            console.log('All watched trees:');
            watched.forEach(function(tree) {
                console.log('  - ' + tree);
            });
        } else {
            console.log('Your Broccoli tree is not watching any trees.');
        }

        console.log();

        if (duplicates.length > 0) {
            console.log(colors.red('Duplicate watched trees:'));
            duplicates.forEach(function(d) {
                console.log('  - ' + colors.blue(d.child) + ' is inside ' + d.parent);
            });
            console.log('You should wrap the trees shown in ' + colors.blue('blue') + ' in broccoli-unwatched-tree.');
            process.exit(1);
        } else {
            console.log(colors.green('Nice! You do not have any duplicate watched trees.'));
            process.exit(0);
        }
    })
    .catch(function(e) {
        console.log(colors.red('A build error was caught:'))
        console.log(e.stack);
        process.exit(1);
    })
