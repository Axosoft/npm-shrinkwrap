var path = require('path');
var readJSON = require('read-json');
var TypedError = require('error/typed');

var FileNotFound = TypedError({
    type: 'file.not.found',
    message: 'Expected the file {filePath} exist\n' +
        'run `npm run shrinkwrap` to generate one.'
});

module.exports = {
    shrinkwrap: readShrinkwrap,
    package: readPackage,
    devDependencies: readDevDependencies
};

function readPackage(dirname, cb) {
    var filePath = path.join(dirname, 'package.json');
    readJSON(filePath, cb);
}

function readShrinkwrap(dirname, cb) {
    var filePath = path.join(dirname, 'npm-shrinkwrap.json');
    readJSON(filePath, function(err, json) {
        if (err && err.code === 'ENOENT') {
            return cb(FileNotFound({
                filePath: filePath
            }));
        } else {
            cb(null, json);
        }
    });
}

function readDevDependencies(dirname, cb) {
    readPackage(dirname, function (err, json) {
        if (err) {
            return cb(err);
        }

        cb(null, json.devDependencies);
    });
}
