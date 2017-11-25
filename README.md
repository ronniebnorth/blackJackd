# blackJackd

Blackjack simulator in Javascript.

Supports pretty much everything:
* uses basic strategy
* multi-player
* splitting
* player blackjack
* dealer blackjack (if player also has blackjack then push)
* double doubling down


To use, update these variables in the blackJackd_vX.js file.

const DEBUG = false; // true will output a whole bunch of stuff

const numPlayers = 1;

const numRounds = 1000000; // it takes about 1 minute to run one million rounds on my laptop

const numDecks = 8;




Then run it with

node blackJackd_vX.js
