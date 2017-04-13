var express = require('express'),
    prom = require('prom-client'),
    pdf = require('html-pdf'),
    bodyParser = require('body-parser'),
    exwml = require('exwml'),
    options = {
        'format': 'A4',
        'orientation': 'portrait',
        'border': {
            'top': '4mm',
            'right': '4mm',
            'bottom': '4mm',
            'left': '4mm'
        }
    },
    app = express(),
    urlencodedParser = bodyParser.urlencoded({
        limit: '50mb',
        extended: false
    });

const HTTP_REQUESTS_TOTAL = 'http_requests_total';

var httpRequestsTotal = new prom.Counter(HTTP_REQUESTS_TOTAL, 'count of http requests', ['code','method']);

app.post('/', urlencodedParser, function(req, res) {
    if (!req.body || !req.body.html) {
        httpRequestsTotal.inc({
            code: 400,
            method: 'post'
        });
        return res.sendStatus(400);
    }
    pdf.create(req.body.html, options).toStream(function(err, stream) {
        if (err || !stream) {
            logger.error(err.message, err);
            httpRequestsTotal.inc({
                code: 500,
                method: 'post'
            });
            return res.sendStatus(500);
        }
        httpRequestsTotal.inc({
            code: 200,
            method: 'post'
        });
        stream.pipe(res);
    });
});

app.get('/metrics', function(req, res) {
    res.end(prom.register.metrics());
});

app.listen(3000, function() {
    logger.alert('Service starting', {
        host: 'localhost',
        port: 3000
    });
})
