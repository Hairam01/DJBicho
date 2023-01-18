const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Deten la canción'),
	async execute(interaction) {
		await interaction.reply('Detendré una canción algún día!!');
	},
};