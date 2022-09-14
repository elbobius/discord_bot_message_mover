var Discord = require('discord.io');
const { exceptions } = require('winston');
var logger = require('winston');
var auth = require('./auth.json');

//global vars
var channelFrom,channelTo = null;
var activated = false;

// Configure logger settings

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
colorize: true
});

logger.level = 'debug';
// Initialize Discord Bot

var bot = new Discord.Client({
token: auth.token,
autorun: true
});

bot.on('ready', function (evt) {
logger.info('Connected');
logger.info('Logged in as: ');
logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {

    if (message.substring(0, 1) == '!') {
        commands(message, channelID, userID);
    }
});


async function commands(message, channelID, userID){
    
    var args = message.substring(1).split(' ');
    var cmd = args[0];
    args = args.splice(1);
    switch(cmd) {
        case 'ping':
            bot.sendMessage({
                to: channelID,
                message: 'Pong!'
            });
            break;

        case 'activate':
            if((channelFrom == null) || (channelTo === null)){
                bot.sendMessage({
                    to: channelID,
                    message: 'ERROR: -channels not configured- set channel with: !config <from channelID> <to channelID>'
                });
                activated = false;
            }
            else{
                bot.sendMessage({
                    to: channelID,
                    message:`bot activated from channel: ${channelFrom} to ${channelTo} `
                });
                activated = true;
            }
            break;

        case 'deactivate':
            bot.sendMessage({
                to: channelID,
                message:`bot deactivated`
            });
            activated = false;
            break;

        case 'config':
            if(args.length == 2){
                if(checkChannel(args[1])){
                    if(checkChannel(args[0])){
                        channelFrom = args[0];
                        channelTo = args[1];
                        bot.sendMessage({
                        to: channelID,
                        message:`bot configured from channel: ${channelFrom} to: ${channelTo}, activate with !activate `
                    });
                    }  
                }            
                
            }
            else{
                bot.sendMessage({
                    to: channelID,
                    message: 'ERROR: -invalid arguments- set channel with: !config <from channelID> <to channelID>'
                });
            }     
            break;
 }
}

async function checkChannel(channel){
    try{
        console.log(`testing channel: ${channel}`);
        return await bot.sendMessage({
            to: channel,
            message: `test`
        },function(err,response){
            console.log(typeof response)
            if(typeof response === 'object'){
                console.log("channel found");
                //bot.deleteMessage(channel,err.message.id);
                return true;
            }
            else{
                console.log("channel not found");
                return false;
            }
        });
        
    }
    catch(e){
        console.log(`channel not found: ${e.message}`);
        return false;
    }
    
}
