'use strict';

let util = require('util');
let http = require('http');
let Bot  = require('@kikinteractive/kik');

// Configure the bot API endpoint, details for your bot
let bot = new Bot({
    username: 'chat_stories',
    apiKey: 'c8f28c78-26af-42de-84ea-f237b1b7e506',
    baseUrl:  'http://1e384853.ngrok.io'
});



bot.updateBotConfiguration();



bot.onTextMessage((message) => {
  //Needed to create variable for the Outgoing Message
  var outgoingMessage

  //See this: https://github.com/kikinteractive/kik-node#Message+addResponseKeyboard
  //addResponseKeyboard takes 3 arguments: the Suggestions(buttons as an array), to keep keybaord hiddeen (boolean), to what user
  //Note: Message.from goes to the user that got the message

  //bot.send(outgoingMessage, message.from)

  if(message.body === "hey" || message.body === "What are you up to?") { //second message
    outgoingMessage = Bot.Message.text("hey i need advice")
    outgoingMessage.addResponseKeyboard(["Sure.  What's up", "Too busy.  Sorry."], false, message.from)
    //message.reply("cool");
    //message.reply("Hey, I need some advice");
  }else if(message.body === "Sure.  What's up"){
    outgoingMessage = Bot.Message.text("There's this creepy house on my street. And the front door is wide open.  Should I go in?")
    outgoingMessage.addResponseKeyboard(["Do it!", "No F-ing way"], false, message.from)

  }else if(message.body === "Do it!"){//inside house
    outgoingMessage = Bot.Message.text("Cool.  I'm inside. Looking around....There's a living room, an upstairs, a kitchen, and a basement.  Where should I go?")
    outgoingMessage.addResponseKeyboard(["go to the living room", "what's up with the basement" ], false, message.from)

  }else if(message.body === "what's up with the basement"){//inside house 2
      outgoingMessage = Bot.Message.text("There's weird noises...like moaning or something. I dont waant to go down there!  It's lockded anyway....needs a key")
      outgoingMessage.addResponseKeyboard(["go to the living room"], false, message.from)

  }else if(message.body === "go to the living room"){//Living Room
    outgoingMessage = Bot.Message.text("Kind of boring.  There a fireplace with a fire burning...And a wallet on the floor.  Some kid's school ID?  Who is this kid?...")
    outgoingMessage.addResponseKeyboard(["Take his wallet!  Easy money.", "Let's got see more of the house"], false, message.from)

  }else if(message.body === "Take his wallet!  Easy money." || message.body === "Let's got see more of the house"){//Living Room
    outgoingMessage = Bot.Message.text("Cool.  I'm in the kitchen.  There kitchen knife.  A big one!  I dont feel safe.  Like someone is f%cking watching me... ")
    outgoingMessage.addResponseKeyboard(["Take the knife!", "What's around?"], false, message.from)

  }else if(message.body === "Take the knife!" || message.body === "What's around?"){//Living Room
    outgoingMessage = Bot.Message.text("There are these huge doberman's in the backyard.  They're chained up...eating some fleshy thing.  A bone or something ")
    outgoingMessage.addResponseKeyboard(["Let's go upstairs", "See if you can go in the backyard"], false, message.from)


  }else if(message.body === "Too busy.  Sorry." || message.body === "No F-ing way"){//Leave Message
    outgoingMessage = Bot.Message.text("Cool.  TTYL")
    outgoingMessage.addResponseKeyboard(["BRB"], false, message.from)}

  else{ //for first message
    outgoingMessage = Bot.Message.text("hey")
    outgoingMessage.addResponseKeyboard(["hey", "What are you up to?"], false, message.from)
  }



  bot.send(outgoingMessage, message.from)

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
