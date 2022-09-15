const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios').default;

module.exports = {
	data: new SlashCommandBuilder()
	.setName('crypto')
	.setDescription('check crypto prices')
	.addStringOption(option =>
		option.setName('currency')
			.setDescription('select your currency')
			.setRequired(true)
			.addChoices(
				 {name:'bitcoin', value:'bitcoin'},
				 {name:'ethereum', value:'ethereum'},
				 {name:'cardano', value:'cardano'},
				 {name:'solana', value:'solana'},
				 {name:'ravencoin', value:'ravencoin'},
				 {name:'stacks', value:'blockstack'},
			)),
	async execute(interaction) {
		console.log(interaction.options.getString("currency"));
		const coin = interaction.options.getString("currency");
    	try {
			// Get crypto price from coingecko API
			const { data } = await axios.get(
			`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`
			);
			console.log(data);
			// Check if data exists
			if (!data[coin]["usd"]) throw Error();

			return interaction.reply(
			`The current price of 1 ${coin} = ${data[coin]["usd"]} $`
			);
		} catch (err) {
			console.log(err);
			return interaction.reply(
			'Please check your inputs. For example: !price bitcoin usd'
			);
		}
	},
};