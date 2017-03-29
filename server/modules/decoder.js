var admin = require("firebase-admin");

if (process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY) {
  admin.initializeApp({
    credential: admin.credential.cert({
      "type": process.env.FIREBASE_SERVICE_ACCOUNT_TYPE,
      "project_id": process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
      "private_key_id": process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
      "private_key": process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
      "client_email": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      "client_id": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_ID,
      "auth_uri": process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_URI,
      "token_uri": process.env.FIREBASE_SERVICE_ACCOUNT_TOKEN_URI,
      "auth_provider_x509_cert_url": process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
      "client_x509_cert_url": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL
    }),
    databaseURL: "https://environment-variables-demo.firebaseio.com"
  });

} else {

  admin.initializeApp({
    credential: admin.credential.cert("./server/firebase-service-account.json"),
    databaseURL: "https://environment-variables-demo.firebaseio.com"
  });

}

/* This is where the magic happens. We pull the id_token off of the request,
verify it against our firebase service account private_key.
Then we add the decodedToken */
var tokenDecoder = function (req, res, next) {
  if (req.headers.id_token) {
    admin.auth().verifyIdToken(req.headers.id_token).then(function (decodedToken) {
      // Adding the decodedToken to the request so that downstream processes can use it
      req.decodedToken = decodedToken;
      next();
    })
      .catch(function (error) {
        // If the id_token isn't right, you end up in this callback function
        // Here we are returning a forbidden error
        console.log('User token could not be verified');
        res.sendStatus(403);
      });
  } else {
    // Seems to be hit when chrome makes request for map files
    // Will also be hit when user does not send back an idToken in the header
    res.sendStatus(403);
  }
}

module.exports = { token: tokenDecoder };
