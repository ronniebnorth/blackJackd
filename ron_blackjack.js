const numPlayers = 3;
const numRounds = 100;
const deck = [
    1,2,3,4,5,6,7,8,9,10,10,10,10,
    1,2,3,4,5,6,7,8,9,10,10,10,10,
    1,2,3,4,5,6,7,8,9,10,10,10,10,
    1,2,3,4,5,6,7,8,9,10,10,10,10
];

var roundsPlayed = 0;

while(roundsPlayed < numRounds){
    var thisRound = roundsPlayed + 1;
    console.log('------------ ROUND ' + thisRound);
    results(play(deal(shuffle(deck), players(numPlayers))));
    roundsPlayed++;
}

function results(players){
    arguments = cargs(arguments);
    players.map(function(player, index){
        var score = player.points;
        console.log(player.type + ' ' + index, '  ---------   Score: ' + player.points)
    });
}

function play(game){
    arguments = cargs(arguments);
    var deck = game[0];
    var players = game[1];
    var newPlayers = players.map(function(player){
        var hitResults = hit(deck, players, player); 
        deck = hitResults[0];
        var newPlayer = hitResults[1];
        return newPlayer;
    });
    return newPlayers;
}

function deal(deck, players){
    arguments = cargs(arguments);
    var i = 0;
    while(i < 2){
        players = players.map(function(player){ 
            var card = deck.pop();
            var nPlayer = {
                type:player.type, 
                points:player.points + card, 
                acesToUse:player.acesToUse
            };
			if(card === 1){ nPlayer.acesToUse++; }
            return nPlayer;
        });
        i++;
    }
    return [deck, players];
}

function players(numPlayers){
    var p = [{type:'dealer',points:0,acesToUse:0}];
    var i = 0;
    while(i < numPlayers){
        p.push({type:'player',points:0,acesToUse:0});
        i++;
    }
    return p;
}

function shuffle(array) {
    arguments = cargs(arguments);
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function hit(deck, players, player){
    arguments = cargs(arguments);
    while(player.points < 21 && shouldHit(players, player)){
        player.points += deck.pop();
        player = aces(player);
    }   
    return [deck, player];
}

function aces(player){
    arguments = cargs(arguments);
    if(player.points > 21){
        if(player.acesToUse > 0){
            player.points -= 10;
            player.acesToUse--;
        }
    }
    return player;
}

function shouldHit(players, player){
    arguments = cargs(arguments);
    if(player.type === 'dealer'){
        return player.points < 17 ? true : false;
    }
    // todo: add basic strategy 
    return player.points < 17 ? true : false;
}

function cargs(args){
    for(var i = 0; i < args.length; i++){
        args[i] = clone(args[i]);
    }
    return args
}

function clone(arr){
    return JSON.parse(JSON.stringify(arr));
}
