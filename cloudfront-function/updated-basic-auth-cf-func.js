var USERNAME = 'xxxxx';
var PASSWORD = 'xxxxx';

var response401 = {
  statusCode: 401,
  statusDescription: 'Unauthorized',
  headers: {
    'www-authenticate': {value:'Basic'},
  },
};

function validateBasicAuth(authHeader)
{
  var match = authHeader.match(/^Basic (.+)$/);
  if (!match)
    return false;

  //https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-javascript-runtime-features.html
  var credentials = String.bytesFrom(match[1], 'base64').split(':', 2);

  return credentials[0] === USERNAME && credentials[1] === PASSWORD;
}

function handler(event)
{
  var request = event.request;
  var headers = request.headers;
  var uri = request.uri;
  var specificUri = 'cdn/client-script.js';
  var auth = (headers.authorization && headers.authorization.value) || '';
  
  if (uri.includes(specificUri))
    return request;

  if (!validateBasicAuth(auth))
    return response401;

  return request;
}
