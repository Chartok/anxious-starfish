const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 'next' middleware centeralizing error handling
app.use((err, req, res, next) => {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message });
});

app.use(routes);

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server running on ${PORT}!`)
    })
})