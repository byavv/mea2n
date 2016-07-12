const path = require('path');

module.exports = function __root() {
    var _root = path.resolve(__dirname);
    var args = Array.prototype.slice.call(arguments);
    return path.join.apply(path, [_root].concat(args));
}