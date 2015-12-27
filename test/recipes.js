var chai = require('chai');
var gw2Api = require('../index.js').default;
var request = require('node-fetch');
var _ = require('lodash');

describe('Recipes API', function () {
    it('should return all recipe IDs', function (done) {
        gw2Api({
            name: 'recipes'
        }, function (err, data) {
            request('https://api.guildwars2.com/v2/recipes')
                .then(function (res) {
                    return res.text();
                })
                .then(function (body) {
                    chai.expect(JSON.parse(body)).to.deep.equal(data);
                    done();
                })
        })
    });
    it('should return single recipe', function (done) {
        gw2Api({
            name: 'recipes',
            ids: ['7319']
        }, function (err, data) {
            request('https://api.guildwars2.com/v2/recipes/7319')
                .then(function (res) {
                    return res.text();
                })
                .then(function (body) {
                    chai.expect(JSON.parse(body)).to.deep.equal(data[0]);
                    done();
                })
        })
    });
    it('should return multiple recipes', function (done) {
        gw2Api({
            name: 'recipes',
            ids: ['5', '6']
        }, function (err, data) {
            request('https://api.guildwars2.com/v2/recipes?ids=5,6')
                .then(function (res) {
                    return res.text();
                })
                .then(function (body) {
                    chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 5})]).to.deep.equal(data[_.findKey(data, {id: 5})]);
                    chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 6})]).to.deep.equal(data[_.findKey(data, {id: 6})]);
                    done();
                })
        })
    });
    describe('recipes/search', function () {
        it('input', function (done) {
            gw2Api({
                name: 'recipes/search',
                input: '46731'
            }, function (err, data) {
                request('https://api.guildwars2.com/v2/recipes/search?input=46731')
                    .then(function (res) {
                        return res.text();
                    })
                    .then(function (body) {
                        chai.expect(JSON.parse(body)).to.deep.equal(data);
                        done();
                    })
            })
        });

        it('output', function (done) {
            gw2Api({
                name: 'recipes/search',
                output: '50065'
            }, function (err, data) {
                request('https://api.guildwars2.com/v2/recipes/search?output=50065')
                    .then(function (res) {
                        return res.text();
                    })
                    .then(function (body) {
                        chai.expect(JSON.parse(body)).to.deep.equal(data);
                        done();
                    })
            })
        })
    })
});