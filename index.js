'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._idBuilder = _idBuilder;
exports._endpointBuilder = _endpointBuilder;
exports._createParameters = _createParameters;
exports._checkLang = _checkLang;
exports._checkApiKey = _checkApiKey;
exports._optionChecker = _optionChecker;
exports.default = _urlBuilder;
exports._request = _request;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _querystring = require('querystring');

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _idBuilder(ids) {
    return new Promise(function (fulfill, reject) {
        if (ids) {
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
                    url: idUrl,
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
                url: endpointUrl,
                array: endpointArray
            });
        } else {
            reject(new Error('No endpoints supplied to _endpointBuilder function.'));
        }
    });
}

function _createParameters(parameters) {
    return new Promise(function (fulfill, reject) {
        if (parameters) {
            (function () {
                var parametersArray = [];
                if (_lodash2.default.isArray(parameters)) {
                    parametersArray = parameters;
                } else if (_lodash2.default.isObject(parameters)) {
                    parametersArray[0] = parameters;
                } else {
                    reject(new Error('No valid parameters supplied to _createParameters function'));
                }

                var mergedObject = {};
                _lodash2.default.forEach(parametersArray, function (value) {
                    _lodash2.default.merge(mergedObject, value);
                });
                if (mergedObject.access_token === '' || mergedObject.access_token === null) mergedObject = _lodash2.default.omit(mergedObject, 'access_token');
                if (mergedObject.ids === '' || mergedObject.ids === null) mergedObject = _lodash2.default.omit(mergedObject, 'ids');
                if (mergedObject.output === '' || mergedObject.output === null) mergedObject = _lodash2.default.omit(mergedObject, 'output');
                if (mergedObject.input === '' || mergedObject.input === null) mergedObject = _lodash2.default.omit(mergedObject, 'input');
                fulfill('?' + (0, _querystring.stringify)(mergedObject));
            })();
        } else {
            reject(new Error('No parameters supplied to _createParameters function.'));
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
                var splitKey = apiKey.split('-');
                var check = true;
                if (splitKey[0].length !== 8) check = false;
                if (splitKey[1].length !== 4) check = false;
                if (splitKey[2].length !== 4) check = false;
                if (splitKey[3].length !== 4) check = false;
                if (splitKey[4].length !== 20) check = false;
                if (splitKey[5].length !== 4) check = false;
                if (splitKey[6].length !== 4) check = false;
                if (splitKey[7].length !== 4) check = false;
                if (splitKey[8].length !== 12) check = false;
                if (check) {
                    fulfill();
                } else {
                    reject(new Error('Invalid apiKey.'));
                }
            } else {
                reject(new Error('Invalid apiKey (string.length).'));
            }
        } else {
            reject(new Error('No apiKey supplied to _checkApiKey function.'));
        }
    });
}

function _optionChecker(options) {
    return new Promise(function (fulfill, reject) {
        if (options) {
            if (options.endpoints) {
                if (options.apiKey) {
                    _checkApiKey(options.apiKey).then(function () {
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

function _urlBuilder(options) {
    return new Promise(function (fulfill, reject) {
        _optionChecker(options).then(function () {
            _endpointBuilder(options.endpoints).then(function (endData) {
                var endpointArray = endData.array;
                var endpointUrl = endData.url;
                var endpointMain = endpointArray[0];
                var apiKey = options.apiKey || '';
                var lang = options.lang || '';
                var extraParams = options.parameters || {};
                if (options.ids) {
                    _idBuilder(options.ids).then(function (idData) {
                        _createParameters([{
                            access_token: apiKey,
                            lang: lang,
                            ids: idData.url
                        }, extraParams]).then(function (parameters) {
                            _request(endData.url + parameters).then(function (reqData) {
                                fulfill(reqData);
                            }).catch(function (error) {
                                console.log(error);
                            });
                        }).catch(function (error) {
                            reject(error);
                        });
                    }).catch(function (error) {
                        reject(error);
                    });
                } else if (options.parameters && !options.apiKey) {
                    _createParameters([{
                        access_token: apiKey,
                        lang: lang
                    }, extraParams]).then(function (parameters) {
                        _request(endData.url + parameters).then(function (reqData) {
                            fulfill(reqData);
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }).catch(function (error) {
                        reject(error);
                    });
                } else {
                    _createParameters([{ access_token: apiKey, lang: lang }, options.parameters]).then(function (parameters) {
                        _request(endpointUrl + parameters).then(function (requestData) {
                            fulfill(requestData);
                        }).catch(function (error) {
                            reject(error);
                        });
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            }).catch(function (error) {
                reject(error);
            });
        }).catch(function (error) {
            reject(error);
        });
    });
}

function _request(url) {
    return new Promise(function (fulfill, reject) {
        if (url) {
            (0, _nodeFetch2.default)("https://api.guildwars2.com/v2" + url).then(function (res) {
                return res.text();
            }).then(function (body) {
                fulfill(JSON.parse(body));
            }).catch(function (error) {
                reject(error);
            });
        } else {
            reject(new Error('No url supplied to _request'));
        }
    });
}