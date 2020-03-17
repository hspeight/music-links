 var data = {
   "clip": {
     "id": "YTID",
     "title": "BLACK OR WHITE",
     "artist": "MICHAEL JACKSON",
     "peakpos": "1",
     "woc": "6",
     "qanda": [{
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
 };

 var HashArray = require('hasharray'),
ha = new HashArray('id');

ha.add({id: 'someId0', name: 'Josh'},
       {id: 'someId1', name: 'Joseph'},
       {id: 'someId2', name: 'Kuba'},
       {id: 'someId3', name: 'Ty'});

console.log(ha.get('someId0').name); // 'Kuba'
