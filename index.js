'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._idBuilder = _idBuilder;
exports._endpointBuilder = _endpointBuilder;
exports._checkLang = _checkLang;
exports._checkApiKey = _checkApiKey;
exports._optionChecker = _optionChecker;
exports._optionParser = _optionParser;
exports._urlBuilder = _urlBuilder;
exports.default = _request;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _idBuilder(ids) {
    return new Promise(function (fulfill, reject) {
        if (typeof ids === 'number' || typeof ids === 'string' || _lodash2.default.isArray(ids)) {
            (function () {
                var idArray = [];
                if (typeof ids === 'string' || typeof ids === 'number') {
                    idArray[0] = ids;
                } else if (_lodash2.default.isArray(ids)) {
                    idArray = ids;
                } else {
                    reject(new Error('No valid Ids supplied to _idBuilder function, Ids supplied: ' + ids));
                }

                var idUrl = "";
                _lodash2.default.forEach(idArray, function (value) {
                    if (value === _lodash2.default.last(idArray)) {
                        idUrl += value;
                    } else {
                        idUrl += value + ',';
                    }
                });
                fulfill({
                    urlPart: idUrl,
                    array: idArray
                });
            })();
        } else {
            reject(new Error('No Ids supplied to _idBuilder function.'));
        }
    });
}

function _endpointBuilder(endpoints) {
    return new Promise(function (fulfill, reject) {
        if (endpoints) {
            var endpointArray = [];
            if (typeof endpoints === 'string' || typeof endpoints === 'number') {
                endpointArray[0] = endpoints;
            } else if (_lodash2.default.isArray(endpoints)) {
                endpointArray = endpoints;
            } else {
                reject(new Error('No valid endpoints supplied to _endpointBuilder function, endpoints supplied: ' + endpoints));
            }

            var endpointUrl = "";
            _lodash2.default.forEach(endpointArray, function (value) {
                endpointUrl += '/' + value;
            });
            fulfill({
                urlPart: endpointUrl,
                array: endpointArray
            });
        } else {
            reject(new Error('No endpoints supplied to _endpointBuilder function.'));
        }
    });
}

function _checkLang(lang) {
    return new Promise(function (fulfill, reject) {
        if (typeof lang === 'string') {
            if (_lodash2.default.indexOf(['en', 'fr', 'de', 'es'], lang) > -1) {
                fulfill();
            } else {
                reject(new Error('Language (Lang), not supported.'));
            }
        } else {
            reject(new Error('No Lang supplied to _checkLang function.'));
        }
    });
}

function _checkApiKey(apiKey) {
    return new Promise(function (fulfill, reject) {
        if (apiKey) {
            if (apiKey.length === 72) {
                var key = apiKey.split('-')[4];
                if (key.length === 20) {
                    fulfill();
                } else {
                    reject(new Error('Invalid access_token'));
                }
            } else {
                reject(new Error('Invalid access_token (string.length).'));
            }
        } else {
            reject(new Error('No access_token supplied to _checkApiKey function.'));
        }
    });
}

function _optionChecker(options) {
    return new Promise(function (fulfill, reject) {
        if (options) {
            if (options.endpoints) {
                if (options.access_token || options.apikey || options.apiKey) {
                    _checkApiKey(options.access_token || options.apikey || options.apiKey).then(function () {
                        if (options.lang) {
                            _checkLang(options.lang).then(function () {
                                fulfill();
                            }).catch(function (error) {
                                reject(error);
                            });
                        } else {
                            fulfill();
                        }
                    }).catch(function (error) {
                        reject(error);
                    });
                } else if (options.lang) {
                    _checkLang(options.lang).then(function () {
                        fulfill();
                    }).catch(function (error) {
                        reject(error);
                    });
                } else {
                    fulfill();
                }
            } else {
                reject(new Error('No valid endpoints supplied.'));
            }
        } else {
            reject(new Error('No valid options supplied.'));
        }
    });
}

function _optionParser(options) {
    return new Promise(function (fulfill, reject) {
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
            _endpointBuilder(options.endpoints).then(function (_ref) {
                var endPart = _ref.urlPart;

                var parserData = [{ key: 'endpoints', endPart: endPart }];
                var data = _lodash2.default.omit(options, 'endpoints');
                _lodash2.default.forEach(data, function (value, key) {
                    _idBuilder(value).then(function (_ref2) {
                        var idPart = _ref2.urlPart;

                        parserData.push({
                            key: key, idPart: idPart
                        });
                    }).catch(function (error) {
                        reject(error);
                    });
                });
                fulfill(parserData);
            }).catch(function (error) {
                reject(error);
            });
        } else {
            reject(new Error('No valid options supplied to _optionParser'));
        }
    });
}

function _urlBuilder(options) {
    return new Promise(function (fulfill, reject) {
        _optionChecker(options).then(function () {
            _optionParser(options).then(function (parsedOptions) {
                var url = options.url || 'https://api.guildwars2.com/v2';
                _lodash2.default.forEach(parsedOptions, function (object) {
                    if (object.key === 'apikey' || object.key === 'apiKey') object.key = 'access_token';
                    if (object.key === 'endpoints') {
                        if (_lodash2.default.last(parsedOptions) === object) {
                            url += object.endPart;
                        } else {
                            url += object.endPart + "?";
                        }
                    } else if (_lodash2.default.last(parsedOptions) === object) {
                        url += object.key + '=' + object.idPart;
                    } else url += object.key + '=' + object.idPart + '&';
                });
                fulfill(url);
            }).catch(function (error) {
                reject(error);
            });
        }).catch(function (error) {
            reject(error);
        });
    });
}

function _request(options) {
    return new Promise(function (fulfill, reject) {
        if (options) {
            _urlBuilder(options).then(function (url) {
                (0, _isomorphicFetch2.default)(url).then(function (res) {
                    return res.text();
                }).then(function (body) {
                    fulfill(JSON.parse(body));
                }).catch(function (error) {
                    reject(error);
                });
            }).catch(function (error) {
                reject(error);
            });
        } else {
            reject(new Error('No options supplied to _request'));
        }
    });
};