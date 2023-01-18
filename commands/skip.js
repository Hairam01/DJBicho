const { SlashCommandBuilder } = require('discord.js');
const {getVoiceConnection,AudioPlayer} = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('saltar la canción actual'),
	async execute(interaction, player) {
		const connection = getVoiceConnection(interaction.member.guild.id);
		player.stop();
		try{
			await interaction.reply('Cancion saltada.');
		}
		catch(error){
			console.log('error xd');
		}
	},
};