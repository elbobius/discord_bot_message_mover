const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.DirectMessages,GatewayIntentBits.MessageContent,] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}
const filePath = "./data.json";


//global vars
var channelFrom = "1019297494192107601";
var channelTo = "1019297792524566609";
var activated = false;

getSavedParameters(filePath);

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) {
		return;
	}

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		(async () => {
			if(await command.execute(interaction) === interaction){
				await changeMover(interaction);
			}
		  })()
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on("messageCreate",async message => {
	//console.log(message.content);
	await runMover(message,client);
});

client.login(token);



async function changeMover(interaction){
	const { commandName } = interaction;
	if(commandName){
		switch(interaction.options.getSubcommand()){
			case 'on':
				await interaction.reply('mover activated');
				activated = true;
				saveParameters(filePath);
				break;
			case 'off':
				await interaction.reply('mover deactivated');
				activated = false;
				saveParameters(filePath);
				break;
			case 'set':
				channelFrom = interaction.options.getString('source');
				channelTo = interaction.options.getString('target');
				saveParameters(filePath);
				await interaction.reply('mover set');
				break;
		}
	}
}

async function runMover(message,client){
	//console.log(`ch id must: ${message.channel.id} is: ${channelFrom} activ: ${activated}`);
	if((activated === true) && (message.channel.id === channelFrom)){
		const channel = await client.channels.fetch(channelTo);
		channel.send({ content: message.content });
		await message.delete();
		console.log("message moved");
	}	
}

function getSavedParameters(filePath){
	if (!fs.existsSync(filePath)){
		try{
			saveParameters(filePath);
		}
		catch(err){
	
		}
	}
	var obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
	try{
		activated = obj["active"];
		channelFrom = obj["from"];
		channelTo = obj["to"];
		console.log(`activated: ${activated}, ´from: ${channelFrom}, to: ${channelTo} loaded`)
	}
	catch(err){

	}
}

function saveParameters(filePath){
	console.log("save parameters stared")
	try{
		let data = JSON.stringify({active: Boolean(activated), from: String(channelFrom), to: String(channelTo)});
		fs.writeFile(filePath, data, (err) => {
			if (err) throw err;
			console.log(`activated: ${activated}, ´from: ${channelFrom}, to: ${channelTo} written`)
			console.log('Data written to file');
		});
	}
	catch(err){

	}
}