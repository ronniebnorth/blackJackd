
const DEBUG = false; // will output a whole bunch of stuff if true

const numPlayers = 1; // use as many as you want
const numRounds = 1000000; //100000000;
const numDecks = 8;
const outputInterval = 100000; // how often to show results snapshot

console.time('testGameLoop');

var res = playRounds(numPlayers,numRounds,getFullDeck(numDecks));

console.timeEnd('testGameLoop');

console.log('WINS -----', res[0]);
console.log('LOSS -----', res[1]);
console.log('TIES -----', res[2]);


function playRounds(numPlayers, numRounds, deck){
    var tscores = [0,0,0];
    var roundsPlayed = 0;
    while(roundsPlayed < numRounds){
        var ndeck = clone(deck);
        var rscores = score(play(deal(shuffle(ndeck), createPlayers(numPlayers))));

        tscores = sumArrays(tscores,rscores);
        if(roundsPlayed > 10 && roundsPlayed % outputInterval == 0){
            console.log(tscores, (tscores[0]/(tscores[0]+tscores[1])) * 100);
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


function getFullDeck(numDecks){
    var fullDeck = [];
    for(var i = 0; i < numDecks; i++){
        fullDeck = fullDeck.concat(getOneDeck());
    }
    return fullDeck;
}


function score(players){
    var dealerPoints = players[0].points;
    var scores = [0,0,0];
    for(var i = 1; i < players.length; i++){
        var player = players[i];
        var points = player.points;
        if(points > dealerPoints || player.blackjack == true){
            scores[0]++;
            if(player.doubledDown){
                scores[0]++;
            }
            if(player.blackjack === true){
                scores[0] += .5;
            }
        }else if(points < dealerPoints || points == 0){
            scores[1]++;
            if(player.doubledDown){
                scores[1]++;
            }
        }else if(points == dealerPoints && points != 0){
            scores[2]++;
        }else{
            scores[1]++;
            if(player.doubledDown){
                scores[1]++;
            }
        }
    }
    return scores;
}


function play(game){
    var deck = game[0];
    var players = game[1];
    var dealer = players[0];
    var nPlayers = [];

    if(dealer.points == 21){
        nPlayers = players.map(function(player){
            if(player.type == "player"){
                player.points = 0;
                return player;
            }else{
                return player;
            }
        });
    }else{
        spDeckPly = splitPlayers([deck, players]);
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
            return newPlayer;
        });
    }
    return nPlayers;
}


function splitPlayers(deckPlayers){
    var deck = deckPlayers[0];
    var players = deckPlayers[1];
    var newPlayers = [];
    players.map(function(player){
        if(player.canSplit){
            var stratCode = strategize(player, players[0].upcard);
            if(stratCode == 2){ // do split
                var sPlayer = createPlayer();
                var splitPoints = player.points / 2;
                sPlayer.points = splitPoints;
                player.points = splitPoints;
                var newcard = deck.pop();
                sPlayer.points += newcard;
                if(newcard == 11){
                    sPlayer.acesToUse++;
                }
                newcard = deck.pop();
                player.points += newcard;
                if(newcard == 11){
                    player.acesToUse++;
                }
                player.canSplit = false;
                newPlayers.push(sPlayer);
            }
        }
        newPlayers.push(player);
    });
    return [deck, newPlayers];
}


function adjustPlayer(i,dp){
    deck = dp[0];
    var nPlayer = dp[1];
    var card = dp[2];
    if(i == 1 && nPlayer.type == 'dealer'){
        nPlayer.upcard = card;
    }
    if(nPlayer.type == "player" && i==1 && card === nPlayer.points / 2){
        nPlayer.canSplit = true;
    }
    return [deck,nPlayer];
}


function deal(ideck, players){
    var i = 0;
    var deck = clone(ideck);
    while(i < 2){
        players = players.map(function(player){
            var dp = adjustPlayer(i,giveCard(deck, player));
            deck = dp[0];
            return dp[1];
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


function giveCard(deck, player){
    var card = deck.pop();

    player.points += card;
    if(card == 11){ player.acesToUse++; }
    player = playAces(player);
    return [deck,player,card];
}

function hit(deck, players, player){
    var stratCode = strategize(player, players[0].upcard);
    var card = 0;
    var dp = [];
    if(player.type == "player" && stratCode == 3){
        player.doubledDown = true;
        dp = giveCard(deck, player);
        deck = dp[0];
        player = dp[1];

    }else{
        while(player.points < 21 && shouldHit(players, player)){
            dp = giveCard(deck, player);
            deck = dp[0];
            player = dp[1];
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
    var points = player.points - 1;
    if(player.acesToUse > 0){
        points = points - 10;
    }
    if(upcard == 11){ upcard = 1; }

    if(player.canSplit){
        return getPairStrat(points, upcard-1);
    }else if(player.acesToUse > 0){
        return getSoftStrat(points, upcard-1);
    }else{
        return getHardStrat(points, upcard-1);
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


function getOneDeck(){
    return [
        11,2,3,4,5,6,7,8,9,10,10,10,10,
        11,2,3,4,5,6,7,8,9,10,10,10,10,
        11,2,3,4,5,6,7,8,9,10,10,10,10,
        11,2,3,4,5,6,7,8,9,10,10,10,10
    ];
}

function getSoftStrat(points, upcard){
    var softStrat = [
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
    return softStrat[points][upcard];
}


function getHardStrat(points, upcard){
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
    return hardStrat[points][upcard];
}


function getPairStrat(points, upcard){
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
    return pairStrat[points][upcard];
}
