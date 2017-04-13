# gen-pdf
> service to generate pdf from html using phantomjs

[![Docker Hub](https://img.shields.io/badge/docker-ready-blue.svg)](https://registry.hub.docker.com/u/waleedsamy/gen-pdf/)

#### Build
```bash
  $ docker build -t gen-pdf .
```

#### Run
```bash
  $ docker pull waleedsamy/gen-pdf
  $ docker run -d -e LOG_FORMAT=pretty -p 3000:3000 waleedsamy/gen-pdf
  $ curl -o tktpost.pdf -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'html=<div>content</div>' "http://localhost:3000/"
  $ curl -o tktpost.pdf -X POST -H "Content-Type: application/x-www-form-urlencoded" -d @big.html "http://localhost:3000/"
  # prometheus metrics
  $ curl "http://localhost:3000/metrics"
  # http_requests_total{code="400",method="post"} 1
```

#### Kubernetes friendly
```bash
  # prometheus will scrape pdfgenerator service automatically
  $ kubect create -f ./deploy/
```
