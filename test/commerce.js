var chai = require('chai');
var gw2Api = require('../index.js').default;
var request = require('node-fetch');
var _ = require('lodash');

describe('Skills API', function () {
    it('should return all skills', function (done) {
        gw2Api({
            name: 'skills'
        }, function (err, data) {
            request('https://api.guildwars2.com/v2/skills')
                .then(function (res) {
                    return res.text();
                })
                .then(function (body) {
                    chai.expect(JSON.parse(body)).to.deep.equal(data);
                    done();
                })
        })
    });
    it('should return single skill', function (done) {
        gw2Api({
            name: 'skills',
            ids: ['1175']
        }, function (err, data) {
            request('https://api.guildwars2.com/v2/skills/1175')
                .then(function (res) {
                    return res.text();
                })
                .then(function (body) {
                    chai.expect(JSON.parse(body)).to.deep.equal(data[0]);
                    done();
                })
        })
    });
    it('should return multiple skills', function (done) {
        gw2Api({
            name: 'skills',
            ids: ['1175','5486']
        }, function (err, data) {
            request('https://api.guildwars2.com/v2/skills?ids=1175,5486')
                .then(function (res) {
                    return res.text();
                })
                .then(function (body) {
                    chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 1175})]).to.deep.equal(data[_.findKey(data, {id: 1175})]);
                    chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 5486})]).to.deep.equal(data[_.findKey(data, {id: 5486})]);
                    done();
                })
        })
    })
});