const express = require('express');
const app = express();
const indexRouter = require('./routes/index');

app.set('view engine', 'pug');
app.use('/', indexRouter);

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

module.exports = server;

