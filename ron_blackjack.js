const numPlayers = 5;
const numRounds = 100;
const deck = [
    11,2,3,4,5,6,7,8,9,10,10,10,10,
    11,2,3,4,5,6,7,8,9,10,10,10,10,
    11,2,3,4,5,6,7,8,9,10,10,10,10,
    11,2,3,4,5,6,7,8,9,10,10,10,10
];

// rows = total, cols = upcard
const hardStrat = [
    [9,9,9,9,9,9,9,9,9,9],
    [9,9,9,9,9,9,9,9,9,9],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,3,3,3,3,0,0,0,0],
    [0,3,3,3,3,3,3,3,3,0],
    [0,3,3,3,3,3,3,3,3,3],
    [0,0,0,1,1,1,0,0,0,0],
    [0,1,1,1,1,1,0,0,0,0],
    [0,1,1,1,1,1,0,0,0,0],
    [0,1,1,1,1,1,0,0,0,0],
    [0,1,1,1,1,1,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1]    
];

const softStrat = [
    [9,9,9,9,9,9,9,9,9,9],
    [9,9,9,9,9,9,9,9,9,9],
    [0,0,0,0,3,3,0,0,0,0],
    [0,0,0,0,3,3,0,0,0,0],
    [0,0,0,3,3,3,0,0,0,0],
    [0,0,0,3,3,3,0,0,0,0],
    [0,0,3,3,3,3,0,0,0,0],
    [0,1,3,3,3,3,1,1,0,0],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1],
    [9,9,9,9,9,9,9,9,9,9],
    [9,9,9,9,9,9,9,9,9,9],
    [9,9,9,9,9,9,9,9,9,9],
    [9,9,9,9,9,9,9,9,9,9],
    [9,9,9,9,9,9,9,9,9,9],
    [9,9,9,9,9,9,9,9,9,9],
    [9,9,9,9,9,9,9,9,9,9],
    [9,9,9,9,9,9,9,9,9,9],
    [9,9,9,9,9,9,9,9,9,9],
    [0,0,0,0,0,0,0,0,0,0]
];

const pairStrat = [
    [9,9,9,9,9,9,9,9,9,9],
    [2,2,2,2,2,2,2,2,2,2],
    [9,9,9,9,9,9,9,9,9,9],
    [0,2,2,2,2,2,2,0,0,0],
    [9,9,9,9,9,9,9,9,9,9],
    [0,2,2,2,2,2,2,0,0,0],
    [9,9,9,9,9,9,9,9,9,9],
    [0,0,0,0,2,2,2,0,0,0],
    [9,9,9,9,9,9,9,9,9,9],
    [0,3,3,3,3,3,3,3,3,0],
    [9,9,9,9,9,9,9,9,9,9],
    [0,2,2,2,2,2,0,0,0,0],
    [9,9,9,9,9,9,9,9,9,9],
    [0,2,2,2,2,2,2,0,0,0],
    [9,9,9,9,9,9,9,9,9,9],
    [2,2,2,2,2,2,2,2,2,2],
    [9,9,9,9,9,9,9,9,9,9],
    [1,2,2,2,2,2,1,2,2,1],
    [9,9,9,9,9,9,9,9,9,9],
    [1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1]
];

var roundsPlayed = 0;
var losses = 0;
var wins = 0;
var ties = 0;


while(roundsPlayed < numRounds){
    var roundNum = roundsPlayed + 1;
    console.log('------------ ROUND ' + roundNum);    
    processResults(play(deal(shuffle(deck), getPlayers(numPlayers))));
    roundsPlayed++;
}
console.log('wins', wins);
console.log('losses', losses);
console.log('ties', ties);


function processResults(players){
    arguments = clargs(arguments);
    var dealers = players.filter(function(plyr){
        return plyr.type == 'dealer';
    });
    var dealerScore = dealers[0].points;
    players.map(function(player, index){
        var score = player.points;
        if(player.type != 'dealer'){
            if(score > dealerScore){ wins++; }
            if(score < dealerScore){ losses++; }
            if(score == dealerScore){ ties++; }
        }
        console.log(player.type + ' ' + index, '  ---------   Score: ' + player.points);
    });
}


function play(game){
    arguments = clargs(arguments);
    var deck = game[0];
    var players = game[1];
    var newPlayers = players.map(function(player){
        console.log('playing ', player);
        var hitResults = hit(deck, players, player); 
        deck = hitResults[0];
        var newPlayer = hitResults[1];
        return newPlayer;
    });
    return newPlayers;
}


function deal(deck, players){
    arguments = clargs(arguments);
    var i = 0;
    while(i < 2){
        players = players.map(function(player, ind, plyrs){ 
            var card = deck.pop();
            console.log('player ' + ind + ' dealt card ', card);
            var nPlayer = {
                type:player.type, 
                points:player.points + card, 
                acesToUse:player.acesToUse
            };
            if(i == 1 && nPlayer.type == 'dealer'){
                nPlayer.upcard = card;
            }
			if(card === 11){ nPlayer.acesToUse++; }
            return nPlayer;
        });
        i++;
    }
    return [deck, players];
}


function getPlayers(numPlayers){
    var players = [{type:'dealer',points:0,acesToUse:0,upcard:0}];
    var i = 0;
    while(i < numPlayers){
        players.push({type:'player',points:0,acesToUse:0,hasPair:0});
        i++;
    }
    return players;
}


function shuffle(arr) {
    arguments = clargs(arguments);
    var curInd = arr.length, tempVal, randInd;
    while (0 !== curInd) {
        randInd = Math.floor(Math.random() * curInd);
        curInd -= 1;
        tempVal = arr[curInd];
        arr[curInd] = arr[randInd];
        arr[randInd] = tempVal;
    }
    return arr;
}


function hit(deck, players, player){
    arguments = clargs(arguments);
    while(player.points < 21 && shouldHit(players, player)){
        var card = deck.pop();
        player.points += card;
        if(card == 11){ player.acesToUse++; }
        console.log('player hit ', player, card);
        player = playAces(player);
    }   
    if(player.points > 21){
        player.points = 0;
    }
    return [deck, player];
}


function shouldHit(players, player){
    arguments = clargs(arguments);
    if(player.type === 'dealer'){
        return player.points < 17 ? true : false;
    }
    var dealers = players.filter(function(player){
        return player.type == 'dealer';
    })
    return strategize(player, dealers[0].upcard);
}


function strategize(player, upcard){
    arguments = clargs(arguments);
    var stratCode = 0;
    if(player.acesToUse > 0){
        stratCode = softStrat[player.points][upcard];
    }else{
        stratCode = hardStrat[player.points][upcard];
    }
    console.log('strat code', stratCode);
    if(stratCode == 0 || stratCode == 3){
        return true;
    }else{
        return false;
    }
}


function playAces(player){
    arguments = clargs(arguments);
    if(player.points > 21){
        if(player.acesToUse > 0){
            player.points -= 10;
            player.acesToUse--;
            console.log('player used ace ', player);
        }
    }
    return player;
}


function clargs(args){
    for(var i = 0; i < args.length; i++){
        args[i] = clone(args[i]);
    }
    return args;
}


function clone(obj){
    return JSON.parse(JSON.stringify(obj));
}
