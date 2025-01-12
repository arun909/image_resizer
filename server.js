const express = require('express');
const fileUpload = require('express-fileupload');
const resize = require('./api/resize');

const app = express();

app.use(fileUpload());
app.use(express.static('public'));

app.post('/api/resize', resize);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
