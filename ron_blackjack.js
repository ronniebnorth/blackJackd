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

function results(iplayers){
    var players = clone(iplayers);
    players.map(function(player, index){
        var score = player.points;
        console.log(player.type + ' ' + index, '  ---------   Score: ' + player.points)
    });
}

function play(igame){
    var game = clone(igame);
    var deck = game[0];
    var players = game[1];
    var newPlayers = [];
    players.map(function(player){
        var hitResults = hit(deck, players, player); 
        deck = hitResults[0];
        var newPlayer = hitResults[1];
        newPlayers.push(newPlayer);
    });
    return newPlayers;
}

function deal(ideck, iplayers){
    var deck = clone(ideck);
    var players = clone(iplayers);
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

function shuffle(iarray) {
    var array = clone(iarray);
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

function hit(ideck, iplayers, iplayer){
    var deck = clone(ideck);
    var players = clone(iplayers);
    var player = clone(iplayer);
    while(player.points < 21 && shouldHit(players, player)){
        player.points += deck.pop();
        player = aces(player);
    }   
    return [deck, player];
}

function aces(iplayer){
    var player = clone(iplayer);
    if(player.points > 21){
        if(player.acesToUse > 0){
            player.points -= 10;
            player.acesToUse--;
        }
    }
    return player;
}

function shouldHit(iplayers, iplayer){
    var players = clone(iplayers);
    var player = clone(iplayer);
    if(player.type === 'dealer'){
        return player.points < 17 ? true : false;
    }
    // todo: add basic strategy 
    return player.points < 17 ? true : false;
}


function clone(arr){
    return JSON.parse(JSON.stringify(arr));
}
