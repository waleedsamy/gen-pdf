const _ = require('lodash'),
    metrics = require('./metrics'),
    prom = require('prom-client');

const htmlPdfDefaultoptions = {
    'format': 'A4',
    'orientation': 'portrait',
    'border': {
        'top': '4mm',
        'right': '4mm',
        'bottom': '4mm',
        'left': '4mm'
    }
};

function insureHTML(req, res, next) {
    if (!req.body.html) {
        let err = new Error('body param `html` is missing.');
        err.code = 400;
        return next(err);
    }
    return next();
}

function insureConfig(req, res, next) {
    if (req.body.config) {
        try {
            let conf = JSON.parse(req.body.config);
            let mergedConfig = {};
            _.merge(mergedConfig, htmlPdfDefaultoptions, conf);
            req.body.config = mergedConfig;
        } catch (e) {
            e.code = 415;
            return next(e);
        }
    } else {
        req.body.config = htmlPdfDefaultoptions;
    }
    return next();
}

function promRegisterMetrics(req, res) {
    res.end(prom.register.metrics());
}

function logErrors(err, req, res, next) {
    logger.error(err.message, err.stack, err);
    return next(err)
}

function promUpdateErrorMetrics(err, req, res, next) {
    metrics.httpRequestsTotal.inc({
        code: err.code || 500,
        method: req.method.toLowerCase()
    });
    return next(err);
}

function errorHandler(err, req, res, next) {
    return res.sendStatus(err.code || 500);
}

module.exports = {
    insureHTML: insureHTML,
    insureConfig: insureConfig,
    promRegisterMetrics: promRegisterMetrics,
    logErrors: logErrors,
    promUpdateErrorMetrics: promUpdateErrorMetrics,
    errorHandler: errorHandler
}
