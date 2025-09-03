const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', routes);
app.get('/health', (_, res) => res.json({ ok: true }));

app.use(errorHandler);
module.exports = app;
