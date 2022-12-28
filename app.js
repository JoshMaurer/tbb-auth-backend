const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dataBaseConnect = require('./database/dataBaseConnect');
const User = require('./database/userSetup');
const auth = require('./auth');


dataBaseConnect();


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response, next) => {
  response.json({ message: 'server response in JSON! This is the way...' });
  next();
});

app.post('/register', (request, response) => {
    bcrypt
        .hash(request.body.password, 11)
        .then((passTheHash) => {
            const user = new User({
                email: request.body.email,
                password: passTheHash,
            });
            user
                .save()
                .then((result) => {
                    response.status(201).send({
                        message: 'Successfull user creation',
                        result,
                    });
                })
                .catch((error) => {
                    response.status(500).send({
                        message: 'User creation error',
                        error,
                    });
                });
        })
        .catch((tbb) => {
            response.status(500).send({
                message: 'Unsuccessfull password hash',
                tbb,
            });
        });
});


app.post('/login', (request, response) => {
    User.findOne({ email: request.body.email })
        .then((user) => {
            bcrypt
                .compare(request.body.password, user.password)
                .then((checkPassword) => {
                    if(!checkPassword) {
                        return response.status(400).send({
                            message: 'Passwords does not match',
                            error,
                        });
                    }
                    const token = jwt.sign(
                        {
                            userId: user._id,
                            userEmail: user.email,
                        },
                        'RANDOM-TOKEN',
                        { expiresIn: "6h" }
                    );
                    response.status(200).send({
                        message: 'Successful Login',
                        email: user.email,
                        token,
                    });
                })
                .catch((error) => {
                    response.status(400).send({
                        message: 'Passwords is all wonky... Try again',
                        error,
                    });
                });
        })
        .catch((tbb) => {
            response.status(404).send({
                message: 'Email just gone...',
                tbb,
            });
        });
});

// free endpoint
app.get("/free-endpoint", (request, response) => {
    response.json({ message: "You are free to access me anytime" });
  });
  
  // authentication endpoint
  app.get("/auth-endpoint", auth, (request, response) => {
    response.send({ message: "You are authorized to access me" });
  });

module.exports = app;