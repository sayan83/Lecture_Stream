const router = require('express').Router();
const User = require('./model/User');
const Refresh = require('./model/Refresh')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/register', async (req,res) => {
	//TODO: PERFORM VALIDATION ON req.body


	//CHECK IF EMAIL ALREADY EXISTS
	try {
		const user_Exists = await User.findOne({email: req.body.email});
		if(user_Exists) return res.status(400).send('Email already exists!');
	}catch(err) {
		console.log(err);
		return res.status(500).send(err);
	}

	//HASH PASSWORD
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password,salt);


	//TRY CREATING NEW USERS
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword
	})

	try {
		const savedUser = await user.save();
		res.send(savedUser);
	}catch(err) {
		res.status(500).send(err);
	}
});



router.post('/login', async (req,res) => {
	//VALIDATE CREDENTIALS

	//TRY GETTING THE USERDATA FROM DB
	try {
		const user = await User.findOne({email: req.body.email});
		if(!user) return res.status(401).send('Invalid Credentails!');

		const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
		if(!isPasswordValid) return res.status(401).send('Invalid Credentails!');

		//GENERATE JWT TOKENS
		const accessToken = jwt.sign({_id:user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'});
		const refreshToken = jwt.sign({_id:user._id}, process.env.REFRESH_TOKEN_SECRET);

		//SAVE REFRESH TOKENS TO DATABASE
		// const tokensRecord = new Refresh({
		// 	token: refreshToken,
		// 	_id:user._id
		// });
		// const savedTokens = await tokensRecord.save();


		res.cookie('RefreshToken','refreshToken',{httpOnly:true,secure:true});
		return res.json({AccessToken: accessToken});
	} catch(err) {
		console.log(err);
		// console.log(Object.keys(err));
		if(err.code === 11000) {    // Session Already exists
			res.status(403).send('Session Already Exists');
		}
		res.status(500).send("DB Error!")
	}
});



router.get('/token', async (req,res) => {
	const received_Refresh_Token = req.cookies.refreshToken;
	//CHECK IF THE TOKEN EXISTS IN DATABASE
	try {
		const tokensCheck = await Refresh.findOne({token: received_Refresh_Token});
		// console.log(tokensCheck);
		if(tokensCheck == null)
			return res.status(403).send('Invalid Refresh Tokens!');
	}catch(err) {
	 	return res.status(500).send('DB Error');
	}

	//CHECK IF TOKEN IS VALID AND RESPOND ACCORDINGLY
	try {
		const verifed = jwt.verify(received_Refresh_Token, process.env.REFRESH_TOKEN_SECRET);
		const accessToken = jwt.sign({_id:verifed._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'});
		res.json({AccessToken: accessToken});

	}catch(err) {
		console.log(err)
		return res.status(403).send('Invalid Refresh Tokens!');
	}
});


router.post('/logout', async(req,res) => {
	const received_Refresh_Token = req.body.token;

	//DELETE REFRESH TOKEN FROM DATABASE
	try {
		const deleteRefresh = await Refresh.deleteOne({token: received_Refresh_Token});
		console.log(deleteRefresh);
		if(deleteRefresh.deletedCount == 0) {
			return res.status(401).send('Invalid Tokens Received!');
		}
	}catch(err) {
		console.log(err);
		return res.status(500).send('DB Error!');
	}

	res.sendStatus(200);
})
module.exports = router;