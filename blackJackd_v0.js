
// test blackjack strategies
const DEBUG = false;

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
// 1 = stand
// 2 = split
// 3 = double down

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
//sdfsdfsdfsd
//sdfsffsdfsdf
const hardStrat_backup = [
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
    [0,0,0,0,0,3,0,0,0,0],
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


console.time('testGameLoop');
var numPlayers = 5;
var numRounds = 100000000;
var decksToUse = 8;
var res = playRounds(numPlayers,numRounds,decksToUse,deck,hardStrat,softStrat,pairStrat);
console.timeEnd('testGameLoop');
console.log('WINS -----', res[0]);
console.log('LOSS -----', res[1]);
console.log('TIES -----', res[2]);



function playRounds(numPlayers, numRounds, decksToUse, deck, hardStrat, softStrat, pairStrat){
    var tscores = [0,0,0];
    var roundsPlayed = 0;
    while(roundsPlayed < numRounds){
        var roundNum = roundsPlayed + 1;
        var ndeck = makeDeck(deck,decksToUse);
        var rscores = score(play(deal(shuffle(ndeck), createPlayers(numPlayers))));

        tscores = sumArrays(tscores,rscores);
        if(roundsPlayed % 100000 == 0){
            if(!DEBUG){console.log(tscores, (tscores[0]/(tscores[0]+tscores[1])) * 100);}
        }
        roundsPlayed++;
    }
    return tscores;
}


function sumArrays(a1,a2){
    a1 = a1.map(function (num, ind) {
        return num + a2[ind];
    });
    return a1;
}


function makeDeck(deck,decksToUse){
    var ndeck = clone(deck);
    var deckCount = 1;
    while(deckCount < decksToUse){
        ndeck = ndeck.concat(clone(deck));
        deckCount++;
    }
    return ndeck;
}


function score(players){
    var dealerPoints = players[0].points;
    if(DEBUG){ console.log("dealer score", dealerPoints, '\n');}
    var scores = [0,0,0];
    for(var i = 1; i < players.length; i++){
        var player = players[i];
        var points = player.points;
        if(points > dealerPoints || player.blackjack == true){
            scores[0]++;
            if(player.doubledDown){
                scores[0]++;
            }
            if(DEBUG){ console.log("player wins", scores[0], '\n');}
            if(player.blackjack === true){
                scores[0] += .5;

                if(DEBUG){ console.log("Player has blackjack", player, scores[0], '\n');}
            }
        }else if(points < dealerPoints || points == 0){
            scores[1]++;
            if(player.doubledDown){
                scores[1]++;
            }
            if(DEBUG){ console.log("player loses", scores[0], '\n');}
        }else if(points == dealerPoints && points != 0){
            if(DEBUG){ console.log("player draw", scores[0], '\n');}
            scores[2]++;
        }else{
            scores[1]++;
            if(player.doubledDown){
                scores[1]++;
            }
            if(DEBUG){ console.log("player loses", scores[0], '\n');}
        }
    }
    if(DEBUG){ console.log("Scores ", scores, '\n');}
    return scores;
}


function play(game){
    var deck = game[0];
    var players = game[1];
    var dealer = players[0];
    var nPlayers = [];

    if(dealer.points == 21){
        if(DEBUG){ console.log("dealer has blackjack", "\n");}
        nPlayers = players.map(function(player){
            if(player.type == "player"){
                player.points = 0;
                return player;
            }else{
                return player;
            }
        });
        if(DEBUG){ console.log("after dealer blackjack", nPlayers, "\n");}
    }else{
        spDeckPly = doSplits([deck, players]);
        deck = spDeckPly[0];
        nPlayers = spDeckPly[1];
        nPlayers = nPlayers.map(function(player, ind, plyrs){
            if(player.points == 21){
                player.blackjack = true;
                return player;
            }
            if(player.points == 22){
                player.acesToUse--;
                player.points = 12;
            }
            var hitResults = hit(deck, players, player);
            deck = hitResults[0];
            var newPlayer = hitResults[1];
            if(DEBUG){ console.log(newPlayer.type + " results ", newPlayer, "\n");}
            return newPlayer;
        });
    }
    return nPlayers;
}


function doSplits(deckPlayers){
    var deck = deckPlayers[0];
    var players = deckPlayers[1];
    var newPlayers = [];
    players.map(function(player){
        if(player.canSplit){
            if(DEBUG){ console.log("player can SPLIT", player, players, "\n");}
            var stratCode = strategize(player, players[0].upcard);
            if(stratCode == 2){ // do split
                if(DEBUG){ console.log("Player gets SPLIT code", player, players, "\n");}
                var sPlayer = createPlayer();
                var splitPoints = player.points / 2;
                sPlayer.points = splitPoints;
                player.points = splitPoints;
                var newcard = deck.pop();
                 if(DEBUG){ console.log("split deal 1 ", newcard, "\n");}
                sPlayer.points += newcard;
                if(newcard == 11){
                    sPlayer.acesToUse++;
                }
                newcard = deck.pop();
                if(DEBUG){ console.log("split deal 2 ", newcard, "\n");}
                player.points += newcard;
                if(newcard == 11){
                    player.acesToUse++;
                }
                player.canSplit = false;
                newPlayers.push(sPlayer);
                if(DEBUG){ console.log("pushed new player", sPlayer, newPlayers, "\n");}
            }
        }
        newPlayers.push(player);
    });
    if(DEBUG){console.log("players after doing splits", newPlayers);}
    return [deck, newPlayers];
}


function deal(deck, players){
    var i = 0;
    while(i < 2){
        players = players.map(function(player){
            var card = deck.pop();
            var newPoints = player.points + card;
            var nPlayer = {
                type:player.type,
                points:player.points,
                acesToUse:player.acesToUse,
                canSplit:false
            };
            if(i == 1 && nPlayer.type == 'dealer'){
                nPlayer.upcard = card;
            }
            if(nPlayer.type == "player" && card === nPlayer.points){
                nPlayer.canSplit = true;
                if(DEBUG){console.log("CAN SPLIT IS TRUE!!!!!!!-----------------");}
            }
            nPlayer.points = newPoints;
			if(card === 11){ nPlayer.acesToUse++; }
            if(DEBUG){ console.log("deals " + card + " card to " + nPlayer.type, nPlayer, '\n');}
            return nPlayer;
        });
        i++;
    }
    return [deck, players];
}


function createPlayers(numPlayers){
    var players = [createDealer()];
    var i = 0;
    while(i < numPlayers){
        players.push(createPlayer());
        i++;
    }
    return players;
}


function createDealer(){
    return {type:'dealer',points:0,acesToUse:0,upcard:0};
}

function createPlayer(){
    return {type:'player',points:0,acesToUse:0,doubledDown:false,canSplit:false};
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
    var stratCode = strategize(player, players[0].upcard);
    var card = 0;
    if(player.type == "player" && stratCode == 3){
        player.doubledDown = true;
        if(DEBUG){ console.log(player.type + " doubled down", player, '\n');}
        card = deck.pop();

        player.points += card;
        if(card == 11){ player.acesToUse++; }
        if(DEBUG){ console.log(player.type + " hits after double down and gets a " + card, player, '\n');}
        player = playAces(player);
    }else{
        while(player.points < 21 && shouldHit(players, player)){
            card = deck.pop();

            player.points += card;
            if(card == 11){ player.acesToUse++; }
            if(DEBUG){ console.log(player.type + " hits and gets a " + card, player, '\n');}
            player = playAces(player);
        }
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
    var stratCode = strategize(player, players[0].upcard);
    if(stratCode == 0 || stratCode == 3){
        return true;
    }
    return false;
}


function strategize(player, upcard){
    if(DEBUG){ console.log(player.type + " strategizing", player, 'dealer upcard is ',upcard, '\n');}
    var stratCode = 0;
    if(upcard == 11){ upcard = 1; }

    if(player.acesToUse > 0 && player.canSplit){
        stratCode = pairStrat[player.points-11][upcard-1];
    }else if(player.acesToUse > 0){
        stratCode = softStrat[player.points-11][upcard-1];
    }else if(player.canSplit){
        stratCode = pairStrat[player.points-1][upcard-1];
    }else{
        stratCode = hardStrat[player.points-1][upcard-1];
    }

    return stratCode;
}


function playAces(player){
    if(player.points > 21){
        if(player.acesToUse > 0){

            player.points -= 10;
            player.acesToUse--;
            if(DEBUG){console.log(player.type + " uses an ace ", player, "\n");}
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
