// Function: Handle success and error responses
const onSuccess = (res, data, message, statusCode = 200) => {
    console.log(message);
    res.status(statusCode).json(data);
};

const onError = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({ message: err.message });
};

module.exports = { onSuccess, onError };