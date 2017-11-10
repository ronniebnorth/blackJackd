// blackJackd by Ronnie North 2017
// test blackjack strategies 

// Adjust numPlayers and numRounds, then 'node blackJackd.js' to run

const numPlayers = 1;
const numRounds = 100000000;


const deck = [
    11,2,3,4,5,6,7,8,9,10,10,10,10,
    11,2,3,4,5,6,7,8,9,10,10,10,10,
    11,2,3,4,5,6,7,8,9,10,10,10,10,
    11,2,3,4,5,6,7,8,9,10,10,10,10
];

// STRATEGY GRIDS (strategizer chooses from hard, soft, or pairs grid depending on player hand total and dealer upcard)
// rows = player total (1-20) 
// cols = dealer upcard (1-10 with 1 being the Ace card)
// 0 = hit 
// 3 = double down
// 1 = stand
// 2 = split
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

//----------------------------START MAIN-------------------------//

var roundsPlayed = 0;
var losses = 0;
var wins = 0;
var ties = 0;

console.time('testGameLoop');

while(roundsPlayed < numRounds){
    var roundNum = roundsPlayed + 1;  
    var ndeck = clone(deck);

    processResults(play(deal(shuffle(ndeck), getPlayers(numPlayers))));

    roundsPlayed++;
}
console.log('WINS -----', wins);
console.log('LOSS -----', losses);
console.log('TIES -----', ties);

console.timeEnd('testGameLoop');


function processResults(players){
    var dealerScore = players[0].points;
    players.map(function(player, index){
        var score = player.points;
        if(player.type != 'dealer'){
            if(score > dealerScore){ wins++; }
            if(score < dealerScore || score == 0){ losses++; }
            if(score == dealerScore && score != 0){ ties++; }
        }
    });
}

//-------------------------END MAIN-------------------------//


function play(game){
    var deck = game[0];
    var players = game[1];
    var newPlayers = players.map(function(player, ind, plyrs){
        var hitResults = hit(deck, players, player); 
        deck = hitResults[0];
        var newPlayer = hitResults[1];
        return newPlayer;
    });
    return newPlayers;
}


function deal(deck, players){
    var i = 0;
    while(i < 2){
        players = players.map(function(player, ind, plyrs){ 
            var card = deck.pop();
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
    // todo: if player has blackjack 
    while(player.points < 21 && shouldHit(players, player)){
        var card = deck.pop();
        player.points += card;
        if(card == 11){ player.acesToUse++; }
        player = playAces(player);
    }   
    if(player.points > 21){
        player.points = 0;
    }
    return [deck, player];
}


function shouldHit(players, player){
    if(player.type === 'dealer'){
        return player.points < 17 ? true : false;
    }
    return strategize(player, players[0].upcard);
}


function strategize(player, upcard){
    var stratCode = 0;
    if(upcard == 11){ upcard = 1; }
    if(player.acesToUse > 0){
        stratCode = softStrat[player.points-1][upcard-1];
    }else{
        stratCode = hardStrat[player.points-1][upcard-1];
    }
    if(stratCode == 0 || stratCode == 3){
        return true;
    }else{
        return false;
    }
}


function playAces(player){
    if(player.points > 21){
        if(player.acesToUse > 0){
            player.points -= 10;
            player.acesToUse--;
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


