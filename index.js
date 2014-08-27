var path = require('path'),
    broccoli = require('broccoli');

module.exports = function(projectDir, tree) {
    var watched = [],
        duplicates = [];

    var builder = new broccoli.Builder(tree);
    return builder.build(willReadStringTree)
        .then(findDuplicates)
        .then(function() {
            return {
                watched: watched,
                duplicates: duplicates
            }
        });

    function willReadStringTree(tree) {
        watched.push(tree);
    }

    function findDuplicates() {
        watched.sort();
        watched.forEach(function(parent) {
            watched.forEach(function(child) {
                if (normalize(projectDir, child).indexOf(normalize(projectDir, parent) + '/') === 0) {
                    duplicates.push({
                        parent: parent,
                        child: child
                    });
                }
            });
        });
    }
};

function normalize(projectDir, tree) {
    tree = path.relative(projectDir, tree);
    if (tree === '') {
        tree = '.';
    } else {
        tree = './' + tree;
    }
    return tree;
}
