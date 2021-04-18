const fastify = require('fastify')();
const mongoose = require('mongoose');
const package = require('../package.json');

const Ingredient = require('./models/Ingredient');
const Drink = require('./models/Drink');

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/drinks', { useNewUrlParser: true, useUnifiedTopology: true });

fastify.register(require('fastify-cors'), {});

fastify.register(require('fastify-oas'), {
	routePrefix: '/docs',
	swagger: {
		info: {
			title: 'drinks.wiki api docs',
			description: package.description,
			version: package.version,
		},
		externalDocs: {
			url: package.homepage,
			description: 'Find more info here',
		},
		host: 'api.drinks.wiki',
		schemes: ['https'],
		consumes: ['application/json'],
		produces: ['application/json'],
	},
	exposeRoute: true
});

fastify.addSchema({
	$id: 'Ingredient',
	type: 'object',
	properties: {
		id: {
			type: 'string',
			example: 'blue-curacau'
		},
		name: {
			type: 'string',
			example: 'Blue Curaçau'
		},
		imageUrl: {
			type: 'string',
			format: 'url'
		}
	}
});

fastify.addSchema({
	$id: 'Ingredients',
	type: 'object',
	properties: {
		id: {
			type: 'string',
			example: 'blue-curacau'
		},
		name: {
			type: 'string',
			example: 'Blue Curaçau'
		},
		imageUrl: {
			type: 'string',
			format: 'url'
		}
	}
});

fastify.addSchema({
	$id: 'Drink',
	type: 'object',
	properties: {
		id: {
			type: 'string',
			example: 'blue-kamikaze'
		},
		name: {
			type: 'string',
			example: 'Blue Kamikaze'
		},
		tags: {
			type: 'array',
			items: {
				type: 'string',
				example: 'shot'
			}
		},
		ingredients: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					amount: {
						type: 'number',
						example: 1
					},
					amountUnit: {
						type: 'string',
						example: 'part'
					},
					ingredient: {
						$ref: 'Ingredient#'
					}
				}
			}
		},
		imageUrl: {
			type: 'string',
			format: 'url'
		}
	}
});

fastify.addSchema({
	$id: 'Drinks',
	type: 'object',
	properties: {
		id: {
			type: 'string',
			example: 'blue-kamikaze'
		},
		name: {
			type: 'string',
			example: 'Blue Kamikaze'
		},
		tags: {
			type: 'array',
			items: {
				type: 'string',
				example: 'shot'
			}
		},
		imageUrl: {
			type: 'string',
			format: 'url'
		}
	}
});


fastify.get('/drinks', {
	schema: {
		description: 'get all the drinks',
		tags: ['drinks'],
		summary: 'get drinks',
		query: {
			limit: {
				type: 'number',
				description: 'number of drinks to return',
				default: 20,
				minimum: 1,
				maximum: 100
			},
			skip: {
				type: 'number',
				description: 'number of drinks to skip',
				default: 0
			}
		},
		response: {
			200: {
				description: 'Successful response',
				type: 'object',
				properties: {
					drinks: {
						type: 'array',
						items: {
							$ref: 'Drinks#'
						}
					}
				}
			}
		},
		security: []
	}
}, async (req) => {
	const drinks = await Drink.find({}).skip(req.query.skip).limit(req.query.limit);

	return {
		drinks
	};
});

fastify.get('/drinks/:id', {
	schema: {
		description: 'get one drinks',
		tags: ['drinks'],
		summary: 'get drink',
		params: {
			id: {
				type: 'string'
			}
		},
		response: {
			200: {
				description: 'Successful response',
				type: 'object',
				properties: {
					drink: {
						$ref: 'Drink#'
					}
				}
			}
		},
		security: []
	}
}, async (req) => {
	const drink = await Drink.findOne({id: req.params.id}).populate('ingredients.ingredient');

	return {
		drink
	};
});

fastify.get('/ingredients', {
	schema: {
		description: 'get all the ingredients',
		tags: ['ingredients'],
		summary: 'get ingredients',
		query: {
			limit: {
				type: 'number',
				description: 'number of drinks to return',
				default: 20,
				minimum: 1,
				maximum: 100
			},
			skip: {
				type: 'number',
				description: 'number of drinks to skip',
				default: 0
			}
		},
		response: {
			200: {
				description: 'Successful response',
				type: 'object',
				properties: {
					ingredients: {
						type: 'array',
						items: {
							$ref: 'Ingredient#'
						}
					}
				}
			}
		},
		security: []
	}
}, async (req) => {
	const ingredients = await Ingredient.find({}).skip(req.query.skip).limit(req.query.limit);

	return {
		ingredients
	};
});

fastify.get('/ingredient/:id', {
	schema: {
		description: 'get one ingredient',
		tags: ['ingredients'],
		summary: 'get ingredient',
		params: {
			id: {
				type: 'string'
			}
		},
		response: {
			200: {
				description: 'Successful response',
				type: 'object',
				properties: {
					ingredient: {
						$ref: 'Ingredient#'
					}
				}
			}
		},
		security: []
	}
}, async (req) => {
	const ingredient = await Ingredient.findOne({id: req.params.id});

	return {
		ingredient
	};
});


fastify.listen(3000, '0.0.0.0');