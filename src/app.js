const express = require('express');
const path = require('path');
const app = express();

const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname , '..', 'public')));
app.use(morgan('combined'));

const { v1 } = require(path.join(__dirname, 'routes', 'v1.js'));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname , '..', 'public', 'index.html'));
});

app.use('/v1', v1);

module.exports = { app };
