import _ from 'lodash';
import { stringify } from 'querystring';
import request from 'node-fetch';

export function idsBuilder(ids, callback) {
    if (ids && ids != '') {
        if (_.isArray(ids)) {
            let paramUrl = "";
            _.forEach(ids, function (value) {
                if (value == _.last(ids)) {
                    paramUrl += value;
                } else {
                    paramUrl += value + ','
                }
            });
            callback(paramUrl);
        } else {
            let idsArray = [ids];
            let paramUrl = "";
            _.forEach(idsArray, function (value) {
                if (value == _.last(idsArray)) {
                    paramUrl += value;
                } else {
                    paramUrl += value + ','
                }
            });
            callback(paramUrl);
        }
    } else {
        callback(false);
    }
}

export function checkLang(lang, callback) {
    callback(_.indexOf(['en', 'fr', 'de', 'es'], lang));
}

export function urlBuilder(options, callback) {
    if (options.name) {
        const version = options.version || 'v2';
        const apikey = options.apikey || '';
        const lang = options.lang || 'en';
        const input = options.input;
        const output = options.output;
        const floor_id = options.floor_id;
        const region_id = options.region_id;
        const map_id = options.map_id;
        const selector = options.selector || '';
        let selectorPart = "/" + selector;
        const worldId = options.world;
        let url = "https://api.guildwars2.com/" + version + "/" + options.name;
        let urlIds = "";
        idsBuilder(options.ids, function (ids) {
            urlIds = ids;
            checkLang(lang, function (err) {
                if (!err) {
                    if (urlIds) {
                        if (options.name === 'continents') {
                            if (map_id && region_id && floor_id && selector) {
                                url +="/" + options.ids + "/floors/" + floor_id + "/regions/" + region_id + "/maps/" + map_id + "/" + selectorPart + "?" + stringify({
                                        access_token: apikey,
                                        lang: lang
                                    });
                                callback(null, url);
                            } else if (region_id && floor_id) {
                                url +="/" + options.ids + "/floors/" + floor_id + "/regions/" + region_id + selectorPart + "?" + stringify({
                                        access_token: apikey,
                                        lang: lang
                                    });
                                callback(null, url);
                            } else if (floor_id) {
                                url += "/" + options.ids + "/floors/" + floor_id + selectorPart + "?" + stringify({
                                        access_token: apikey,
                                        lang: lang
                                    });
                                console.log(url);
                                callback(null, url);
                            } else {
                                url += '?' + stringify({access_token: apikey, ids: urlIds, lang: lang});
                                callback(null, url);
                            }
                        } else {
                            url += '?' + stringify({access_token: apikey, ids: urlIds, lang: lang});
                            callback(null, url);
                        }
                    } else {
                        if (input) {
                            url += '?' + stringify({access_token: apikey, input: input, lang: lang});
                            callback(null, url);
                        } else if (output) {
                            url += '?' + stringify({access_token: apikey, output: output, lang: lang});
                            callback(null, url);
                        } else {
                            url += '?' + stringify({access_token: apikey, lang: lang});
                            callback(null, url);
                        }
                    }
                } else {
                    callback(new Error('Unsupported language (Supported:[\'en\', \'fr\', \'de\', \'es\']'))
                }
            })
        });
    } else {
        callback(new Error('Supply argument: name (options.name)'))
    }
}

export default function (options, callback) {
    if (options && typeof(callback) === 'function') {
        urlBuilder(options, function (err, url) {
            if (err) {
                callback(err);
            } else {
                request(url)
                    .then(function (res) {
                        return res.text();
                    })
                    .then(function (body) {
                        callback(null, JSON.parse(body));
                    })
            }
        })
    }
}