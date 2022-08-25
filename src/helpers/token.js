require('dotenv').config();
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
const JWT_OPTIONS = { algorithm: 'HS256', expiresIn: '1d' };

const create = (payload) => {
    const token = jwt.sign(payload, JWT_SECRET, JWT_OPTIONS);
    return token;
};

const verify = (token) => {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
};

module.exports = { create, verify };