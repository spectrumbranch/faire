const fs = require('fs');
const readline = require('readline');

const Faire = require('../lib');

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
      storeToken(tokens);
      return callback();
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
  if (token.refresh_token) {
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
  } else {
    console.log('Not storing token, no refresh_token found', token);
  }
}


// Check if we have previously stored a token.
return fs.readFile(TOKEN_PATH, function(err, token) {
  if (err) {
  	console.log('Not currently authorized', err);
    // retrieve an access token
    return getAccessToken(Faire.Email.getOAuth2Client(), function () {
      console.log('authorized! Feel free to test with gmail.test.js script', Faire.Email.getOAuth2Client().credentials);
      return process.exit();
    });
  } else {
    let existingToken = JSON.parse(token);
    Faire.Email.getOAuth2Client().credentials = existingToken;
    console.log('already authenticated! Feel free to test with gmail.test.js script', 
    	Faire.Email.getOAuth2Client().credentials);
    return process.exit();
  }
});