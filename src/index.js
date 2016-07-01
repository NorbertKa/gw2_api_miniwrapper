import _ from 'lodash';
import request from 'isomorphic-fetch';

export function _idBuilder(ids) {
    return new Promise(function (fulfill, reject) {
        if (typeof(ids) === 'number' || typeof(ids) === 'string' || _.isArray(ids)) {
            let idArray = [];
            if (typeof(ids) === 'string' || typeof(ids) === 'number') {
                idArray[0] = ids;
            } else if (_.isArray(ids)) {
                idArray = ids;
            } else {
                reject(new Error('No valid Ids supplied to _idBuilder function, Ids supplied: ' + ids))
            }

            let idUrl = _.reduce(idArray, function(acc, curr) { return acc + "," + curr; });
            fulfill({
                urlPart: idUrl,
                array: idArray
            });

        } else {
            reject(new Error('No Ids supplied to _idBuilder function.'))
        }
    })
}

export function _endpointBuilder(endpoints) {
    return new Promise(function (fulfill, reject) {
        if (endpoints) {
            let endpointArray = [];
            if (typeof(endpoints) === 'string' || typeof(endpoints) === 'number') {
                endpointArray[0] = endpoints;
            } else if (_.isArray(endpoints)) {
                endpointArray = endpoints;
            } else {
                reject(new Error('No valid endpoints supplied to _endpointBuilder function, endpoints supplied: ' + endpoints))
            }

            let endpointUrl = "";
            _.forEach(endpointArray, function (value) {
                endpointUrl += '/' + value;
            });
            fulfill({
                urlPart: endpointUrl,
                array: endpointArray
            });

        } else {
            reject(new Error('No endpoints supplied to _endpointBuilder function.'))
        }
    })
}


export function _checkLang(lang) {
    return new Promise(function (fulfill, reject) {
        if (typeof(lang) === 'string') {
            if (_.indexOf(['en', 'fr', 'de', 'es'], lang) > -1) {
                fulfill();
            } else {
                reject(new Error('Language (Lang), not supported.'))
            }
        } else {
            reject(new Error('No Lang supplied to _checkLang function.'));
        }
    })
}

export function _checkApiKey(apiKey) {
    return new Promise(function (fulfill, reject) {
        if (apiKey) {
            if (apiKey.length === 72) {
                const key = apiKey.split('-')[4];
                if (key.length === 20) {
                    fulfill();
                } else {
                    reject(new Error('Invalid access_token'))
                }
            } else {
                reject(new Error('Invalid access_token (string.length).'))
            }
        } else {
            reject(new Error('No access_token supplied to _checkApiKey function.'))
        }
    })
}

export function _optionChecker(options) {
    return new Promise(function (fulfill, reject) {
        if (options) {
            if (options.endpoints) {
                if (options.access_token || options.apikey || options.apiKey) {
                    _checkApiKey(options.access_token || options.apikey || options.apiKey)
                        .then(function () {
                            if (options.lang) {
                                _checkLang(options.lang)
                                    .then(function () {
                                        fulfill();
                                    })
                                    .catch(function (error) {
                                        reject(error);
                                    })
                            } else {
                                fulfill();
                            }
                        })
                        .catch(function (error) {
                            reject(error);
                        })
                } else if (options.lang) {
                    _checkLang(options.lang)
                        .then(function () {
                            fulfill();
                        })
                        .catch(function (error) {
                            reject(error);
                        })
                } else {
                    fulfill();
                }
            } else {
                reject(new Error('No valid endpoints supplied.'))
            }

        } else {
            reject(new Error('No valid options supplied.'))
        }
    })
}

export function _optionParser(options) {
    return new Promise(function (fulfill, reject) {
        if (typeof(options) === 'object') {
            _endpointBuilder(options.endpoints)
                .then(function ({urlPart: endPart}) {
                    let parserData = [{key: 'endpoints', endPart}];
                    const data = _.omit(options, 'endpoints');
                    _.forEach(data, function (value, key) {
                        _idBuilder(value)
                            .then(function ({urlPart: idPart}) {
                                parserData.push({
                                    key, idPart
                                })
                            })
                            .catch(function (error) {
                                reject(error);
                            })
                    });
                    fulfill(parserData);
                })
                .catch(function (error) {
                    reject(error);
                })

        } else {
            reject(new Error('No valid options supplied to _optionParser'))
        }
    })
}

export function _urlBuilder(options) {
    return new Promise(function (fulfill, reject) {
        _optionChecker(options)
            .then(function () {
                _optionParser(options)
                    .then(function (parsedOptions) {
                        let url = options.url || 'https://api.guildwars2.com/v2';
                        _.forEach(parsedOptions, function (object) {
                            if (object.key === 'apikey' || object.key === 'apiKey') object.key = 'access_token';
                            if (object.key === 'endpoints') {
                                if (_.last(parsedOptions) === object) {
                                    url += object.endPart;
                                } else {
                                    url += object.endPart + "?";
                                }
                            }
                            else if (_.last(parsedOptions) === object) {
                                url += object.key + '=' + object.idPart;
                            } else url += object.key + '=' + object.idPart + '&';
                        });
                        fulfill(url);
                    })
                    .catch(function (error) {
                        reject(error);
                    })
            })
            .catch(function (error) {
                reject(error);
            })
    })
}

export default function _request(options) {
    return new Promise(function (fulfill, reject) {
        if (options) {
            _urlBuilder(options)
                .then(function (url) {
                    request(url)
                        .then(function (res) {
                            return res.text();
                        })
                        .then(function (body) {
                            fulfill(JSON.parse(body));
                        })
                        .catch(function (error) {
                            reject(error);
                        })
                })
                .catch(function (error) {
                    reject(error);
                })
        } else {
            reject(new Error('No options supplied to _request'))
        }
    })
};
