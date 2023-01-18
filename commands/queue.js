const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('MUESTRAME LA COLA AHORA'),
	async execute(interaction, cola) {
        const exampleEmbed = new EmbedBuilder()
	    .setColor(0x0099FF)
	    .setTitle('Cola del server')
	    .setAuthor({ name: 'DJ Bicho', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
	    .setDescription('¡Así están las cosas!')
	    .setTimestamp()
	    .setFooter({ text: '¡Buena música uwu!', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
        

        for (let i = 0; i < cola.length; i++) {
            exampleEmbed.addFields(  
                {name: ((i==0) ? 'reproduciendo:':('Cancion ' + (i+1))), value: cola[i].nombre},
             )
        } 

        if(cola.length == 0){
            exampleEmbed.addFields(  
                {name: 'La cola está vacía :c ', value: 'Usa play o search para agregar algunas canciones :D'},
             )
        }

        interaction.reply({ embeds: [exampleEmbed] });
	},
};