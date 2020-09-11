const express = require('express');
const path = require('path');
const _io = require('socket.io');
const fs = require('fs');

// create application instance
var app = express();
// create a router
var router = express.Router();

// middleware for logging
router.use((req, res, next) => {
    // ip for proxies:  https://stackoverflow.com/questions/10849687/express-js-how-to-get-remote-client-address
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`${Date.now()}: ${ip} [${req.method}] -> ${req.originalUrl}`);
    next();
});

// endpoint for all avaliable m3u8 files
router.get('/vid', (req, res) => {
    fs.readdir(path.join(__dirname, 'videos'), (err, files) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({vid: files}))
    });
});

// endpoint getting a specific m3u8 files
router.get('/vid/:name/index.m3u8', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'videos', req.params.name, 'index.m3u8')
    );
});

// endpoint getting a specific ts files
router.get('/vid/:name/:file.ts', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'videos', req.params.name, req.params.file + '.ts')
    );
});

// endpoint for static
const path_prefix = path.join(__dirname, 'dist');
router.use(
    '/', 
    express.static(path_prefix)
);

// register router and start server
app.use(router);
var server = app.listen(8081, () => {
    var host = server.address().address
    var port = server.address().port

    console.log("ARGUS web app listening at http://%s:%s", host, port)
});

// create socket server and register callbacks
var io = _io(server);
io.on('connection', (socket) => {
    var addr = socket.handshake.address;
    console.log(`${Date.now()}: User connected from ${addr}.`);

    socket.on('pause', () => {
        console.log(`${Date.now()}: ${addr} paused.`);
        socket.broadcast.emit('pause');
    });
    socket.on('play', () => {
        console.log(`${Date.now()}: ${addr} played.`);
        socket.broadcast.emit('play');
    });
    socket.on('seek', (msg) => {
        console.log(`${Date.now()}: ${addr} seeked to ${msg.time}`);
        socket.broadcast.emit('seek', msg);
    });
    socket.on('load', (msg) => {
        console.log(`${Date.now()}: ${addr} loading new src ${msg.src}`);
        socket.broadcast.emit('load', msg);
    })
    socket.on('disconnect', () => {
      console.log(`${Date.now()}: ${addr} disconnected.`);
    });
});
