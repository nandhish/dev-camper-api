const path = require("path");
const express = require("express");
const dotenv = require('dotenv');
//const logger = require('./middleware/logger')
const morgan = require('morgan')
//const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
//const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


// Load env vars
dotenv.config({ path: './config/config.env' });

connectDB();


// Routes files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')


const app = express();

//Body parser
app.use(express.json())

app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//File uploading
app.use(fileupload());

//Sanitize data
//app.use(mongoSanitize());


//Set Security header
app.use(helmet());

//Prevent XSS Attacks
//app.use(xss());

//Rate Limiting
/*const limitter = rateLimit({
    windowsMs: 10 * 60 * 1000, //10 mins
    max: 1
});
app.use(limitter);
*/
//Rate limit
//app.use(hpp());

// Cors
app.use(cors());



//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//app.use(logger);

// Mouter routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
  },
  apis: ['./controllers/*.js'], // Path to API docs
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(3000, () => console.log('Server running on http://localhost:3000/api-docs'));



app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;
app.listen(PORT, console.log('Server running in ', NODE_ENV, 'mode on port', PORT, () => console.log('Server running on http://localhost:5000/api-docs')));
//app.listen(PORT ,console.log(Server running in ${process.env.NODE_ENV} mode on port ${PORT}'));


// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);

    //Close server and exit process
    ServiceWorkerRegistration.close(() => process.exit(1));
});

