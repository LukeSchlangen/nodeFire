# nodeFire with Mongo Authorization
AngularFire with token authentication on Node backend server. This branch uses the mongoose node module with a mongo database to show an authorization example.

## Get Started with nodeFire
1. Run these commands to add the project locally:
  ```shell
  $ git clone https://github.com/LukeSchlangen/nodeFire
  $ cd nodeFire
  $ git checkout mongo-authorization
  $ npm install
  ```

2. Create a free Firebase account at https://firebase.google.com

3. Create a project from your Firebase account console

4. Add a connection to firebase on your front end
  1. Click the “Add Firebase to your web app” icon
  2. Copy the contents WITHOUT SCRIPT TAGS or the CDN from the resulting popup into `public/scripts/config.js`. It should look like this:

    ```javascript
      // Initialize Firebase
      var config = {
        apiKey: "XXXXXXXXXXXXXXXXXXXXXX",
        authDomain: "XXXXXXXXXXXX.firebaseapp.com",
        databaseURL: "https://XXXXXXXXXXXX.firebaseio.com",
        storageBucket: "XXXXXXXXXXXX.appspot.com",
        messagingSenderId: "XXXXXXXXXX"
      };
      firebase.initializeApp(config);
    ```

5. Add a firebase service account to you node project
  1. Navigate to the [Service Accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk) tab in your project's settings page.
  2. Select your Firebase project.
  3. Copy your `databaseURL` from the `Admin SDK configuration snippet`. The line you need will look like this: `databaseURL: "https://XXXXXXXXX.firebaseio.com"`.
  4. Navigate to the `server/modules/decoder.js` file in the node project and replace the databaseURL. Only replace that line. It is inside of the `admin.initializeApp`:

    ```javascript
    admin.initializeApp({
      credential: admin.credential.cert("./server/firebase-service-account.json"),
      databaseURL: "https://XXXXXXXXX.firebaseio.com" // replace this line with your URL
    });
    ```
  5. Return to firebase [Service Accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk). Navigate to your project again if you have left it.
  6. Click the Generate New Private Key button at the bottom of the Firebase Admin SDK section of the Service Accounts tab.
  7. Rename the new JSON file to `firebase-service-account.json` and save it in the `server` folder of your application.

6. Return to Firebase console. Configure Google as an authentication provider for your Firebase project.
  1. In the Firebase console for your project (you may already be there from the previous step), click "Authentication" in left panel
  2. Click "Set Up Sign-In Method" button
  3. Select "Google"
  4. Click the "edit" icon
  5. Toggle Google to `on`

7. Connect the application to your database
  1. Create a new mongo database or select one you already use. In `server/modules/database-config.js`, change the connection string, currently `var connectionString = 'postgres://localhost:5432/sigma';`, to match the location of your database.
  2. Copy the queries from the `database.js` file and run them in robomongo or the mongo terminal to create the necessary collections for this project. On the `db.users.insert`, be sure to add your own name and give yourself a clearance_level from 1 to 5. This will determine what data you can see:

    ```javascript
    db.users.insert(
       [
        { email: 'lukeschlangen@gmail.com', clearanceLevel: 5 },
        { email: 'youremail@gmail.com', clearanceLevel: 4 }, // Your Google Email added here
        { email: 'yourotheremail@gmail.com', clearanceLevel: 2 }, // Your Other Google Email added here
        { email: 'luke@primeacademy.io', clearanceLevel: 3 }
       ]
    );
    ```
  Because you have set up google OAuth, you will need to log in with a google account (an email with `@gmail.com` will work great). If you have a second google account, that will make it easy to see the differences for people with differing clearance levels.

8. Run `npm start` to run your application on `localhost:5000`

## Deploying
This is incredibly tedious the first time, but will automatically deploy your application with every future change. In order to deploy this project publicly, you will likely need to add your service account properties as environment variables. Here is how to do that with Heroku:

1. Convert `firebase-service-account` to `.env` variables
  1. Add `dotenv` to you project through `npm install --save dotenv`.
  2. Add a `.env` file to the root folder of your project. Copy this text into that file (note that there are no commas):

      ```
      FIREBASE_SERVICE_ACCOUNT_TYPE="XXXXXXXXX"
      FIREBASE_SERVICE_ACCOUNT_PROJECT_ID="XXXXXXXXX"
      FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
      FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nA Whole lot of XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n-----END PRIVATE KEY-----\n"
      FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL="XXXXXXXXXXXXXXXX@XXXXXXXXX.iam.gserviceaccount.com"
      FIREBASE_SERVICE_ACCOUNT_CLIENT_ID="##################"
      FIREBASE_SERVICE_ACCOUNT_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
      FIREBASE_SERVICE_ACCOUNT_TOKEN_URI="https://accounts.google.com/o/oauth2/token"
      FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
      FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL="https://www.googleapis.com/XXXXXXXXXXX.iam.gserviceaccount.com"
      ```

      Replace every value from the right hand side of the equal sign inside of quotes in the `.env` file with the corresponding secret key from your `firebase-service-account.json` file:

      ```
      {
        "type": "XXXXXXXXX",
        "project_id": "XXXXXXXXX",
        "private_key_id": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        "private_key": "-----BEGIN PRIVATE KEY-----\nA Whole lot of XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n-----END PRIVATE KEY-----\n",
        "client_email": "XXXXXXXXXXXXXXXX@XXXXXXXXX.iam.gserviceaccount.com",
        "client_id": "##################",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/XXXXXXXXXXX.iam.gserviceaccount.com"
      }
      ```

  3. Navigate to `server/modules/decoder.js`. Replace the reference to your `firebase-service-account.json` with an object that refers to all of your `.env` variables.

    ```javascript
    admin.initializeApp({
      credential: admin.credential.cert("./server/firebase-service-account.json"),
      databaseURL: "https://my-firebase-app.firebaseio.com" // you replaced this line earlier
    });
    ```

    Now becomes

    ```javascript
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
      databaseURL: "https://my-firebase-app.firebaseio.com"
    });
    ```
    4. In the `server/app.js` file, add `require('dotenv').config();` near the top of the file (as the first line is ideal)
    

2. Deploy to Heroku
  1. Create an [Heroku](https://www.heroku.com/) account.
  2. Create a new Heroku Application.
  3. Under the `Settings` tab, in the `Config Variables` section, select `Reveal Config Vars`. Here you will need to add every configuration variable to the list (everything on the left side of the equals sign in your `.env` file is the key, everything on the right side is the value)
  4. Under the `Deploy` tab, in the `Deployment Method` section, select `Github`. Connect to the Github repository with your application.
  5. In the `Manual Deploy` section, click `Deploy Branch` to deploy for the first time.

3. Update firebase to allow another domain
  1. Return to the [firebase console](https://console.firebase.google.com/project/_/authentication/providers) and select your current project.
  2. If the link from the step above doesn't navigate you there automatically, navigate to authentication in the left hand navigation and select `SIGN-IN MMETHOD`
  3. Scroll down to the `OAuth redirect domains` section and click the `ADD DOMAIN` button
  4. Add the new domain that your site is being hosted on, likely something like `https://rushing-waterfall.herokuapp.com/`

## Contributing
1. The repository is open to contribution from all interested developers. Kindly send us Pull Requests with explanation as to what changes you have done.
2. Also, you can write to us by opening an [Issue](https://github.com/LukeSchlangen/nodeFire/issues) and also solve a current issue if possible.

## License

1. The software is registered under the [MIT License](https://github.com/LukeSchlangen/nodeFire/blob/master/LICENSE.md)
