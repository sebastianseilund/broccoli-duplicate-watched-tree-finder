var broccoli = require('broccoli');

module.exports = function(tree) {
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

    function willReadStringTree(path) {
        watched.push(path);
    }

    function findDuplicates() {
        watched.sort();
        watched.forEach(function(parent) {
            watched.forEach(function(child) {
                if (child.indexOf(parent + '/') === 0) {
                    duplicates.push({
                        parent: parent,
                        child: child
                    });
                }
            });
        });
    }
};
