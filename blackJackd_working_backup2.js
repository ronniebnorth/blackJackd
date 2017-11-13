// blackJackd by Ronnie North 2017
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


console.time('testGameLoop');
var numPlayers = 100;
var numRounds = 10000000;
var decksToUse = 10;
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
        if(roundsPlayed % 10000 == 0){
            console.log(tscores, tscores[0]/roundsPlayed);
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
    players.map(function(player, index){
        var points = player.points;
        if(player.type != 'dealer'){
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
    });
    if(DEBUG){ console.log("Scores ", scores, '\n');}
    return scores;
}


function play(game){
    var deck = game[0];
    var players = game[1];
    var dealer = players[0];
    var nPlayers = {};

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
        nPlayers = players.map(function(player, ind, plyrs){
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
        //if(DEBUG){ console.log("after dealer non blackjack", nPlayers, "\n");}
    }
    //console.log('yeah', nPlayers);
    return nPlayers;
}


function deal(deck, players){
    var i = 0;
    while(i < 2){
        players = players.map(function(player, ind, plyrs){ 
            var card = deck.pop();
            if(card == player.points){
                player.canSplit = true;
            }
            var newPoints = player.points + card;
            
            var nPlayer = {
                type:player.type, 
                points:newPoints, 
                acesToUse:player.acesToUse
            };
            if(i == 1 && nPlayer.type == 'dealer'){
                nPlayer.upcard = card;
            }

			if(card === 11){ nPlayer.acesToUse++; }
            if(DEBUG){ console.log("deals " + card + " card to " + nPlayer.type, nPlayer, '\n');}
            return nPlayer;
        });
        i++;
    }
    return [deck, players];
}


function createPlayers(numPlayers){
    var players = [{type:'dealer',points:0,acesToUse:0,upcard:0}];
    var i = 0;
    while(i < numPlayers){
        players.push({type:'player',points:0,acesToUse:0,doubledDown:false,canSplit:false});
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
    // deal with doubling down around here...
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
        //two aces, split or whatever
        player.points = 0;
    }
    return [deck, player];
}


function shouldHit(players, player){
    if(player.type === 'dealer'){
        return player.points < 17 ? true : false;
    }
    if(player.points == 22 || player.points == 2){
        if(DEBUG){ console.log(player.type + " -------------------------------STRATCODE??? ", '\n');}
    }
    var stratCode = strategize(player, players[0].upcard);
    if(stratCode == 0){
        return true;
    }else if(stratCode == 3){
        return true;
    }else if(stratCode == 2){
        // do split -- add new player to game, this player divides cards with new player and both get card from deck...
    }else{
        if(stratCode != 1){
            if(DEBUG){ console.log(player.type + " -------------------------------STRATCODE 9??? ", stratCode, '\n');}
        }
        
        return false;
    }
}


function strategize(player, upcard){
    if(DEBUG){ console.log(player.type + " strategizing", player, 'dealer upcard is ',upcard, '\n');}
    var stratCode = 0;
    if(upcard == 11){ upcard = 1; }

    if(player.acesToUse > 0){
        stratCode = softStrat[player.points-11][upcard-1];
   // }else if(player.canSplit){
   //     stratCode = pairStrat[player.points-1][upcard-1]; // split stuff
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
