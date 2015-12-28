var chai = require('chai');
var gw2Api = require('../index.js').default;
var request = require('node-fetch');
var _ = require('lodash');

describe('Achievement API', function () {
    describe('achievements', function () {
        it('should return all IDs', function (done) {
            gw2Api({
                name: 'achievements'
            }, function (err, data, url) {
                request('https://api.guildwars2.com/v2/achievements')
                    .then(function (res) {
                        return res.text();
                    })
                    .then(function (body) {
                        chai.expect(JSON.parse(body)).to.deep.equal(data);
                        done();
                    })
            })
        });
        it('should return single achievement', function (done) {
            gw2Api({
                name: 'achievements',
                ids: 910
            }, function (err, data) {
                request('https://api.guildwars2.com/v2/achievements?ids=910')
                    .then(function (res) {
                        return res.text();
                    })
                    .then(function (body) {
                        chai.expect(JSON.parse(body)).to.deep.equal(data);
                        done();
                    })
            })
        });
        it('should return multiple achievements', function (done) {
            gw2Api({
                name: 'achievements',
                ids: ['1840,910,2258']
            }, function (err, data) {
                request('https://api.guildwars2.com/v2/achievements?ids=1840,910,2258')
                    .then(function (res) {
                        return res.text();
                    })
                    .then(function (body) {
                        chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 910})]).to.deep.equal(data[_.findKey(data, {id: 910})]);
                        chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 1840})]).to.deep.equal(data[_.findKey(data, {id: 1840})]);
                        chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 2258})]).to.deep.equal(data[_.findKey(data, {id: 2258})]);
                        done();
                    })
            })
        })
    });
    describe('achievements/daily', function () {
        it('should return daily achievements', function (done) {
            gw2Api({
                name: 'achievements/daily'
            }, function (err, data) {
                request('https://api.guildwars2.com/v2/achievements/daily')
                    .then(function (res) {
                        return res.text();
                    })
                    .then(function (body) {
                        chai.expect(JSON.parse(body)).to.deep.equal(data);
                        done();
                    })
            })
        })
    });

    describe('achievements/groups', function () {
        it('should return all groups', function (done) {
            gw2Api({
                name: 'achievements/groups'
            }, function (err, data) {
                request('https://api.guildwars2.com/v2/achievements/groups/')
                    .then(function (res) {
                        return res.text();
                    })
                    .then(function (body) {
                        chai.expect(JSON.parse(body)).to.deep.equal(data);
                        done();
                    })
            })
        });
        it('should return single group', function (done) {
            gw2Api({
                name: 'achievements/groups',
                ids: '65B4B678-607E-4D97-B458-076C3E96A810'
            }, function (err, data) {
                request('https://api.guildwars2.com/v2/achievements/groups/65B4B678-607E-4D97-B458-076C3E96A810')
                    .then(function (res) {
                        return res.text();
                    })
                    .then(function (body) {
                        chai.expect(JSON.parse(body)).to.deep.equal(data[0]);
                        done();
                    })
            })
        });
        it('should return multiple groups', function (done) {
            gw2Api({
                name: 'achievements/groups',
                ids: ['65B4B678-607E-4D97-B458-076C3E96A810', 'A4ED8379-5B6B-4ECC-B6E1-70C350C902D2']
            }, function (err, data) {
                request('https://api.guildwars2.com/v2/achievements/groups?ids=65B4B678-607E-4D97-B458-076C3E96A810,A4ED8379-5B6B-4ECC-B6E1-70C350C902D2')
                    .then(function (res) {
                        return res.text();
                    })
                    .then(function (body) {
                        chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: '65B4B678-607E-4D97-B458-076C3E96A810'})]).to.deep.equal(data[_.findKey(data, {id: '65B4B678-607E-4D97-B458-076C3E96A810'})]);
                        chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 'A4ED8379-5B6B-4ECC-B6E1-70C350C902D2'})]).to.deep.equal(data[_.findKey(data, {id: 'A4ED8379-5B6B-4ECC-B6E1-70C350C902D2'})]);
                        done();
                    })
            })
        })
    })
});