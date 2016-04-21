'use strict';

let util = require('util');
let http = require('http');
let Bot  = require('@kikinteractive/kik');
let mongoose = require('mongoose');
let User = require('./models/user.js');


//Db use mlab or Local Db
var DB_URL = process.env.MLAB_LINK || 'mongodb://localhost/chat-bot-users'

//Mongoose
mongoose.connect(DB_URL, function(err){
	if(err) throw err
	console.log("Mongo database connected to", DB_URL)
})

// Configure the bot API endpoint, details for your bot
let bot = new Bot({
    username: 'chat_stories',  //process.env.BOT_USERNAME
    apiKey: 'c8f28c78-26af-42de-84ea-f237b1b7e506',
    baseUrl:  'http://1e384853.ngrok.io'
});



bot.updateBotConfiguration();



bot.onTextMessage((message) => {
  //Needed to create variable for the Outgoing Message
  var outgoingMessage
  var knife = false


	User.findOne({name:message.from}, function(err,user){
		console.log(user, err)
		if(user === null){
			user = new User({name: message.from, password:"password", state:"default"})
		}

		//Move all If/Else's Here!! The Whole Thing
		user.save()
		//
    var currentState = user.state


		if(user.state === "default") { //second message
		// if(message.body === "hey" || message.body === "What are you up to?") { //second message
	    outgoingMessage = Bot.Message.text("hey i need advice")

			console.log(user)
	    outgoingMessage.addResponseKeyboard(["Sure.  What's up", "Too busy.  Sorry."], false, message.from)
			user.state = "street"
	    //message.reply("cool");
	    //message.reply("Hey, I need some advice");
		}
		if(user.state === "street"){
	  // }else if(message.body === "Sure.  What's up"){
	    outgoingMessage = Bot.Message.text("There's this creepy house on my street. And the front door is wide open.  Should I go in?")
	    outgoingMessage.addResponseKeyboard(["Do it!", "No F-ing way"], false, message.from)
			user.sate = "creepy house"

	  }else if(user.sate = "creepy house"){//inside house

	    outgoingMessage = Bot.Message.text("Cool.  I'm inside. Looking around....There's a living room, an upstairs, a kitchen, and a basement.  Where should I go?")
	    outgoingMessage.addResponseKeyboard(["go to the living room", "what's up with the basement" ], false, message.from)

	  }else if(message.body === "what's up with the basement"){//inside house 2
	      outgoingMessage = Bot.Message.text("There's weird noises...like moaning or something. I dont waant to go down there!  It's lockded anyway....needs a key")
				user.state = "living room"
	      outgoingMessage.addResponseKeyboard(["go to the living room"], false, message.from)

	  }if(message.body === "go to the living room"){//Living Room
	    outgoingMessage = Bot.Message.text("Kind of boring.  There a fireplace with a fire burning...And a wallet on the floor.  Some kid's school ID?  Who is this kid?...")
	    outgoingMessage.addResponseKeyboard(["Take his wallet!  Easy money.", "Let's got see more of the house"], false, message.from)

	  }else if(message.body === "Take his wallet!  Easy money." || message.body === "Let's got see more of the house"){//Living Room
	    outgoingMessage = Bot.Message.text("Cool.  I'm in the kitchen.  There kitchen knife.  A big one!  I dont feel safe.  Like someone is f%cking watching me... ")
	    outgoingMessage.addResponseKeyboard(["Take the knife!", "What's around?"], false, message.from)

	  }else if(message.body === "Take the knife!" || message.body === "What's around?"){//Living Room
	    outgoingMessage = Bot.Message.text("I'm upstairs now...walking towards the one room ")
	    outgoingMessage.addResponseKeyboard(["What do you see?"], false, message.from)

	  }else if(message.body === "What do you see?"){//Living Room
	    outgoingMessage = Bot.Message.text("A woman on a rocking chair....with a white dress.  There's a key on a dresser next to her...")
	    outgoingMessage.addResponseKeyboard(["Go talk to the woman", "Grab the key and bounce"], false, message.from)



	  }else if(message.body === "Grab the key and bounce"){//To the basement
	    outgoingMessage = Bot.Message.text("I think this is the key for the basement")
	    outgoingMessage.addResponseKeyboard(["See if the key works"], false, message.from)

	  }else if(message.body === "See if the key works"){//In the basement
	    outgoingMessage = Bot.Message.text("It opened!  It's dark down there.  These moans are getting louder...I think I see a cell down there")
	    outgoingMessage.addResponseKeyboard(["Go down there. Maybe someone needs help", "F this.  Leave now!"], false, message.from)

	  }else if(message.body === "Go down there. Maybe someone needs help" || message.body === "F this.  Leave now!"){//basement
	    outgoingMessage = Bot.Message.text("I've gone too far.  I need to check this out ")
	    outgoingMessage.addResponseKeyboard(["What's going on?"], false, message.from)

	  }else if(message.body === "What's going on?"){//Basement Zombie kids
	    outgoingMessage = Bot.Message.text("There's a bunch of kids!  Pale disgusting things.  Blood is coming out of their eyes and they're trying to grab me!!!")
	    outgoingMessage.addResponseKeyboard(["See if you can free them?", "Leave this sick place!"], false, message.from)

	  }else if(message.body === "See if you can free them?"){//Basement Zombie kids
	    outgoingMessage = Bot.Message.text("I tried but there is man with a shotgun walking down the stairs.  I'm hiding need to stay quiet...")
	    outgoingMessage.addResponseKeyboard(["What's happening??"], false, message.from)

	  }else if(message.body === "What's happening??"){//Basement Zombie kids
	    outgoingMessage = Bot.Message.text("The kids busted out!  They're eating the man with the shotgun.  I can make it got the door! ")
	    outgoingMessage.addResponseKeyboard(["Go!"], false, message.from)

	  }else if(message.body === "Go!"){//Basement Zombie kids
	    outgoingMessage = Bot.Message.text("I'm outside....on my way back home.  You saved my life.  Couldn't have dont it without you.  Stay safe tonight.")
	    outgoingMessage.addResponseKeyboard(["Play Again"], false, message.from)


	//Death Route
	  }else if(message.body === "Leave this sick place!"){//Basement Zombie kids
	    outgoingMessage = Bot.Message.text("There's a man with shotgun blocking the basement door!")
	    outgoingMessage.addResponseKeyboard(["Fight him!", "Hide!"], false, message.from)

	  }else if(message.body === "Go talk to the woman" || message.body === "Fight him!" || message.body === "Hide!"  ){//Talk to Woman Death

	    outgoingMessage = Bot.Message.text("Error 499383 Phone is disconnected")
	    outgoingMessage.addResponseKeyboard(["Sammy has died"], false, message.from)
			user.state = "creepy house"






	////================================================================================================
}else if(message.body === "Too busy.  Sorry." || message.body === "No F-ing way"){//Leave Message
			user.state === "default"
			outgoingMessage = Bot.Message.text("Cool.  TTYL")
	    outgoingMessage.addResponseKeyboard(["BRB"], false, message.from)}

	  else{ //for first message
			user.state = "default"
	    // outgoingMessage = Bot.Message.text("he")
	    // outgoingMessage.addResponseKeyboard(["What's up?"], false, message.from)
	  }



	  bot.send(outgoingMessage, message.from)




	})

  //See this: https://github.com/kikinteractive/kik-node#Message+addResponseKeyboard
  //addResponseKeyboard takes 3 arguments: the Suggestions(buttons as an array), to keep keybaord hiddeen (boolean), to what user
  //Note: Message.from goes to the user that got the message

  //bot.send(outgoingMessage, message.from)


  //   // var suggestions = [{"type":"text","body":"Game over"}, {"type":"text","body":"Play Again"}];
  //   // var keyboards = new Message();
  //   // keyboards.addResponseKeyboard(suggestions);  //buttons we see
  //   // keyboards.setBody("Thanks for playing")  //message from bot
  //
  // } else if(message.body === "How are you?") {
  //   message.reply("Pretty good. Just watched some Small Wonder on Cable?");
  // } else {
  //   message.reply("Go Away. You are very boring.");
  // }
});




let server = http
    .createServer(bot.incoming())
    .listen(process.env.PORT || 8080);
