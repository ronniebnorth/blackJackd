# blackJackd

Blackjack simulator in Javascript.

Work in progress.. but functional. Please let me know if you see any ways to make it even faster!

Supports pretty much everything (except re-splitting and insurance):
* dealer stands on any 17 (hard or soft)
* multi-player
* players use basic strategy
* player splitting
* player blackjack pays 3 to 2
* dealer blackjack wins (unless a player also has blackjack then they push)
* double doubling down doubles the winnings
* Results show (after about 1 million rounds) a house advantage of .5 percent, so it's accurate

<br><br>
To use, open the blackJackd_vX.html file in Chrome, input the game values, and view results in console.   

<br><br><br>
Alternatively, you can use Node instead of running in the browser, both are equally fast.

To use with Node, update these variables in the blackJackd_vX.js file.

```
const DEBUG = false; // will output a whole bunch of stuff if true

const numPlayers = 1; // use as many as you want
const numRounds = 1000000; //100000000;
const numDecks = 8;
const outputInterval = 100000; // how often to show results snapshot
```




Then run it and sit back and wait
```
node blackJackd_vX.js
```


The results show:
```
[ win, loss, tie ]  win percentage
```


```
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
```
