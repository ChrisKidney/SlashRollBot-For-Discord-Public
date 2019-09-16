/* Discord bot code for SlashRollBot 
   Created using code from https://medium.com/davao-js/tutorial-creating-a-simple-discord-bot-9465a2764dc0
   @author: Chris Kidney
   @date: March 15, 2019
*/
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
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

// Function to get random int between min and max for rolling
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}
// Function used to get sum of array with reduce()
function getsum(total, num){
    return total + num;
}

bot.on('message', function (user, userID, channelID, message, evt) {
    // Grab username for output
        var username;
        username = user;
    // Bot listens for messages that start with '!'
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        var x = args[1];
        var y = args[2];
        var z = args[3];
        var a = args[4];
        var b = args[5];
       
        args = args.splice(1);
        switch(cmd) {
            case 'roll':
                // !roll : rolls 1-100
                if (x == null){
                    var result = getRandomInt(1,100);
                    bot.sendMessage({
                        to: channelID,
                        message: '**' + user + '**' + ' rolled: **' + result +'**'
                    });
                    break;
                // !roll help : displays help text
                }else if( x == 'help'){
                     bot.sendMessage({
                        to: channelID,
                        message: '``` SlashRollBot Commands: \n \n Wow-like roll commands: \n \n !roll : rolls between 1 and 100 \n \n !roll # : rolls between 1 and # \n \n !roll # # : rolls between # and # \n \n !roll help : Displays this help text \n \n Dice Roll Commands: \n \n !roll d# : rolls # sided dice \n \n !roll #1 d#2 : rolls #1 amount of #2 sided dice \n \n !roll d#1 + #2 : rolls #1 sided dice and adds #2. "+" can be substituted for -, *, x or / for different operations. \n \n !roll #1 d#2 + #3 : rolls #1 amount of #2 sided dice and adds #3, "+" can be substituted, same as above```'
                    });
                     break;
                // !roll # # : rolls between # and #     
                }else if(x >= 0 && y >= 0 && z == null){ 
                    var result = getRandomInt(x,y);
                    bot.sendMessage({
                        to: channelID,
                        message: '**' + user + '**' + ' rolled: **' + result +'**'
                    });
                    break;
                // !roll # : rolls between 1 and #
                }else if(x >= 0 && y == null){
                    var result = getRandomInt(1,x);
                    bot.sendMessage({
                        to: channelID,
                        message: '**' + user + '**' + ' rolled: **' + result +'**'
                    }); 
                    break;
                // !roll d# : rolls (#) sided dice
                }else if((x.substring(0,1) === "d" || x.substring(0,1) === "D") && y == null){
                    var dice = parseInt(x.substring(1),10);
                    var result = getRandomInt(1,dice);
                    if(dice == 20 && result == 20){
                        bot.sendMessage({
                            to: channelID,
                            message: '**' + user + '**' + ' rolled: **' + result +'**' + ' ***' + "  Natural 20! Critical Success! :)" + '***'
                        }); 
                        break;
                    }else if(dice == 20 && result == 1){
                        bot.sendMessage({
                            to: channelID,
                            message: '**' + user + '**' + ' rolled: **' + result +'**' + ' ***' + "  Natural 1, Critical Failure.. :(" + '***'
                        }); 
                        break;
                    }else{
                        bot.sendMessage({
                            to: channelID,
                            message: '**' + user + '**' + ' rolled: **' + result +'**'
                        }); 
                        break;
                    }
                     break;  
                // !roll x d# : rolls a user specified amount (x) of (#) sided dice
                }else if(x >= 0 && (y.substring(0,1) === "d" || y.substring(0,1) === "D") && z == null){
                    var amount = x;
                    var diceArray = [];
                    var output ="";             
                    var dice = parseInt(y.substring(1),10);
                    for(i=0; i < amount; i++){
                        diceArray[i] = getRandomInt(1,dice);
                        
                        output += String(diceArray[i]) + " ";

                        if(i != (amount-1)){
                            output+="+ ";
                        }else{
                            output+="= ";
                        }   
                    }           
                    sum = diceArray.reduce(getsum);      
                    bot.sendMessage({
                        to: channelID,
                        message: '**' + user + '**' + ' rolled: **' + output +'** **' + sum + '**'
                    }); 
                    break;
                // !roll d# (+,-,*,x,/) y : rolls a (#) sided dice and adds, subtracts, divides, or multiplies by y basd on users operator input
                }else if((x.substring(0,1) === "d" || x.substring(0,1) === "D") && y != null && z >= 0 && a == null){
                    var dice = parseInt(x.substring(1),10);
                    var result = getRandomInt(1,dice);
                    var output = "( " + result; 

                    if(y === "+"){
                        output += " ) + " + z + " =";
                        result = parseFloat(result)+parseFloat(z);
                    }else if(y === "-"){
                        output += " ) - " + z + " =";
                        result = parseFloat(result)-parseFloat(z);
                    }else if(y === "x" || y === "*"){
                        output += " ) x " + z + " =";
                        result = parseFloat(result)*parseFloat(z);
                    }else if(y === "/"){
                        output += " ) / " + z + " =";
                        result = parseFloat(result)/parseFloat(z);
                    }else{
                        break;
                    } 

                    bot.sendMessage({
                        to: channelID,
                        message: '**' + user + '**' + ' rolled: **' + output +'** **' + result + '**'
                    }); 
                    break;
                // !roll x d# (+,-,*,x,/) y : rolls a user specified amount (x) of (#) sided dice and adds, subtracts, divides, or multiplies by y based on users operator input
                }else if((x >= 0 && (y.substring(0,1) === "d" || y.substring(0,1) === "D") && z != null && a >= 0 && b == null)){
                    var amount = x;
                    var value = a;
                    var diceArray = [];
                    var output ="( ";             
                    var dice = parseInt(y.substring(1),10);
                    for(i=0; i < amount; i++){
                        diceArray[i] = getRandomInt(1,dice);
                        
                        output += String(diceArray[i]) + "";

                        if(i != (amount-1)){
                            output+=" + ";
                        }
                    }           
                    sum = diceArray.reduce(getsum);  
                    if(z === "+"){
                        output += " ) + " + a + " =";
                        sum = parseFloat(sum)+parseFloat(a);
                    }else if(z === "-"){
                        output += " ) - " + a + " =";
                        sum = parseFloat(sum)-parseFloat(a);
                    }else if(z === "x" || z === "*"){
                        output += " ) x " + a + " =";
                        sum = parseFloat(sum)*parseFloat(a);
                    }else if(z === "/"){
                        output += " ) / " + a + " =";
                        sum = parseFloat(sum)/parseFloat(a);
                    }else{
                        break;
                    }    
                    bot.sendMessage({
                        to: channelID,
                        message: '**' + user + '**' + ' rolled: **' + output +'** **' + sum + '**'
                    }); 
                    break;       
                }else{
                    break;
                }

            case 'rawhide':
                if (x == null){
                    bot.sendMessage({
                        to: channelID,
                        message: '```Howdy, my name is Rawhide Kobayashi. Im a 27 year old Japanese Japamerican (western culture fan for you foreigners). I brand and wrangle cattle on my ranch, and spend my days perfecting the craft and enjoying superior American passtimes. (Barbeque, Rodeo, Fireworks) I train with my branding iron every day, this superior weapon can permanently leave my ranch embled on a cattles hide because it is white-hot, and is vastly superior to any other method of livestock marking. I earned my branding license two years ago, and I have been getting better every day. I speak English fluently, both Texas and Oklahoma dialect, and I write fluently as well. I know everything about American history and their cowboy code, which I follow 100% When I get my American visa, I am moving to Dallas to work in an oil field to learn more about their magnificent culture. I hope I can become a cattle wrangler for the Double Cross Ranch or an oil rig operator for Exxon-Mobil! I own several cowboy hats, which I wear around town. I want to get used to wearing them before I move to America, so I can fit in easier. I rebel against my elders and seniors and speak English as often as I can, but rarely does anyone manage to respond. Wish me luck in America!```'
                    });
                    break;
                }else{
                    break;
                }    
         }  
    }     
});


