var chai = require('chai');
var gw2Api = require('../index.js').default;
var request = require('node-fetch');
var _ = require('lodash');

describe('Skins API', function () {
    it('should return all skin Ids', function (done) {
        gw2Api({
            name: 'skins'
        }, function (err, data) {
            request('https://api.guildwars2.com/v2/skins')
                .then(function (res) {
                    return res.text();
                })
                .then(function (body) {
                    chai.expect(JSON.parse(body)).to.deep.equal(data);
                    done();
                })
        })
    });
    it('should return single skin', function (done) {
        gw2Api({
            name: 'skins',
            ids: ['10']
        }, function (err, data) {
            request('https://api.guildwars2.com/v2/skins/10')
                .then(function (res) {
                    return res.text();
                })
                .then(function (body) {
                    chai.expect(JSON.parse(body)).to.deep.equal(data[0]);
                    done();
                })
        })
    });
    it('should return multiple skins', function (done) {
        gw2Api({
            name: 'skins',
            ids: ['1', '2']
        }, function (err, data) {
            request('https://api.guildwars2.com/v2/skins?ids=1,2')
                .then(function (res) {
                    return res.text();
                })
                .then(function (body) {
                    chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 1})]).to.deep.equal(data[_.findKey(data, {id: 1})]);
                    chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 2})]).to.deep.equal(data[_.findKey(data, {id: 2})]);
                    done();
                })
        })
    })
});