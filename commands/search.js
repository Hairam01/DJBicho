const { SlashCommandBuilder ,ActionRowBuilder, SelectMenuBuilder} = require('discord.js');
var search = require('youtube-search');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('¿Tienes una canción super indie que no aparecerá en el primer resultado? usa esto entonces!!')
        .addStringOption(option =>
            option.setName('cancion')
                .setDescription('Escribe el nombre de la canción o lloro')
                .setRequired(true)),
	async execute(interaction, player) {
        var opts = {
            maxResults: 5,
            key: 'AIzaSyDzE3O-s2NeM80ngjGL_qS9V3lHgsbDEcs'
          };
        let entrada = interaction.options.getString('cancion');
        
        const busqueda = await search(entrada,opts);  

        const titles = [];

        for(let i=0;i<5;i++){
            if (busqueda.results[i].title.length >100){
                titles.push(busqueda.results[i].title.substr(0,99));
            }
            else{
                titles.push(busqueda.results[i].title);
            }
        }

		const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
                    .addOptions(
                        {
                            label: titles[0],
                            description: busqueda.results[0].kind,
                            value: busqueda.results[0].link,
                        },
                        {
                            label: titles[1],
                            description: busqueda.results[1].kind,
                            value: busqueda.results[1].link,
                        },
                        {
                            label: titles[2],
                            description: busqueda.results[2].kind,
                            value: busqueda.results[2].link,
                        },
                        {
                            label: titles[3],
                            description: busqueda.results[3].kind,
                            value: busqueda.results[3].link,
                        },
                        {
                            label: titles[4],
                            description: busqueda.results[4].kind,
                            value: busqueda.results[4].link,
                        },
                        {
                            label: 'Cancelar',
                            value: '0',
                        },
                    )
			);
    
		await interaction.reply({ content: 'Resultados:', components: [row], ephemeral: true });
	},
};