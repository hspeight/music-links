
var merge = require('merge'), original, cloned;

data = {
    "clip": {
        "id": "YTID",
        "title": "BLACK OR WHITE",
        "artist": "MICHAEL JACKSON",
        "peakpos": "1",
        "woc": "6",
        "qanda": [
            {
                "source": "title",
                "answer": "WHITE",
                "category": "colors",
                "difficulty": "88"
            },
            {
                "source": "title",
                "answer": "BLACK",
                "category": "colors",
                "difficulty": "88"
            }
        ]
    }
}

console.log(merge({source:'title'}, {answer: 'WHITE:BLACK'},  {category: 'colors'}));

/*
var obj1 = data.clip.qanda[0];
var obj2 = data.clip.qanda[1];
//console.log(obj2);

//console.log(merge(obj1, obj2));

var result = merge(obj1, obj2);

console.log(result);
*/
