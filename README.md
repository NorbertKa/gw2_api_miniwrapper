# GuildWars 2 API Wrapper

Lightweight, simple to use GuildWars 2 API Wrapper

### Version
1.0.3

### How to Install
 
```sh
npm i gw2_api_miniwrapper --save
```
To transpile / test:
```sh
git clone https://github.com/mievstac/gw2_api_miniwrapper.git
cd gw2_api_miniwrapper
npm install
```
Test:
```sh
cd gw2_api_miniwrapper
npm test
```
Transpile Es6 --> Es5
```sh
npm install -g gulp
cd gw2_api_miniwrapper
gulp default
```

### How to use
*ES 5*
```javascript
var gw2Api = require('gw2_api_miniwrapper').default
gw2Api({
        name: 'achievements',
        ids: ['1840','910','2258']
        },function(err, data){
            if(!err){
                console.log(data);
                }
        });
```

*ES 6*
```javascript
import gw2Api from 'gw2_api_miniwrapper';
gw2Api({
        name: 'achievements',
        ids: ['1840','910','2258']
        },function(err, data){
            if(!err){
                console.log(data);
                }
        });
```

### Examples
```javascript
import gw2Api from 'gw2_api_miniwrapper';

gw2Api({  // get all item Ids
    name: 'items'
    },function(err,data){
        console.log(data);
    });
    
gw2Api({  // get material 5 and 6
    name: 'materials',
    ids: ['5','6']
    },function(err, data){
        console.log(data);
    });
    
gw2Api({  // get material 5
    name: 'materials',
    ids: 5
    },function(err, data){
        console.log(data);
    });
    
gw2Api({  // get account info (from apiKey)
    name: 'account',
    apikey: <apiKey>,
    },function(err, data){
        console.log(data);
    });
```

### Todos

 - Add Continent / Map support
 - More tests

License
----

MIT


