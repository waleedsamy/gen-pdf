const prom = require('prom-client');

const HTTP_REQUESTS_TOTAL = 'http_requests_total',
    httpRequestsTotal = new prom.Counter(HTTP_REQUESTS_TOTAL, 'count of http requests', ['code', 'method']);

module.exports = {
    httpRequestsTotal: httpRequestsTotal
}
