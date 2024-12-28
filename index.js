const express = require('express');
const connectDB = require('./config/db');
const router = require('./routes');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const cors = require('cors');
const port = 5000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use('/api', router);

app.listen(port, () => {
  console.log(`Events.io | Listening on http://localhost:${port}`);
});
