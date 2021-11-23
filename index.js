const db = require('./models/index.js');
const app = require("express")();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        // origin: ["http://localhost:8081", "http://10.20.0.7:8080"],
        origin: '*',
        // methods: ["GET", "POST"],
        // transports: ['websocket', 'polling'],
        // credentials: true
    }
});
const cors = require("cors");
const express = require("express");
const redis = require("redis");
const rd = redis.createClient();

var users = [];
const pre = "/api/v1/"

app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());

io.use((socket, next) => {
    users.push({
        userID: socket.handshake.auth.token,
        socketID: socket.id,
        host: socket.handshake.headers.host,
        address: socket.handshake.address
    })
    console.log(socket.handshake.auth.token, socket.id);
    rd.set(socket.handshake.auth.token, socket.id, (err) => {
        console.log(err);
    })
    next();
});

const sock = io.on('connection', function (socket) {
    socket.join(String(socket.handshake.auth.token));
    socket.on("connect", () => {
        console.log("User connected");
    })

    socket.on('disconnect', function () {
        users = users.filter(item => {
            return item.socketID != socket.id
        });
        rd.del(socket.handshake.auth.token, (err) => {
            console.log(err);
        })
        console.log('A user disconnected with socket id', socket.id);
    });
});

app.get("/", (req, res) => {
    res.send(users)
});

app.post(pre + "privateMessage", (req, res) => {
    var score = +new Date()
    var body = {
        to: req.body.to,
        from: req.body.from,
        message: req.body.message,
        createdAt: score
    };
    var args = [req.body.key, score, JSON.stringify(body)]
    rd.zadd(args, (err, result) => {
        if (err) throw err;
        else {
            if (result) {
                rd.get(body.to, (err, result) => {
                    if (err) throw err;
                    else {
                        sock.to(result).emit("message",body)
                    }
                })
                res.send({
                    success: true,
                    data: body
                });
            } else {
                res.send({
                    success: false
                })
            }
        }
    })
});

app.get(pre + "privateMessage", (req, res) => {
    var args = [req.query.key, +new Date(), 0, "LIMIT", 0, 50];
    rd.zrevrangebyscore(args, function (err, result) {
        if (err) throw err;
        else {
            result = result.map(item => {
                return JSON.parse(item)
            });
            res.send({
                success: true,
                data: result
            })
        }
    });
})

// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({
//     extended: true
// }));

// routesss!!!!
// require('./routes/v1/FolderRoute')(app);
// require('./routes/v1/FileRoute')(app);

require('./routes/v1/UserRoute')(app)

// handle undefined routes
app.use("*", (req, res) => {
    res.status(404).json({
        success: "false",
        message: "Page not found",
        error: {
            statusCode: 404,
            message: "You reached a route that is not defined on this server",
        },
    });
});


// set port, listen for requests
const PORT = process.env.PORT || 7676;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});