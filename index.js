'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.idsBuilder = idsBuilder;
exports.checkLang = checkLang;
exports.urlBuilder = urlBuilder;

exports.default = function (options, callback) {
    if (options && typeof callback === 'function') {
        urlBuilder(options, function (err, url) {
            if (err) {
                callback(err);
            } else {
                (0, _nodeFetch2.default)(url).then(function (res) {
                    return res.text();
                }).then(function (body) {
                    callback(null, JSON.parse(body));
                });
            }
        });
    }
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _querystring = require('querystring');

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function idsBuilder(ids, callback) {
    if (ids && ids != '') {
        if (_lodash2.default.isArray(ids)) {
            var paramUrl = "";
            _lodash2.default.forEach(ids, function (value) {
                if (value == _lodash2.default.last(ids)) {
                    paramUrl += value;
                } else {
                    paramUrl += value + ',';
                }
            });
            callback(paramUrl);
        } else {
            (function () {
                var idsArray = [ids];
                var paramUrl = "";
                _lodash2.default.forEach(idsArray, function (value) {
                    if (value == _lodash2.default.last(idsArray)) {
                        paramUrl += value;
                    } else {
                        paramUrl += value + ',';
                    }
                });
                callback(paramUrl);
            })();
        }
    } else {
        callback(false);
    }
}

function checkLang(lang, callback) {
    callback(_lodash2.default.indexOf(['en', 'fr', 'de', 'es'], lang));
}

function urlBuilder(options, callback) {
    if (options.name) {
        (function () {
            var version = options.version || 'v2';
            var apikey = options.apikey || '';
            var lang = options.lang || 'en';
            var input = options.input;
            var output = options.output;
            var floor_id = options.flood_id;
            var region_id = options.region_id;
            var map_id = options.map_id;
            var selector = options.selector;
            var worldId = options.world;
            var url = "https://api.guildwars2.com/" + version + "/" + options.name;
            var urlIds = "";
            idsBuilder(options.ids, function (ids) {
                urlIds = ids;
                checkLang(lang, function (err) {
                    if (!err) {
                        if (urlIds) {
                            url += '?' + (0, _querystring.stringify)({ access_token: apikey, ids: urlIds, lang: lang });
                            callback(null, url);
                        } else {
                            if (input) {
                                url += '?' + (0, _querystring.stringify)({ access_token: apikey, input: input, lang: lang });
                                callback(null, url);
                            } else if (output) {
                                url += '?' + (0, _querystring.stringify)({ access_token: apikey, output: output, lang: lang });
                                callback(null, url);
                            } else {
                                url += '?' + (0, _querystring.stringify)({ access_token: apikey, lang: lang });
                                callback(null, url);
                            }
                        }
                    } else {
                        callback(new Error('Unsupported language (Supported:[\'en\', \'fr\', \'de\', \'es\']'));
                    }
                });
            });
        })();
    } else {
        callback(new Error('Supply argument: name (options.name)'));
    }
}