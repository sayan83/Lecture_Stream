const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	token: {
		type: String,
		required: true,
	},
	_id: {
		type: String,
		required: true,
	}
});

module.exports = mongoose.model('Refresh',userSchema);