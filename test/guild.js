var chai = require('chai');
var gw2Api = require('../index.js').default;
var request = require('node-fetch');
var _ = require('lodash');

describe('Guild API', function () {
    describe('emblem', function () {
        describe('foregrounds', function () {
            it('should return all IDs', function (done) {
                gw2Api({
                    name: 'emblem/foregrounds'
                }, function (err, data) {
                    request('https://api.guildwars2.com/v2/emblem/foregrounds')
                        .then(function (res) {
                            return res.text();
                        })
                        .then(function (body) {
                            chai.expect(JSON.parse(body)).to.deep.equal(data);
                            done();
                        })
                })
            });
            it('should return single foreground', function (done) {
                gw2Api({
                    name: 'emblem/foregrounds',
                    ids: ['1']
                }, function (err, data) {
                    request('https://api.guildwars2.com/v2/emblem/foregrounds/1')
                        .then(function (res) {
                            return res.text();
                        })
                        .then(function (body) {
                            chai.expect(JSON.parse(body)).to.deep.equal(data[0]);
                            done();
                        })
                })
            });
            it('should return multiple foregrounds', function (done) {
                gw2Api({
                    name: 'emblem/foregrounds',
                    ids: ['1', '3', '4']
                }, function (err, data) {
                    request('https://api.guildwars2.com/v2/emblem/foregrounds?ids=1,3,4')
                        .then(function (res) {
                            return res.text();
                        })
                        .then(function (body) {
                            chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 1})]).to.deep.equal(data[_.findKey(data, {id: 1})]);
                            chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 3})]).to.deep.equal(data[_.findKey(data, {id: 3})]);
                            chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 4})]).to.deep.equal(data[_.findKey(data, {id: 4})]);
                            done();
                        })
                })
            })
        });
        describe('backgrounds', function () {
            it('should return all IDs', function (done) {
                gw2Api({
                    name: 'emblem/backgrounds'
                }, function (err, data) {
                    request('https://api.guildwars2.com/v2/emblem/backgrounds')
                        .then(function (res) {
                            return res.text();
                        })
                        .then(function (body) {
                            chai.expect(JSON.parse(body)).to.deep.equal(data);
                            done();
                        })
                })
            });
            it('should return single background', function (done) {
                gw2Api({
                    name: 'emblem/backgrounds',
                    ids: ['1']
                }, function (err, data) {
                    request('https://api.guildwars2.com/v2/emblem/backgrounds/1')
                        .then(function (res) {
                            return res.text();
                        })
                        .then(function (body) {
                            chai.expect(JSON.parse(body)).to.deep.equal(data[0]);
                            done();
                        })
                })
            });
            it('should return multiple backgrounds', function (done) {
                gw2Api({
                    name: 'emblem/backgrounds',
                    ids: ['1','2','3']
                }, function (err, data) {
                    request('https://api.guildwars2.com/v2/emblem/backgrounds?ids=1,2,3')
                        .then(function (res) {
                            return res.text();
                        })
                        .then(function (body) {
                            chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 1})]).to.deep.equal(data[_.findKey(data, {id: 1})]);
                            chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 2})]).to.deep.equal(data[_.findKey(data, {id: 2})]);
                            chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 3})]).to.deep.equal(data[_.findKey(data, {id: 3})]);
                            done();
                        })
                })
            })
        })
    });
    describe('guild/permissions', function () {
        it('should return all permissions', function (done) {
            gw2Api({
                name: 'guild/permissions'
            }, function (err, data) {
                request('https://api.guildwars2.com/v2/guild/permissions')
                    .then(function (res) {
                        return res.text();
                    })
                    .then(function (body) {
                        chai.expect(JSON.parse(body)).to.deep.equal(data);
                        done();
                    })
            })
        });
        it('should return single permission', function (done) {
            gw2Api({
                name: 'guild/permissions',
                ids: ['ClaimableEditOptions']
            }, function (err, data) {
                request('https://api.guildwars2.com/v2/guild/permissions/ClaimableEditOptions')
                    .then(function (res) {
                        return res.text();
                    })
                    .then(function (body) {
                        chai.expect(JSON.parse(body)).to.deep.equal(data[0]);
                        done();
                    })
            })
        });
        it('should return multiple permissions', function (done) {
            gw2Api({
                name: 'guild/permissions',
                ids: ['ClaimableEditOptions','EditBGM']
            }, function (err, data) {
                request('https://api.guildwars2.com/v2/guild/permissions?ids=ClaimableEditOptions,EditBGM')
                    .then(function (res) {
                        return res.text();
                    })
                    .then(function (body) {
                        chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 'ClaimableEditOptions'})]).to.deep.equal(data[_.findKey(data, {id: 'ClaimableEditOptions'})]);
                        chai.expect(JSON.parse(body)[_.findKey(JSON.parse(body), {id: 'EditBGM'})]).to.deep.equal(data[_.findKey(data, {id: 'EditBGM'})]);
                        done();
                    })
            })
        })
    });

    describe('guild/upgrades', function () {
        it('should return all upgrades', function (done) {
            gw2Api({
                name: 'guild/upgrades'
            }, function (err, data) {
                request('https://api.guildwars2.com/v2/guild/upgrades')
                    .then(function (res) {
                        return res.text();
                    })
                    .then(function (body) {
                        chai.expect(JSON.parse(body)).to.deep.equal(data);
                        done();
                    })
            })
        });
        it('should return single upgrade', function (done) {
            gw2Api({
                name: 'guild/upgrades',
                ids: ['38']
            }, function (err, data) {
                request('https://api.guildwars2.com/v2/guild/upgrades/38')
                    .then(function (res) {
                        return res.text();
                    })
                    .then(function (body) {
                        chai.expect(JSON.parse(body)).to.deep.equal(data[0]);
                        done();
                    })
            })
        });
        it('should return multiple upgrades', function (done) {
            gw2Api({
                name: 'guild/upgrades',
                ids: ['38', '43']
            }, function (err, data) {
                request('https://api.guildwars2.com/v2/guild/upgrades?ids=38,43')
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