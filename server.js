const express =  require("express");
const dotenv = require('dotenv');

// Load env vars
dotenv.config({path: './config/config.env'});

const app = express();
const  PORT = process.env.PORT;
const  NODE_ENV = process.env.NODE_ENV;
app.listen(PORT , console.log('Server running in ', NODE_ENV, 'mode on port',PORT));
//app.listen(PORT ,console.log('Server running in ${process.env.NODE_ENV} mode on port ${PORT}'));
