const numPlayers = 3;
const numRounds = 5;
const deck = [
    1,2,3,4,5,6,7,8,9,10,10,10,10,
    1,2,3,4,5,6,7,8,9,10,10,10,10,
    1,2,3,4,5,6,7,8,9,10,10,10,10,
    1,2,3,4,5,6,7,8,9,10,10,10,10
];

var roundsPlayed = 0;

while(roundsPlayed < numRounds){
    var roundNum = roundsPlayed + 1;
    console.log('------------ ROUND ' + roundNum);
    displayResults(play(deal(shuffle(deck), getPlayers(numPlayers))));
    roundsPlayed++;
}

function displayResults(players){
    arguments = clargs(arguments);
    players.map(function(player, index){
        var score = player.points;
        console.log(player.type + ' ' + index, '  ---------   Score: ' + player.points)
    });
}

function play(game){
    arguments = clargs(arguments);
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
    arguments = clargs(arguments);
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

function getPlayers(numPlayers){
    var players = [{type:'dealer',points:0,acesToUse:0}];
    var i = 0;
    while(i < numPlayers){
        players.push({type:'player',points:0,acesToUse:0});
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
        player.points += deck.pop();
        player = aces(player);
    }   
    return [deck, player];
}

function aces(player){
    arguments = clargs(arguments);
    if(player.points > 21){
        if(player.acesToUse > 0){
            player.points -= 10;
            player.acesToUse--;
        }
    }
    return player;
}

function shouldHit(players, player){
    arguments = clargs(arguments);
    if(player.type === 'dealer'){
        return player.points < 17 ? true : false;
    }
    // for now.. 
    return player.points < 17 ? true : false;
}

function clargs(args){
    for(var i = 0; i < args.length; i++){
        args[i] = clone(args[i]);
    }
    return args
}

function clone(obj){
    return JSON.parse(JSON.stringify(obj));
}
