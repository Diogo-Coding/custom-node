// This middleware allows you to control the requests that are going to be processed.
// You can manage them and save some information in the database about the use of the API.
// This is an example that count the number of requests.

let requestCount = 0;

function control(req, res, next) {
  // Console log Auth Type API Key
  requestCount++;
  next();
}

module.exports = control;