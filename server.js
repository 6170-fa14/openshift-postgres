var express = require('express');
var app = express();

var pg = require('pg');

var connection_string = 'postgres://' + process.env.USER + '@localhost/mytest';

if (process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD) {
  connection_string = 'postgres://' + process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME + ':' +
        process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD + '@' +
        process.env.OPENSHIFT_POSTGRESQL_DB_HOST + ':' +
        process.env.OPENSHIFT_POSTGRESQL_DB_PORT + '/mypostgres';
}

console.log("Postgres connection to " + connection_string);
var db = new pg.Client(connection_string);

app.get('/', function(req, res) {
    db.query('SELECT * FROM foo', function(err, result) {
        if (err) {
            return console.error('error running query');
        }

        res.writeHead(200, {"Content-Type": "text/plain"});
        for (var i = 0; i < result.rows.length; ++i)
            res.write("#" + i + ": " + result.rows[i].baz + " / " + result.rows[i].bar + "\n");
        res.end();
    });
});

db.connect(function(err) {
    if (err) {
        return console.error('could not connect to database');
    }

    var port = process.env.OPENSHIFT_NODEJS_PORT;
    var ip = process.env.OPENSHIFT_NODEJS_IP;

    app.listen(port || 8080, ip);
});
