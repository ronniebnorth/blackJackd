# blackJackd

Blackjack simulator in Javascript.

Supports pretty much everything:
* uses basic strategy
* multi-player
* splitting
* player blackjack pays 3 to 2
* dealer blackjack wins (unless a player also has blackjack then they push)
* double doubling down doubles the winnings
* Results show house advantage of .5 percent, so it's accurate



To use, update these variables in the blackJackd_vX.js file.

const DEBUG = false; // true will output a whole bunch of stuff

const numPlayers = 1;

const numRounds = 1000000; // it takes about 1 minute to run one million rounds on my laptop

const numDecks = 8;




Then run it with

node blackJackd_vX.js
