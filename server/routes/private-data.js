var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('../modules/database-config');

router.get("/", function(req, res){
  pg.connect(connectionString, function(err, client, done){
    var userEmail = req.decodedToken.email;
    // Check the user's level of permision based on their email
    client.query('SELECT clearance_level FROM users WHERE email=$1', [userEmail], function(err, clearanceLevelQueryResult){
      done();
      if(err){
        console.log('Error COMPLETING clearance_level query task', err);
        res.sendStatus(500);
      }else{
        pg.connect(connectionString, function(err, client, done){
          if(clearanceLevelQueryResult.rows.length === 0) {
            // If the user is not in the database, return a forbidden error status
            console.log('No user found with that email. Have you added this person to the database? Email: ', req.decodedToken.email);
            res.sendStatus(403);
          } else {
            var clearanceLevel = clearanceLevelQueryResult.rows[0].clearance_level;
            // Based on the clearance level of the individual, give them access to different information
            client.query('SELECT * FROM secret_information WHERE secrecy_level<=$1', [clearanceLevel], function(err, results){
              if(err){
                console.log('Error COMPLETING secret_information query task', error);
                res.sendStatus(500);
              }else{
                // return all of the results where a specific user has permission
                res.send(results.rows);
              }
            });
          }
          done();
        });
      }
    });
  });
});

module.exports = router;
