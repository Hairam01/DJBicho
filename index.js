
const fs = require('node:fs');
const path = require('node:path');
// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const { token } = require('./config.json');
const {createAudioPlayer,getVoiceConnection,VoiceConnectionStatus,joinVoiceChannel,createAudioResource} = require('@discordjs/voice');
const playdl = require('play-dl');
const queue = require('./commands/queue');
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildVoiceStates] });
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const ytpl = require('ytpl');

const cola = [];
let player;
let sub;

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
	//console.log(interaction);
    const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		if (interaction.commandName==='play') {
			op = interaction.options.getString('cancion');
			if(ytpl.validateID(op)){
				const playlist = await ytpl(op);
				for(let element of playlist.items){
					await agregarCola(interaction,element.shortUrl);
				}
			}
			else{
				await command.execute(interaction,cola);
				let connection = getVoiceConnection(interaction.guild.id);
				if(typeof connection==='undefined') {
					play(interaction,cola);	
				}
				else if(connection.state.status==VoiceConnectionStatus.Disconnected ){
					play(interaction,cola);
				} 
			}
		}
		else if(interaction.commandName==='queue'){
			await command.execute(interaction,cola);
		}
		else await command.execute(interaction,player);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

async function agregarCola(interaction,url){
	const name = await playdl.video_basic_info(url);
		const cancion = {
			nombre: name.video_details.title,
			url : url
		};
		cola.push(cancion);
		await interaction.channel.send(cancion.nombre + ' agregada a la cola');
		let connection = getVoiceConnection(interaction.guild.id);
			if(typeof connection==='undefined') {
				play(interaction,cola);	
			}
			else if(connection.state.status==VoiceConnectionStatus.Disconnected ){
				play(interaction,cola);
			}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isSelectMenu()) return;

	if (interaction.customId === 'select') {
		let op = interaction.values[0]; 
		if(op!='0'){
		await interaction.update({ content: '¡Gracias por seleccionar!', components: [] });
			if(ytpl.validateID(op)){
				const playlist = await ytpl(op);
				for(let element of playlist.items){
					await agregarCola(interaction,element.shortUrl);
				}
			}
			else{
				agregarCola(interaction,op); 
			}
		}
		else{
			await interaction.update({ content: 'Busqueda cancelada', components: [] });
		}
	}
});

async function play(interaction,cola){
	player = createAudioPlayer();
	let connection = getVoiceConnection(interaction.guild.id);
	const voiceChannel = interaction.member.voice.channel; 

	if(cola[0]){
		//console.log('Estado de la cola:');
		//console.log(cola.toArray());
		//console.log('sigue '+cola.front().nombre); 
		nowplaying = cola[0];
	}
	else{
		console.log('fin de la musica');
		connection.disconnect();
		return;
	}

	if(typeof connection==='undefined' || connection.state.status==VoiceConnectionStatus.Disconnected){
			connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.client.guilds.cache.get(interaction.guild.id).voiceAdapterCreator
		  });
	}
	const sub = connection.subscribe(player);
	const stream = await playdl.stream(nowplaying.url);
	let resource = createAudioResource(stream.stream,{
		inputType: stream.type
	});
	interaction.channel.send('Reproduciendo '+ nowplaying.nombre + ' en ' + voiceChannel.name );
	
	
	player.play(resource);

	resource.playStream.on('error', error => {
		console.error(error);
	});
   
	player.on("stateChange", (oldOne, newOne) => {
		//console.log(oldOne.status + " => " + newOne.status);
		if(oldOne.status==='playing' && newOne.status==='idle'){
			//console.log('entrado en idle desde playing');
			cola.shift();
			play(interaction,cola);
		}
	});
}

// Log in to Discord with your client's token
client.login(token);