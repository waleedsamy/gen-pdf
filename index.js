var express = require('express'),
    prom = require('prom-client'),
    pdf = require('html-pdf'),
    bodyParser = require('body-parser'),
    exwml = require('exwml'),
    app = express(),
    insureHTML = require('./middleware').insureHTML,
    insureConfig = require('./middleware').insureConfig,
    promRegisterMetrics = require('./middleware').promRegisterMetrics,
    logErrors = require('./middleware').logErrors,
    promUpdateErrorMetrics = require('./middleware').promUpdateErrorMetrics,
    errorHandler = require('./middleware').errorHandler,
    metrics = require('./metrics'),
    urlencodedParser = bodyParser.urlencoded({
        limit: '50mb',
        extended: false
    });

app.post('/', urlencodedParser, insureHTML, insureConfig, function(req, res, next) {
    pdf.create(req.body.html, req.body.config).toStream(function(err, stream) {
        if (err || !stream) {
            return next(err);
        }
        metrics.httpRequestsTotal.inc({
            code: 200,
            method: 'post'
        });
        stream.pipe(res);
    });
});

app.get('/metrics', promRegisterMetrics);

app.use(logErrors);
app.use(promUpdateErrorMetrics);
app.use(errorHandler);

app.listen(3000, function() {
    logger.alert('Service starting', {
        host: 'localhost',
        port: 3000
    });
})
