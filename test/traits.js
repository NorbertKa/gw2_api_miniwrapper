var chai = require('chai');
var gw2Api = require('../index.js').default;
var request = require('node-fetch');
var _ = require('lodash');

describe('Traits API', function () {
    it('should return all traits', function (done) {
        gw2Api({
            name: 'traits'
        }, function (err, data) {
            request('https://api.guildwars2.com/v2/traits')
                .then(function (res) {
                    return res.text();
                })
                .then(function (body) {
                    chai.expect(JSON.parse(body)).to.deep.equal(data);
                    done();
                })
        })
    });
    it('should return single trait', function (done) {
        gw2Api({
            name: 'traits',
            ids: ['214']
        }, function (err, data) {
            request('https://api.guildwars2.com/v2/traits/214')
                .then(function (res) {
                    return res.text();
                })
                .then(function (body) {
                    chai.expect(JSON.parse(body)).to.deep.equal(data[0]);
                    done();
                })
        })
    });
    it('should return multiple traits', function (done) {
        gw2Api({
            name: 'traits',
            ids: ['214','221']
        }, function (err, data) {
            request('https://api.guildwars2.com/v2/traits?ids=214,221')
                .then(function (res) {
                    return res.text();
                })
                .then(function (body) {
                    chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 214})]).to.deep.equal(data[_.findKey(data, {id: 214})]);
                    chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 221})]).to.deep.equal(data[_.findKey(data, {id: 221})]);
                    done();
                })
        })
    })
});