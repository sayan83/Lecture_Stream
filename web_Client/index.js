const express = require('express');
const app = express();
const path = require('path');

//Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/stream', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/stream.html'));
});

app.listen(4000, () => { console.log("Server running at 4000 ... ");});