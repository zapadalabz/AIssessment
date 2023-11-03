const express = require('express'); //Line 1
const https = require('https');
//const fs = require('fs');
const path = require('path');
const qs = require('qs');

const app = express(); //Line 2
const cors = require('cors');
require("dotenv").config();
console.log(process.env.CUSTOMCONNSTR_ATLAS_URI);
const port = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
app.use(require("./routes/record_hf.js"));
app.use(require("./routes/record_openAI.js"));

const dbo = require("./db/conn");

/*
const options = {
  key: fs.readFileSync('./private.key'),
  cert: fs.readFileSync('./certificate.crt')
};*/


/**
 * BrightSpace OAuth 2.0
 */
const clientID = process.env.BRIGHTSPACE_CLIENT_ID;
const clientSecret = process.env.BRIGHTSPACE_CLIENT_SECRET;
const apiEndpoint = process.env.BRIGHTSPACE_API_ENDPOINT;

const authorizationEndpoint = 'https://auth.brightspace.com/oauth2/auth';//`${apiEndpoint}/d2l/auth/oauth2/auth`;
const tokenEndpoint = 'https://auth.brightspace.com/core/connect/token';//`${apiEndpoint}/d2l/auth/oauth2/token`;

const redirectURI = `https://localhost:${port}/auth/oauthcallback`;

// Step 1: Redirect the user to the authorization endpoint
app.get('/login', (req, res) => {
  const authorizationParams = {
    response_type: 'code',
    client_id: clientID,
    redirect_uri: redirectURI,
    scope: 'calendar:*:* content:*:* core:*:* datahub:*:* dropbox:*:* enrollment:*:* globalusermapping:*:* grades:*:* organizations:organization:read quizzing:*:* reporting:*:* users:*:*'
  };

  const authorizationURL = `${authorizationEndpoint}?${qs.stringify(authorizationParams)}`;
  res.redirect(authorizationURL);
});

app.get('/auth/oauthcallback', async (req, res) => {
  const authorizationCode = req.query.code;
  const accessToken = await exchangeAuthorizationCodeForAccessToken(authorizationCode);
  const profileData = await getProfileData(accessToken);
  res.send(profileData);
});

async function exchangeAuthorizationCodeForAccessToken(authorizationCode) {
  const tokenParams = {
    grant_type: 'authorization_code',
    code: authorizationCode,
    redirect_uri: redirectURI
  };

  const tokenHeaders = {
    'Authorization': `Basic ${Buffer.from(`${clientID}:${clientSecret}`).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  const tokenResponse = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: tokenHeaders,
    body: qs.stringify(tokenParams)
  });

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

async function getProfileData(accessToken) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'X-Csrf-Token': 'fetch',
    'X-Target-URI': apiEndpoint
  };

  const response = await fetch(`${apiEndpoint}/d2l/api/lp/1.0/users/whoami`, { headers });
  const data = await response.json();
  return data;
}

/*
// This displays message that the server running and listening to specified port
https.createServer(options, app).listen(port,async () => {
  console.log(`Listening on port ${port}`);
    await dbo.connectToServer(function (err) {
        if (err) console.error(err);
    });    
    console.log(`Server is running on port: ${port}`);
});*/

app.listen(port, async () => {
  console.log(`Listening on port ${port}`);
    await dbo.connectToServer(function (err) {
        if (err) console.error(err);
    });    
    console.log(`Server is running on port: ${port}`);
});