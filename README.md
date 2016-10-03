# nodeFire
AngularFire with token authentication on node backend server
https://www.firebase.com/docs/web/libraries/angular/

## Get Started with nodeFire
1. Run these commands to add the project locally:
```shell
$ git clone https://github.com/LukeSchlangen/nodeFire
$ cd nodeFire
$ npm install
```
2. Create a free Firebase account at https://firebase.google.com
3. Create a project from your Firebase account console
4. Click the “Add Firebase to your web app” icon
  * Copy the contents WITHOUT SCRIPT TAGS or the CDN from the resulting popup into `public/config.js`. It should look like this:
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
5. Follow the instructions in [Add Firebase to your App](https://firebase.google.com/docs/server/setup#add_firebase_to_your_app) to add a Firebase service account to your backend
  * Rename the new JSON file to `firebase-service-account.json` and save it in the `server` folder of your application
6. Configure Google as an authentication provider for your Firebase project.
  1. In the Firebase console for your project, click "Auth" in left panel
  2. Click "Set Up Sign-In Method" button
  3. Select "Google"
  4. Click the "edit" icon
  5. Toggle Google to `on`
7. Run `npm start` to run your application on `localhost:5000`
