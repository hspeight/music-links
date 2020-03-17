// States that the game can be in at any particular time //
const states = {
    //START: '_START',
    RESTART: '_RESTART',
    QUIZ: '_QUIZ',
    END: '_END',
    REPLAYLEVEL: '_REPLAYLEVEL',
    REPLAYDRILL: '_REPLAYDRILL',
    ENDOFLEVEL: '_ENDOFLEVEL',
    ENDOFDRILLWITHUPSELL: '_ENDOFDRILLWITHUPSELL',
    ENDOFDRILLWITHREPLAY: '_ENDOFDRILLWITHREPLAY',
    EXITSKILL: '_EXITSKILL',
    STARTLEVEL: '_STARTLEVEL',
    NEWSESSION: '_NEWSESSION',
    PACKCOMPLETE: '_PACKDONE',
    REFUNDED: '_REFUNDED',
    AWAITINGANSWER: '_AWAITINGANSWER',
};



const languageStrings = {
    'en': require('./i18n/en'),
    'it' : require('./i18n/it')
}

const questionTempltes = {
    // Note: Do not change the order of the interval questions. They must be this way round to work peoperly.
    intervalQuestions: {
        fourth: ['What is placeholder the fourth of', 'What is the fourth of placeholder'], // convert to requestattribue?
        fifth: ['What is the fifth of placeholder', 'What is placeholder the fifth of']
    },
    relativeKeyQuestions: {
        minor: [
            'What is the relative major key of [key]',
            'What is the relative major of [key]',
            'What is the relative major to [key]',
            'What is [key] the relative minor of',
            'Which major key has the relative minor key of [key]',
            '[key] is relative to which major key'
        ], // convert to requestattribue?
        major: [
            'What is the relative minor key of [key]',
            'What is the relative minor to [key]',
            'What is [key] the relative major of',
        ],
        //random: [
        // What is the relative key of F minor?
        // what is the relative key of B major?
        //],
        //trueFalse: [
        // the rlelative major if C minor is F major?
        // the relative minor of D major is A flat minor?
        //]
    },
    keySignatureQuestions: ['Which [quality] key has [number] [sign]', 'How many [sign] does [key] have']
    //minor: ['Which minor key has [number] [sign]?', 'How many [sign] does [key] have?']

}

module.exports = {
    states: states,
    languageStrings: languageStrings,
    questionTempltes: questionTempltes,
}