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


`
node blackJackd_v2.js

[ 0, 1, 0 ] 0
[ 51785, 53694, 8453 ] 49.09508053735815
[ 104079.5, 106828, 16854 ] 49.34841103327288
[ 156301, 159995, 25317 ] 49.416053317145966
[ 208501, 213133, 33912 ] 49.4507084343293
[ 260481.5, 266413, 42442 ] 49.43712640765846
[ 312732.5, 319571, 51024 ] 49.45923911539316
[ 365097.5, 372571, 59597 ] 49.493437770489045
[ 417079.5, 425984, 67901 ] 49.47189624506339
[ 469282, 479211, 76408 ] 49.47659076029027
testGameLoop: 59498.218ms
WINS ----- 521530.5
LOSS ----- 532501
TIES ----- 84784
`
