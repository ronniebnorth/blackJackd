
$(function() {
    $( "#btnStart" ).click(function() {

          start();

    });
});




function start(){
    //const numPlayers = 1;
    //const numRounds = 100000; //100000000;
    //const numDecks = 8;
    var numPlayers = $("#numPlayers").val();
    var numRounds = $("#numRounds").val();
    var numDecks = $("#numDecks").val();


    var t0 = performance.now();
    var res = playRounds(numPlayers,numRounds,getFullDeck(numDecks));
    var t1 = performance.now();
    $("#runtime").text((t1 - t0) + " ms");

    var totWins = res[0];
    var totLoss = res[1];
    var totTie = res[2];

    console.log('WINS -----', totWins);
    console.log('LOSS -----', totLoss);
    console.log('TIES -----', totTie);

    $("#wins").text(totWins);
    $("#loss").text(totLoss);
    $("#tie").text(totTie);
    var percentage = (totWins/(totWins+totLoss)) * 100;
    $("#percentage").text(percentage + ' %');

}


function playRounds(numPlayers, numRounds, deck){
    var tscores = [0,0,0];
    var roundsPlayed = 0;
    while(roundsPlayed < numRounds){
        var ndeck = clone(deck);
        var rscores = scorePlayers(play(deal(shuffle(ndeck), createPlayers(numPlayers))));

        tscores = sumArrays(tscores,rscores);
        if(roundsPlayed % 10000 === 0){
            var percentage = (tscores[0]/(tscores[0]+tscores[1])) * 100;
            console.log(tscores, percentage);
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


function winScore(player){
    var score = 1;
    if(player.doubledDown){
        score++;
    }
    if(player.blackjack === true){
        score += 0.5;
    }
    return score;
}


function loseScore(player){
    var lscore = 1;
    if(player.doubledDown){
        lscore++;
    }
    return lscore;
}


function scorePlayer(player, dealerPoints){
    var points = player.points;
    var playerScore = [0,0,0];
    if(points > dealerPoints || player.blackjack === true){
        playerScore[0] = winScore(player);
    }else if(points < dealerPoints || points === 0){
        playerScore[1] = loseScore(player);
    }else{
        playerScore[2]++;
    }
    return playerScore;
}

function scorePlayers(players){
    var dealerPoints = players[0].points;
    var scores = [0,0,0];
    for(var i = 1; i < players.length; i++){
        scores = sumArrays(scores,scorePlayer(players[i],dealerPoints));
    }
    return scores;
}

function dealerBlackjack(players){
    return players.map(function(player){
        if(player.type == "player" && player.points != 21){
            player.points = 0;
            return player;
        }else{
            return player;
        }
    });
}

function play(game){
    var deck = game[0];
    var players = game[1];
    var dealer = players[0];
    var nPlayers = [];

    if(dealer.points == 21){
        nPlayers = dealerBlackjack(players);
    }else{
        var spDeckPly = splitPlayers([deck, players]);
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
            if(stratCode == 2){
                player.canSplit = false;
                var sPlayer = createPlayer();
                var splitPoints = player.points / 2;
                sPlayer.points = splitPoints;
                player.points = splitPoints;

                var dp = adjustPlayer(1,giveCard(deck, sPlayer));
                deck = dp[0];
                sPlayer = dp[1];

                dp = adjustPlayer(1,giveCard(deck, player));
                deck = dp[0];
                player = dp[1];

                newPlayers.push(sPlayer);
            }
        }
        newPlayers.push(player);
    });
    return [deck, newPlayers];
}


function adjustPlayer(round,dp){
    var deck = dp[0];
    var nPlayer = dp[1];
    var card = dp[2];
    if(round == 1 && nPlayer.type == 'dealer'){
        nPlayer.upcard = card;
    }
    if(round == 1 && nPlayer.type == "player" && card === nPlayer.points / 2){
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
    if(stratCode === 0 || stratCode === 3){
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
    var hardStrat = [
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
    var pairStrat = [
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
