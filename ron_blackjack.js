
const deckModel = [1,2,3,4,5,6,7,8,9,10,10,10,10,
			   1,2,3,4,5,6,7,8,9,10,10,10,10,
			   1,2,3,4,5,6,7,8,9,10,10,10,10,
			   1,2,3,4,5,6,7,8,9,10,10,10,10];
const numPlayers = 3;
const rounds = 10;


var played = 0;

while(played < rounds){
  var thisRound = played + 1;
  //console.log('ROUND BEGINNING ROUND ' + thisRound + '-------- deckModel.length=' + deckModel.length);

  results(play(deal(shuffle(clone(deckModel)), players(numPlayers))));

  //console.log('ROUND COMPLETE ----------------- deckModel.length=' + deckModel.length);
  //console.log(' ');
  played++;
}

function results(players){
    players.map(function(player, index){
        //console.log(player.type + ' ' + index, '  ---------   Score: ' + player.points)
    });
}


function play(game){
    var deck = game[0];
    var players = game[1];
    var newPlayers = [];
    players.map(function(player){
        var hitResults = hit(deck, players, player); 
        deck = hitResults[0];
        newPlayer = hitResults[1];
        newPlayers.push(newPlayer);
    });
	//console.log("PLAYTIME OVER ----------------- deck.length " + deck.length);
    return newPlayers;
}


function deal(deck, players){
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
    //console.log('DEALT CARDS ------------------- deck.length=' + deck.length)
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


function shouldHit(players, player){
    if(player.type === 'dealer'){
        return player.points < 17 ? true : false;
    }
    // todo: add basic strategy 
    return player.points < 17 ? true : false;
}


function clone(arr){
  return JSON.parse(JSON.stringify(arr));
}

