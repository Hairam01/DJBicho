const { SlashCommandBuilder} = require('discord.js');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const { disconnect } = require('process');
var search = require('youtube-search');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Reproduce una cancionowo')
        .addStringOption(option =>
            option.setName('cancion')
                .setDescription('Escribe el nombre de la canción o lloro')
                .setRequired(true)),
	async execute(interaction, cola) {
        let entrada = interaction.options.getString('cancion');
        
        if(!ytdl.validateURL(entrada)){
            //console.log('ingresaste una palabra');
            var opts = {
                maxResults: 1,
                key: 'AIzaSyDzE3O-s2NeM80ngjGL_qS9V3lHgsbDEcs',
                type: 'video'
              };
            const busqueda = await search(entrada,opts)
            //console.log(busqueda);
            cancion = {
                nombre: busqueda.results[0].title,
                url: busqueda.results[0].link
            };
            //console.log(cancion.nombre);
        }
        else{
            //console.log('ingresaste un url');
            const name = await ytdl.getBasicInfo(entrada);
            cancion = {
                nombre: name.videoDetails.title,
                url : entrada
            };
        }
        //console.log(cancion);
        cola.push(cancion);
        try{
            await interaction.deferReply();
            await interaction.editReply(cancion.nombre + ' agregada a la cola');
        }
        catch(error){
            console.log(error + 'no se pudo responder');
        }
        //console.log(cola.toArray());
	}
};