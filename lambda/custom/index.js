const Alexa = require('ask-sdk-core');

// This is required for bespoken proxy to work
var AWS = require('aws-sdk');
AWS.config.update({
    region: "us-east-1"
});
const constants = require('./constants');
const matches = require('./matches.json');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const httpGet = require('./get_http.js');
const get_http_url = 'https://srugiyyr10.execute-api.us-east-1.amazonaws.com/staging/fact';
const languageStrings = constants.languageStrings;

var speechOutput = '';
var repromptOutput = '';

/* ============================================ START INTENT HANDLERS ============================================ */
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        console.log('Inside LaunchRequestHandler');
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        console.log('Handling LaunchRequest');
        //console.log(matches);
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        // test code
        // end test code
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('hello'))
            //.speak(requestAttributes.t('WHICH_CATEGORY'))
            .reprompt(requestAttributes.t('WHICH_CATEGORY'))
            .getResponse();
    },
};

const pickedCategoryHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        console.log('Inside PickCategoryIntent');
        return request.type === 'IntentRequest' &&
            request.intent.name === 'PickCategoryIntent';
    },
    handle(handlerInput) {
        console.log('Handling PickCategoryIntent');
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        return playClip(handlerInput);


    },
};

const FallbackHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        console.log('Handling FallbackHandler');
        //const attributes = handlerInput.attributesManager.getSessionAttributes();
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        speechOutput = requestAttributes.t('NON_COMPRENDE') + requestAttributes.t('WHICH_CATEGORY');

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(repromptOutput)
            .getResponse();
    },

};

const ExitHandler = {
    canHandle(handlerInput) {
        console.log('Inside ExitHandler');
        const request = handlerInput.requestEnvelope.request;

        //return request.type === 'IntentRequest' && (
        //    request.intent.name === 'AMAZON.StopIntent' ||
        //    request.intent.name === 'AMAZON.PauseIntent' ||
        //    request.intent.name === 'AMAZON.CancelIntent'
        //);
        return request.type === 'SessionEndedRequest';
    },
    async handle(handlerInput) {
        console.log('Handling Exit');

        //const attributes = handlerInput.attributesManager.getSessionAttributes();

        return exitSkill(handlerInput);
        /*
            return handlerInput.responseBuilder
                .speak('bye')
                //.reprompt(repromptOutput)
                .withShouldEndSession(true)
                .getResponse();
        */
    },
};

function exitSkill(handlerInput) {
    const response = handlerInput.responseBuilder;
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    speechOutput = '<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_outro_01"/>' + '<break time="1s"/>' +
        requestAttributes.t('BYE_YALL');
    //response.withShouldEndSession(true);
    /*
        if (supportsAPL(handlerInput)) {
            data.bodyTemplate7Data.video.type = 'outro';
            data.bodyTemplate7Data.text.packName = 'Goodbye';
            return handlerInput.responseBuilder
                .speak(speechOutput)
                .reprompt(repromptOutput)
                .withShouldEndSession(true)
                .addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    version: '1.1',
                    document: tempUnknownProduct, // ** ATTENTION ** //
                    datasources: data
                })
                .getResponse();
        } else {
            return handlerInput.responseBuilder
                .speak(speechOutput)
                .reprompt(repromptOutput)
                .withShouldEndSession(true)
                .getResponse();
        }
    */

    return handlerInput.responseBuilder
        .speak(speechOutput)
        //    .reprompt(repromptOutput)
        .withShouldEndSession(true)
        .getResponse();

}
/* ============================================ END INTENT HANDLERS ============================================ */

/* ============================================== START FUNCTIONS ============================================== */

async function playClip(handlerInput) {

    //const attributes = handlerInput.attributesManager.getSessionAttributes();
    //const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    //const randomClip = await httpGet(get_http_url);

    let category = handlerInput.requestEnvelope.request.intent.slots.CATEGORY.value;
    let randomClip = await getClipId(category);
    //console.log(randomClip);

    //speechOutput = '<audio src="https://hs-music-links.s3.eu-west-2.amazonaws.com/-3J8tKLIToE.mp3"/>';
    speechOutput = '<audio src="https://hs-music-links.s3.eu-west-2.amazonaws.com/' + randomClip + '.mp3"/>';

    return handlerInput.responseBuilder
        .speak(speechOutput)
        .reprompt('do you know the answer?')
        .getResponse();

}

function setupLevel(handlerInput) {

    //const attributes = handlerInput.attributesManager.getSessionAttributes();
    //const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    /*
        speechOutput = '<audio src="https://hs-music-links.s3.eu-west-2.amazonaws.com/VMTLDKbmlEs.mp3"/>';
        repromptOutput = 'Repeat, setup';
        return handlerInput.responseBuilder
                .speak(speechOutput)
                .reprompt(repromptOutput)
                .getResponse();
    */
}

async function getClipId(category) {
    // Use the categpry to get a relevant clip

    //let randomClip = await httpGet(get_http_url);
    let randomClip = httpGet(get_http_url);

    return randomClip;
}

/* ============================================== END FUNCTIONS ============================================== */

/* ============================================ START INTERCEPTORS ============================================ */
const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en', // fallback to EN if locale doesn't exist
            resources: languageStrings
        });

        localizationClient.localize = function () {
            const args = arguments;
            let values = [];

            for (var i = 1; i < args.length; i++) {
                values.push(args[i]);
            }
            const value = i18n.t(args[0], {
                returnObjects: true,
                postProcess: 'sprintf',
                sprintf: values
            });

            if (Array.isArray(value)) {
                return value[Math.floor(Math.random() * value.length)];
            } else {
                return value;
            }
        }

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) { // pass on arguments to the localizationClient
            return localizationClient.localize(...args);
        };
    },
};
/* ============================================ END INTERCEPTORS ============================================ */

var skillBuilder = Alexa.SkillBuilders.custom();

/* LAMBDA SETUP */
exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        pickedCategoryHandler,
        FallbackHandler,

        //        BuyPackIntentHandler,
        //        IWantToPlayHandler,
        //        YesIntentHandler,
        //        NoIntentHandler,
        //        PurchaseHistoryHandler,
        //        WhatCanIBuyHandler,
        //        BuyAndUpsellResponseHandler,
        //        TellMeMoreAboutPackIntentHandler,
        //        RefundPackIntentHandler,
        //        AnswerHandler,
        //        HelpHandler,
        ExitHandler,
        //        OtherIntentHandlers,
        //        SessionEndedRequestHandler
    )
    //    .withPersistenceAdapter(persistenceAdapter) // <-- dynamodb
    //    .addRequestInterceptors(PersistenceRequestInterceptor)
    //    .addResponseInterceptors(PersistenceResponseInterceptor)
    .addRequestInterceptors(LocalizationInterceptor)
    //    .addRequestInterceptors(loadISPDataInterceptor)
    //.addRequestInterceptors(LogRequestInterceptor)
    //.addResponseInterceptors(LogResponseInterceptor)
    //    .addErrorHandlers(ErrorHandler)
    //    .withApiClient(new Alexa.DefaultApiClient()) // required for getMonetizationServiceClient
    .lambda();