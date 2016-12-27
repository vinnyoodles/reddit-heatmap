var express = require('express');
var sync = require('synchronize');

var app = express();
var port = 3000;

app.listen(port, () => console.log(new Date(), 'Listening on *:', port));

// Use fiber for all routes.
app.use((req, res, next) => sync.fiber(next));

app.get('/api/reddit', require('./reddit'));
