const categories = {
    /*
    alphabet: {
        aka: 'Letters of the alphabet',
        premium: true,
        values: 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,' +
            'bee,see,sea,dee,gee,eye,jay,pea,queue,tee,tea,you,why,'
    },
    */
    capital_cities: {
        aka: 'Capital cities',
        premium: true,
        values: 'london,paris,rome,Bangkok,washington,' +
            '',
        homophone: 'roam:rome,'
    },
    numbers: {
        aka: 'Numbers',
        premium: false,
        values: 'one,two,three,four,five,six,seven,eight,10000,' +
        'for,fore,ate,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,40,45,50,60,' +
        'too,2525,',
        homophone: '2525:twenty five,too:two,for:four,'
        /*
        values: 'one,two,three,four,five,six,seven,eight,nine,ten,eleven,twelve,thirteen,fourteen,fifteen,sixteen,' +
        'seventeen,eighteen,nineteen,twenty,twenty one,twenty four,thirty,forty,fifty,sixty,sixty four,sixty six,' +
        'sixty nine,seventy,eighty,ninety,one hunderd,hundred,thousand,million,billion,' +
        'too,for,fore,ate,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,40,50,60,' +
        '10000,'
        */
    },
    colors: {
        aka: 'Colors',
        premium: false,
        values: 'pink,yellow,green,white,black,red,blue,orange,indigo,violet,maroon,brown,',
        homophone: 'browne:brown,'        /*
        White,Yellow,Blue,Red,Green,Black,Brown,browne,Azure,Ivory,Teal,Silver,Purple,Navy,Gray,Orange,Maroon,Charcoal,Aquamarine,Coral,Fuchsia,Wheat,Lime,Crimson,Khaki,pink,Magenta,Olden,Plum,Olive,Cyan,amber,apricot,coffee,violet,bronze,ruby,grey,Beige,burgundy,
Cerise,copper,cream,khaki,salmon,turquoise,saffron,taupe,ebony,ivory,indego,emerald,lavendar,erin,fallow,fawn,flax,fuchsia,lilac,mauve,raspberry,rose,
gold,Heliotrope,Honeydew,lemon,periwinkle,mint,maize,mango,mandarin,chanpagne,melon,mulberry,mustard,
        */
    },
    countries: {
        aka: 'Countries of the world',
        premium: true,
        values: 'america,'
    },
    animals: {
        aka: 'Animal Kingdom',
        premium: false,
        values: 'buffalo,squirrel,otter,elephant,spider,dog,' +
        'dough,',
        /*
        values: 'doe,buffalo,squirrel,otter,elephant,lion,lynx,links,polecat,porcupine,bull,snake,cat,skunk,' +
        'dog,lizard,wallaby,alligator,alpaca,opossum,badger,beaver,sheep,bison,bear,buffalo,ant,anteater,antelope,' +
        'sable,rat,fox,hare,hair,lemming,armadillo,bat,tortoise,ass,seal,baboon,whale,mongoose,bandicoot,deer,gecko,' +
        'wallaby,bettong,oryx,rhinoceros,spider,monkey,capuchin,kangaroo,ferret,oystercatcher,wildebeest,boar,bore,' +
        'bobcat,macaque,tapir,dolphin,gnu,hyena,lemur,bettong,butterfly,scorpion' +
        'dough'
        */
       homophone: 'dough:doe'
    },
    elements: {
        aka: 'Elements',
        premium: true,
        values: 'hydrogen,helium,lithium,beryllium,boron,carbon,nitrogen,oxygen,fluorine,neon,sodium,magnesium,' +
        'aluminum,silicon,phosphorus,sulfur,chlorine,argon,potassium,calcium,scandium,titanium,vanadium,chromium,' +
        'manganese,iron,cobalt,nickel,copper,zinc,gallium,germanium,arsenic,selenium,bromine,krypton,rubidium,' +
        'strontium,yttrium,zirconium,niobium,molybdenum,technetium,ruthenium,rhodium,palladium,silver,cadmium,indium,' +
        'tin,antimony,tellurium,iodine,xenon,cesium,barium,lanthanum,cerium,praseodymium,neodymium,promethium,samarium,' +
        'europium,gadolinium,terbium,dysprosium,holmium,erbium,thulium,ytterbium,lutetium,hafnium,tantalum,tungsten,' +
        'rhenium,osmium,iridium,platinum,gold,mercury,thallium,lead,,bismuth,polonium,astatine,radon,francium,radium,' +
        'actinium,thorium,protactinium,uranium,neptunium,plutonium,americium,curium,berkelium,californium,einsteinium,' +
        'fermium,mendelevium,nobelium,lawrencium,rutherfordium,dubnium,seaborgium,bohrium,hassium,meitnerium,darmstadtium,' +
        'roentgenium,copernicium,nihonium,flerovium,moscovium,livermorium,tennessine,oganesson,' +
        'led,'
    },
    furniture: {
        aka: 'Types of furniture',
        premium: true,
        values: 'table,chair,desk,bureau,settee,stool,bench,seat,' +
        ''
    },
    astronomy: {
        aka: 'Solar system etc.',
        premium: true,
        values: 'moon,world,'
    },
    insects: {
        aka: 'Insects',
        premium: true,
        values: 'ant,bee,beatle,cricket,dragonfly,earwig,flea,grasshopper,lice,moth,termite,wasp,' +
        'be,',
        homophone: 'be:bee'
    },
    transport: {
        aka: 'Transport and travel',
        premium: true,
        values: 'boat,ship,train,plane,car,bus,lorry,truck,van,bike,bicycle,liner,tandem,scooter,motorcycle,Ferry,taxi,' +
        'flying,' +
        'plain,'
    },
    weapons: {
        aka: 'Something that could be used as a weapon',
        premium: true,
        values: 'club,knife,hammer,gun,rifle,shotgun,pistol,catapult,firearm,handgun,sabre,' +
        ''
    },
    
    states: {
        aka: 'US States',
        premium: true,
        values: 'New York,california,'
        /*
        values: 'Alabama,Alaska,American Samoa,Arizona,Arkansas,California,Colorado,Connecticut,Delaware,' +
        'District Of Columbia,Federated States Of Micronesia,Florida,Georgia,Guam,Hawaii,Idaho,' +
        'Illinois,Indiana,Iowa,Kansas,Kentucky,Louisiana,Maine,Marshall Islands,Maryland,Massachusetts,Michigan,'+
        'Minnesota,Mississippi,Missouri,Montana,Nebraska,Nevada,New Hampshire,New Jersey,New Mexico,New York,' +
        'North Carolina,North Dakota,Northern Mariana Islands,Ohio,Oklahoma,Oregon,Palau,Pennsylvania,Puerto Rico,' +
        'Rhode Island,South Carolina,South Dakota,Tennessee,Texas,Utah,Vermont,Virgin Islands,Virginia,' +
        'Washington,West Virginia,Wisconsin,Wyoming' +
        'main'
        */
    },
    
    clothing: {
        aka: 'Things you can wear',
        premium: true,
        values: 'jeans,coat,shirt,mac,hat,shoes,shoe,vest,scarf,glove,gloves,sock,socks,stockings,tights,pants,' +
        'jumper,sweater,fleece,boots,boot,sandal,sandals,wellington,wellingtons,cap,belt,tie,apron,cardigans,slacks,suit,' +
        'skirt,dress,frock,gown,shorts,trousers,slippers,slipper,bikini,blouse,blazer,boxers,caftan,corset,girdle,' +
        'kilt,kimono,leotard,pyjamas,pajamas,Petticoat,parka,robe,sari,sarong,uniform,toga,tuxedo,yukata,jersey,beret,' +
        'burka,habit,jodhpurs,leggings,shawl,t-shirt,t shirt,' +
        'genes,shoo,'
    },
    drinks: {
        aka: 'Things you can drink',
        premium: true,
        values: 'shake,' +
        ''
    },
    snakes: {
        aka: 'Types of snakes',
        premium: true,
        values: 'python,adder,boa,cobra,rattle,'
    },
    state_capitals: {
        aka: 'US stae capitals',
        premium: true,
        values: 'Montgomery,Juneau,Phoenix,Little Rock,Sacramento,Denver,Hartford,Dover,Tallahassee,Atlanta,Honolulu,Boise,' +
        'Springfield,Indianapolis,Des Moines,Topeka,Frankfort,Baton Rouge,Augusta,Annapolis,Boston,Lansing,Saint Paul,Jackson,' +
        'Jefferson City,Helana,Lincoln,Carson City,Concord,Trenton,Santa Fe,Albany,Raleigh,Bismarck,Columbus,Oklahoma City,' +
        'Salem,Harrisburg,Providence,Columbia,Pierre,Nashville,Austin,Salt Lake City,Montpelier,Richmond,Olympia,Charleston,' +
        'Madison,Cheyenne,' +
        'boys,jaxon,rally,',
        homophone: 'boys:Boise,jaxon:Jackson,rally:Raleigh,'
    },
    tennis: {
        aka: 'Terms used in tennis',
        premium: true,
        values: 'love,net,set,sets,match,ace,court,backhand,forehand,smash,toss,ball,balls,serve,service,break,challenge,lob,slice,' +
        'cord,fault,volley,game,slam,hold,let,point,pass,rally,ranking,racket,racquet,return,rubber,topspin,umpire,spin,approach,' +
        'seed,wide,winner' +
        'caught,raleigh,',
        homophone: 'caught:court,raleigh:rally,'
    },
    months: {
        aka: 'Months of the year',
        premium: true,
        values: 'January,February,March,April,May,June,July,August,September,October,November,December,' +
        'Mae,'
    },
    maths: {
        aka: 'Anything related to maths, trigonometry etc',
        premium: true,
        values: 'power,add,times,multiply,sum,minus,sign,divide,division,square,tangent,algebra,base,calculate,number,' +
        'fraction,decimal,geometry,equation,factor,prime,formula,ratio,logic,' +
        'some,bass',
        homophone: 'some:sum,bass:base,'
    },
    occupations: {
        aka: 'Things people do as jobs',
        premium: true,
        values: 'carpenter,driver,maid,pilot,priest,' +
        'made,'
    },
    music: {
        aka: 'Music genres',
        premium: true,
        values: 'rock,world,reggae,classical,punk,' +
        ''
    },
}

module.exports = {
    categories: categories,
}