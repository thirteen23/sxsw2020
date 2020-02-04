
// dependencies
const Alexa = require('ask-sdk-core');

//const people = require('./people.json')
//const fortunes = require('./fortunes.json')

const GetFortuneHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFortuneIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    return handlerInput.responseBuilder
      .speak('Who do you want a fortune for?')
      .reprompt()
      .getResponse();
  },
};

const GetFortuneForIntent = {
  canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
    return(request.type === 'IntentRequest'
        && request.intent.name === 'GetFortuneForIntent');
  },
  handle(handlerInput) {

    const { attributesManager } = handlerInput;
    const name = Alexa.getSlotValue(handlerInput.requestEnvelope, 'name');
    const person = findPerson(name)
    const fortune = getFortuneFor(name, person)
    
    return handlerInput.responseBuilder
       .speak('Getting a fortune for ' + name + '...<break time="500ms"/> <amazon:emotion name="excited" intensity="high"> ' 
       + fortune + '</amazon:emotion> <break time="1000ms"/>' + 'Do you want another fortune?')
    .reprompt()
       .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak("meow")
      .reprompt("meow")
      .getResponse();
  },
};

const FallbackHandler = {
  // The FallbackIntent can only be sent in those locales which support it,
  // so this handler will always be skipped in locales where it is not supported.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak('fallback')
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak("stopping")
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    GetFortuneHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler,
    GetFortuneForIntent,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
 
/*
 function findPerson(name) {
     for(const index in people) {
        const person = people[index]

         for (const nameIndex in person["name_variants"]) {
             const localName = person["name_variants"][nameIndex]
             
             if (localName.toLowerCase() === name.toLowerCase()) {
                 return person
             }
         }
     }
     
    //Return the default person if we fail to match a user
    return people[0];
 }
  
 function getFortuneFor(name, person) {
    let fortune = getFromArray(fortunes)
    
    const nameToUse = person['display_name'] !== null ? person['display_name'] : name;
     
    fortune = fortune.replace(/__name__/g, nameToUse);
    fortune = fortune.replace(/__activity__/g, getFromArray(person['activity']));
    fortune = fortune.replace(/__food__/g, getFromArray(person['food']));
    fortune = fortune.replace(/__restaurant__/g, getFromArray(person['restaurant']));
    fortune = fortune.replace(/__place__/g, getFromArray(person['place'].concat(person['restaurant'])));
    fortune = fortune.replace(/__friend__/g, getFromArray(person['friend']));

     return fortune
 }
 
 function getFromArray(array) {
     return array[Math.floor(Math.random() * array.length)]
 }
 */
