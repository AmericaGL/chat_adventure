'use strict';

let util = require('util');
let http = require('http');
let Bot  = require('@kikinteractive/kik');   //access to Kik Library
let mongoose = require('mongoose');
let User = require('./models/User.js');
let config = require('./config.js'); //for keys

// let dotenv = require('dotenv').load({silent: true});

///===========Kik Codes==============================
var request = require('request');
request.post({
	headers: {
		  'Content-Type': 'application/json',
			'Authorization': 'Basic ' + new Buffer("chat_stories:"+config.apiKey).toString('base64')
	 },
        url: 'https://api.kik.com/v1/code'
         }, function(error, response, body){
            console.log(body);
    });
//=====================================================


//Db use mlab or Local Db
var DB_URL = process.env.MLAB_LINK || 'mongodb://localhost/chat-bot-user'


//Mongoose
mongoose.connect(DB_URL, function(err){
	if(err) throw err
	console.log("Mongo database connected to", DB_URL)
})

// Configure the bot API endpoint, details for your bot
let bot = new Bot({
    username: 'chat_stories',  //process.env.BOT_USERNAME
    apiKey: config.apiKey,
		baseUrl:  ' http://fb5787d1.ngrok.io'  //for localhost
				//baseUrl:  'https://polar-shelf-69223.herokuapp.com/'  //for Heroku


});





bot.updateBotConfiguration();

//All If/Else Logic and is in this function
function allLogic(message){
		var outgoingMessage
	  var knife = false


		User.findOne({name:message.from}, function(err,user){
			console.log(user, err)
			if(user === null){
				user = new User({name: message.from, password:"password", state:0})

			}


	////////////////////////////////////shuffle/////////////////////////////////////

		var exclaims = ["I don't know what to do...","How did I get into this?","I should never have come here", "Help me!!"]
	  var mathRan = function (){return (Math.floor(Math.random() * (exclaims.length - 0)) + 0)}


	/////////////////////////////////////end/////////////////////////////////
			var currentState = user.state
			//

			if(message.body === "Reset"){//Dev Reset

				outgoingMessage = Bot.Message.text("Error 499383 Phone is disconnected")
				outgoingMessage.addResponseKeyboard(["Sammy has died"], false, message.from)
			}
			if(message.body === "Sammy has died"){//Reset Not working
				user.state = 0
				outgoingMessage = Bot.Message.text("Error 499383 Phone is disconnected")

			}

	////////////////////////////////////////Start////////////////////////

			if(user.state === 0) { //second message
			// if(message.body === "hey" || message.body === "What are you up to?") { //second message
		    outgoingMessage = Bot.Message.text("Do you even feel like you'd lived life on repeat?  I need your help.")
				user.state = user.state+1
				console.log(currentState)
		    outgoingMessage.addResponseKeyboard(["Sure.  What's up", "Too busy.  Sorry."], false, message.from)

		    //message.reply("cool");
		    //message.reply("Hey, I need some advice");
			}else if(user.state  === 1){
		  // }else if(message.body === "Sure.  What's up"){
		    outgoingMessage = Bot.Message.text("There's this creepy house on my street. And the front door is wide open.  Should I go in?")
		    outgoingMessage.addResponseKeyboard(["Do it!", "No way!"], false, message.from)
					user.state = 2 //at 2

		  }else if(user.state === 2){//inside house
	       //on Two Options dont set user.state
		    outgoingMessage = Bot.Message.text("Cool.  I'm inside. Looking around....There's a living room, an upstairs, a kitchen, and a basement.  Where should I go?")
		    outgoingMessage.addResponseKeyboard(["go to the living room", "what's up with the basement" ], false, message.from)
					user.state = user.state+1 //at 3



		  }else if(message.body === "what's up with the basement"){//option B Checkout basment
				  	user.state = user.state+10 // at 13
		      outgoingMessage = Bot.Message.text("There's weird noises...like moaning or something. I dont waant to go down there!  It's lockded anyway....needs a key")
		      outgoingMessage.addResponseKeyboard(["go to the living room"], false, message.from)

		  }else if(user.state === 3 || user.state === 13 ){//Want if 3 or 13
					user.state = 4
					console.log(user.state)
		    outgoingMessage = Bot.Message.text("Kind of boring.  There a fireplace with a fire burning...And a wallet on the floor.  Some kid's school ID?  Who is this kid?...")
		    outgoingMessage.addResponseKeyboard(["Take his wallet!  Easy money.", "Let's go see more of the house"], false, message.from)

		  }else if(user.state === 4){//kitchen at 4
				user.state = 5
				console.log(user.state)
		    outgoingMessage = Bot.Message.text("Cool.  I'm in the kitchen.  There's kitchen knife.  A big one!  I dont feel safe.  Like someone is watching me... ")
		    outgoingMessage.addResponseKeyboard(["Take the knife!", "What's around?"], false, message.from)

		  }else if(user.state === 5){//Upstairs at 5
				user.state = 6
				console.log(user.state)
		    outgoingMessage = Bot.Message.text("I'm upstairs now...walking towards the one room ")
		    outgoingMessage.addResponseKeyboard(["What do you see?"], false, message.from)

		  }else if(user.state === 6){//Go Talk is a Death Route. At 6
				user.state = user.state+1 //at 7
				console.log(user.state)
		    outgoingMessage = Bot.Message.text("A woman on a rocking chair....with a white dress.  There's a key on a dresser next to her...")
		    outgoingMessage.addResponseKeyboard(["Go talk to the woman", "Grab the key and bounce"], false, message.from)



		  }else if(message.body === "Grab the key and bounce"){//To the basement at 7
				user.state = 8
				console.log(user.state)
		    outgoingMessage = Bot.Message.text("I think this is the key for the basement")
		    outgoingMessage.addResponseKeyboard(["See if the key works"], false, message.from)

		  }else if(user.state === 8){//In the basement at 8
				user.state = 9
				console.log(user.state)
		    outgoingMessage = Bot.Message.text("It opened!  It's dark down there.  These moans are getting louder...I think I see a cell down there")
		    outgoingMessage.addResponseKeyboard(["Go down there. Maybe someone needs help", "Forget this! Leave now!"], false, message.from)

		  }else if(user.state === 9){//basement door. At 9
				user.state = 10
				console.log(user.state)
		    outgoingMessage = Bot.Message.text("I've gone too far.  I need to check this out ")
		    outgoingMessage.addResponseKeyboard(["What's going on?"], false, message.from)

		  }else if(user.state === 10){//Basement Zombie kids.  Leave this sick place is death Route at 10.
				user.state = 11
				console.log(user.state)
		    outgoingMessage = Bot.Message.text("There's a bunch of kids!  Pale disgusting things.  Blood is coming out of their eyes and they're trying to grab me!!!")
		    outgoingMessage.addResponseKeyboard(["See if you can free them?", "Leave this sick place!"], false, message.from)

		  }else if(message.body === "See if you can free them?"){//Basement Zombie kids
				user.state = user.state+1 //at 12
				console.log(user.state)
		    outgoingMessage = Bot.Message.text("I tried but there is man with a shotgun walking down the stairs.  I'm hiding need to stay quiet...")
		    outgoingMessage.addResponseKeyboard(["What's happening??"], false, message.from)

		  }else if(message.body === "What's happening??"){//Basement Zombie kids
				user.state = user.state+2 //at 14
				console.log(user.state)
		    outgoingMessage = Bot.Message.text("The kids busted out!  They're eating the man with the shotgun.  I can make it got the door! ")
		    outgoingMessage.addResponseKeyboard(["Go!"], false, message.from)

		  }else if(message.body === "Go!"){//Game Win at 0
				user.state = 0 //at 15
				console.log(user.state)
		    outgoingMessage = Bot.Message.text("I'm outside....on my way back home.  You saved my life.  Couldn't have dont it without you.  Stay safe tonight.")
		    outgoingMessage.addResponseKeyboard(["Play Again"], false, message.from)


		//Death Route
		  }
			else if(message.body === "Leave this sick place!"){//Basement Zombie kids
				user.state = user.state+20
				console.log(user.state)
		    outgoingMessage = Bot.Message.text("There's a man with shotgun blocking the basement door!")
		    outgoingMessage.addResponseKeyboard(["Fight him!", "Hide!"], false, message.from)

		  }
			else if(user.state === 31 || message.body === "Go talk to the woman" ){//Talk to Woman Death
				user.state = 0;
		    outgoingMessage = Bot.Message.text("Error 499383 Phone is disconnected")
		    outgoingMessage.addResponseKeyboard(["Sammy has died"], false, message.from)
			}


		////================================================================================================

			// else if(message.body === "Keep Going"){//Leave Message
			// 	user.state = user.state+1
			//
			// }

			else{ //for first message
				outgoingMessage = Bot.Message.text(exclaims[mathRan()])
				//     outgoingMessage.addResponseKeyboard(["Keep Going"], false, message.from)
						user.state = user.state+1

		  	}
				///Ivar emoji test
				// console.log("Hello Ivar")
				// 	outgoingMessage = Bot.Message.text('\ud83d\ude0d')

	    user.save()//save the user
		  bot.send(outgoingMessage, message.from)})
		}//end allLogic



bot.onTextMessage((message) => {
  //Needed to create variable for the Outgoing Message

  allLogic(message)


	});   //end bot.onTextMessage((message) =>


	//=============================Other Message Types==============================
	bot.onPictureMessage((message)=> {
		console.log("hi, Mrs Doubtfire")
			allLogic(message)

	});





let server = http
    .createServer(bot.incoming())
    .listen(process.env.PORT || 8080);
