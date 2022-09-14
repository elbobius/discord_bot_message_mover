const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mover')
		.setDescription('auto mover and deleter for messages in a channel')
		.addSubcommand(subcommand =>
			subcommand
				.setName('on')
				.setDescription('turn the message mover on'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('off')
				.setDescription('turn the message mover off'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('set')
				.setDescription('move set [channelID read/delete] [channelID write]')
				.addStringOption(option => option.setName('source').setDescription('channel id if the source channel'))
				.addStringOption(option => option.setName('target').setDescription('channel id if the target channel'))),	
		async execute(interaction) {
			return interaction;
		},			
	
};