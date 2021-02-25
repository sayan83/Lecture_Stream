const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoute = require('./auth');
const streamRoute = require('./streaming/stream');
const cookieParser = require('cookie-parser');

dotenv.config();

//Connect to DB
mongoose.connect(
	process.env.DB_CONNECT2, { useNewUrlParser: true, useUnifiedTopology: true }, (errs) => {
		if(errs) return console.error(errs);

		console.log('Connected to DB');
});



//Middlewares
app.use((req,res,next) => {
	// res.header('Content-Type', 'application/json');
	res.set('Access-Control-Allow-Credentials', true);
	// res.header(
	// 	'Access-Control-Allow-Headers',
	// 	'Origin, X-Requested-With, Content-Type, Accept'
	// );
	next();
});
app.use(express.json());
app.use(cors({
	origin: 'http://localhost:4000',
}));
app.use(cookieParser());

//Route Middleware
app.use('/api/user', authRoute);
app.use('/api/video', streamRoute);


app.listen(3000, () => { console.log("Server running at 3000 ... ");});