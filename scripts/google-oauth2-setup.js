const fs = require('fs');
const readline = require('readline');

const Faire = require('../lib');
Faire.Config = require('../config/config');
Faire.Email.init(Faire.Config.email);

const TOKEN_DIR = Faire.Email.getTokenDir();
const TOKEN_PATH = Faire.Email.getTokenPath();


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getAccessToken(oauth2Client, callback) {
  // generate consent page url
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // will return a refresh token
    scope: 'https://www.googleapis.com/auth/gmail.send'
  });

  console.log('Visit the url: ', url);
  rl.question('Enter the code here:', function (code) {
    // request access token
    oauth2Client.getToken(code, function (err, tokens) {
      if (err) {
        return callback(err);
      }
      // set tokens to the client
      oauth2Client.setCredentials(tokens);
      const stored = storeToken(tokens);
      return callback(stored);
    });
  });
}

function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }

  console.log('storing token:', token);
  if (token.refresh_token) {
    console.log('stringified token:', JSON.stringify(token));
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
    return true;
  } else {
    console.log('Not storing token, no refresh_token found', token);
    return false;
  }
}


// Check if we have previously stored a token.
return fs.readFile(TOKEN_PATH, function(err, token) {
  if (err.code === 'ENOENT') {
  	console.log('Not currently authorized');
    // retrieve an access token
    return getAccessToken(Faire.Email.getOAuth2Client(), function (stored) {
      if (stored) {
        console.log('Authorized! Feel free to test with gmail.test.js script', Faire.Email.getOAuth2Client().credentials);
      } else {
        console.log('Did not store credentials');
      }
      return process.exit();
    });
  } else {
    let existingToken = JSON.parse(token);
    Faire.Email.getOAuth2Client().credentials = existingToken;
    console.log('Already authenticated! Feel free to test with gmail.test.js script',
    Faire.Email.getOAuth2Client().credentials);
    return process.exit();
  }
});
