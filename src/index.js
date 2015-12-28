import _ from 'lodash';
import { stringify } from 'querystring';
import request from 'node-fetch';

export function _idBuilder(ids) {
    return new Promise(function (fulfill, reject) {
        if (ids) {
            let idArray = [];
            if (typeof(ids) === 'string' || typeof(ids) === 'number') {
                idArray[0] = ids;
            } else if (_.isArray(ids)) {
                idArray = ids;
            } else {
                reject(new Error('No valid Ids supplied to _idBuilder function, Ids supplied: ' + ids))
            }

            let idUrl = "";
            _.forEach(idArray, function (value) {
                if (value === _.last(idArray)) {
                    idUrl += value;
                } else {
                    idUrl += value + ',';
                }
            });
            fulfill({
                url: idUrl,
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
                url: endpointUrl,
                array: endpointArray
            });

        } else {
            reject(new Error('No endpoints supplied to _endpointBuilder function.'))
        }
    })
}

export function _createParameters(parameters) {
    return new Promise(function (fulfill, reject) {
        if (parameters) {
            let parametersArray = [];
            if (_.isArray(parameters)) {
                parametersArray = parameters;
            } else if (_.isObject(parameters)) {
                parametersArray[0] = parameters;
            } else {
                reject(new Error('No valid parameters supplied to _createParameters function'));
            }

            let mergedObject = {};
            _.forEach(parametersArray, function (value) {
                _.merge(mergedObject, value);
            });
            if (mergedObject.access_token === '' || mergedObject.access_token === null) mergedObject = _.omit(mergedObject, 'access_token');
            if (mergedObject.ids === '' || mergedObject.ids === null) mergedObject = _.omit(mergedObject, 'ids');
            if (mergedObject.output === '' || mergedObject.output === null) mergedObject = _.omit(mergedObject, 'output');
            if (mergedObject.input === '' || mergedObject.input === null) mergedObject = _.omit(mergedObject, 'input');
            fulfill('?' + stringify(mergedObject));

        } else {
            reject(new Error('No parameters supplied to _createParameters function.'));
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
                const splitKey = apiKey.split('-');
                let check = true;
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
                    fulfill()
                } else {
                    reject(new Error('Invalid apiKey.'))
                }
            } else {
                reject(new Error('Invalid apiKey (string.length).'))
            }
        } else {
            reject(new Error('No apiKey supplied to _checkApiKey function.'))
        }
    })
}

export function _optionChecker(options) {
    return new Promise(function (fulfill, reject) {
        if (options) {
            if (options.endpoints) {
                if (options.apiKey) {
                    _checkApiKey(options.apiKey)
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

export default function _urlBuilder(options) {
    return new Promise(function (fulfill, reject) {
        _optionChecker(options)
            .then(function () {
                _endpointBuilder(options.endpoints)
                    .then(function (endData) {
                        const endpointArray = endData.array;
                        const endpointUrl = endData.url;
                        const endpointMain = endpointArray[0];
                        const apiKey = options.apiKey || '';
                        const lang = options.lang || '';
                        let extraParams = options.parameters || {};
                        if (options.ids) {
                            _idBuilder(options.ids)
                                .then(function (idData) {
                                    _createParameters([{
                                        access_token: apiKey,
                                        lang: lang,
                                        ids: idData.url
                                    }, extraParams])
                                        .then(function (parameters) {
                                            _request(endData.url + parameters)
                                                .then(function (reqData) {
                                                    fulfill(reqData);
                                                })
                                                .catch(function (error) {
                                                    console.log(error);
                                                })
                                        })
                                        .catch(function (error) {
                                            reject(error);
                                        })
                                })
                                .catch(function (error) {
                                    reject(error);
                                })
                        } else if (options.parameters && !options.apiKey) {
                            _createParameters([{
                                access_token: apiKey,
                                lang: lang
                            }, extraParams])
                                .then(function (parameters) {
                                    _request(endData.url + parameters)
                                        .then(function (reqData) {
                                            fulfill(reqData);
                                        })
                                        .catch(function (error) {
                                            console.log(error);
                                        })
                                })
                                .catch(function (error) {
                                    reject(error);
                                })
                        } else {
                            _createParameters([{access_token: apiKey, lang: lang}, options.parameters])
                                .then(function (parameters) {
                                    _request(endpointUrl + parameters)
                                        .then(function (requestData) {
                                            fulfill(requestData);
                                        })
                                        .catch(function (error) {
                                            reject(error);
                                        })
                                })
                                .catch(function (error) {
                                    console.log(error);
                                })
                        }
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

export function _request(url) {
    return new Promise(function (fulfill, reject) {
        if (url) {
            request("https://api.guildwars2.com/v2" + url)
                .then(function (res) {
                    return res.text();
                })
                .then(function (body) {
                    fulfill(JSON.parse(body));
                })
                .catch(function (error) {
                    reject(error);
                })
        } else {
            reject(new Error('No url supplied to _request'))
        }
    })
}