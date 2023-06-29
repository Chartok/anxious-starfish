const express = require('express');
const { onError } = require('./utils/handlers');
const db = require('./config/connection');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);
app.use(onError);

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server running on ${PORT}!`)
    })
})