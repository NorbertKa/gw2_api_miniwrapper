var chai = require('chai');
var gw2Api = require('../index.js').default;
var request = require('node-fetch');
var _ = require('lodash');

describe('Materials API', function () {
    it('should return all material IDs', function (done) {
        gw2Api({
            name: 'materials'
        }, function (err, data) {
            request('https://api.guildwars2.com/v2/materials')
                .then(function (res) {
                    return res.text();
                })
                .then(function (body) {
                    chai.expect(JSON.parse(body)).to.deep.equal(data);
                    done();
                })
        })
    });
    it('should return single material', function (done) {
        gw2Api({
            name: 'materials',
            ids: ['5']
        }, function (err, data) {
            request('https://api.guildwars2.com/v2/materials/5')
                .then(function (res) {
                    return res.text();
                })
                .then(function (body) {
                    chai.expect(JSON.parse(body)).to.deep.equal(data[0]);
                    done();
                })
        })
    });
    it('should return multiple materials', function (done) {
        gw2Api({
            name: 'materials',
            ids: ['5','6']
        }, function (err, data) {
            request('https://api.guildwars2.com/v2/materials?ids=5,6')
                .then(function (res) {
                    return res.text();
                })
                .then(function (body) {
                    chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 5})]).to.deep.equal(data[_.findKey(data, {id: 5})]);
                    chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 6})]).to.deep.equal(data[_.findKey(data, {id: 6})]);
                    done();
                })
        })
    })
});