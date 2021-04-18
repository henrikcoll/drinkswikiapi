const mongoose = require('mongoose');

const DrinkSchema = new mongoose.Schema({
	id: {
		type: String,
		index: true
	},
	name: {
		type: String,
		required: true
	},
	tags: [{
		type: String
	}],
	ingredients: [{
		ingredient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Ingredient'
		},
		amount: {
			type: Number,
			min: 0
		},
		amountUnit: {
			type: 'string'
		}
	}],
	imageUrl: {
		type: String
	}
},{ timestamps: true });

const Drink = mongoose.model('Drink', DrinkSchema);

module.exports = Drink;