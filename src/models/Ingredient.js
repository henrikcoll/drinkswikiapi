const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
	id: {
		type: String,
		index: true
	},
	name: {
		type: String,
		required: true
	},
	imageUrl: {
		type: String
	}
},{ timestamps: true });

const Ingredient = mongoose.model('Ingredient', IngredientSchema);

module.exports = Ingredient;