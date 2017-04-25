const should = require('should'),
    mocks = require('node-mocks-http'),
    middleware = require('./middleware');

describe('Middleware', function() {
    describe('insureHTML', function() {
        it('should show no error when body param `html` is available', function(done) {
            const HTML = `<html><body>content</body></html>`;
            const req = mocks.createRequest({
                    body: {
                        'html': HTML
                    }
                }),
                res = mocks.createResponse();
            middleware.insureHTML(req, res, function(err) {
                should.not.exist(err);
                req.body.html.should.eql(HTML);
                done();
            });
        });

        it('should return error if body param `html` not available', function(done) {
            const req = mocks.createRequest(),
                res = mocks.createResponse();
            middleware.insureHTML(req, res, function(err) {
                should.exist(err);
                err.code.should.eql(400);
                done();
            });
        });

    });


    describe('insureConfig', function() {

        it('if req.body.config shoudl be a valid json, if presented', function(done) {
            let req = mocks.createRequest({
                    body: {
                        config: '{NotValid'
                    }
                }),
                res = mocks.createResponse();
            middleware.insureConfig(req, res, function(err) {
                should.exist(err);
                err.code.should.eql(415);
                done();
            });
        });

        it('if req.body.config is empty, it should filled with the default config', function(done) {
            let req = mocks.createRequest({
                    body: {}
                }),
                res = mocks.createResponse();
            middleware.insureConfig(req, res, function() {
                req.body.config.should.be.an.Object().and.not.empty();
                done();
            });
        });

        it('if req.body.config is presented, it should merged with the default config', function(done) {
            const CUSTOM_CONFIG = {
                'orientation': 'landscape',
                'border': {
                    'top': '5mm'
                },
                'footer': {
                    'height': '28mm',
                    'contents': {
                        'first': 'Cover page'
                    }
                }
            };
            let req = mocks.createRequest({
                    body: {
                        config: JSON.stringify(CUSTOM_CONFIG)
                    }
                }),
                res = mocks.createResponse();
            middleware.insureConfig(req, res, function() {
                req.body.config.should.be.an.Object().and.not.empty();
                req.body.config.should.have.property('footer').which.is.a.Object();
                req.body.config.footer.should.be.an.Object().and.not.empty();
                req.body.config.footer.should.have.property('height').which.is.a.String().and.eql('28mm');
                req.body.config.border.should.have.property('top').which.is.a.String().and.eql('5mm');
                req.body.config.border.should.have.property('right').which.is.a.String().and.eql('4mm');
                req.body.config.border.should.have.property('bottom').which.is.a.String().and.eql('4mm');
                req.body.config.border.should.have.property('left').which.is.a.String().and.eql('4mm');
                req.body.config.should.have.property('format').which.is.a.String().and.eql('A4');
                req.body.config.should.have.property('orientation').which.is.a.String().and.eql('landscape');
                done();
            });
        });
    });

});
