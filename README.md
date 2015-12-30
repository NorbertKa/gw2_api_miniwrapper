# GuildWars 2 API Wrapper
# Rewriting the wrapper (gonna update in Soon, ~1 day, gonna add browser support, tests, clean up the code)
Lightweight, simple to use GuildWars 2 API Wrapper


### Version
2.0.3

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

Transpile Es6 --> Es5
```sh
npm install -g gulp
cd gw2_api_miniwrapper
gulp default
```

### How to use
*ES 6*
```javascript
import gw2Api from 'gw2_api_miniwrapper';

gw2Api({
    endpoints: 'items'
}).then(function (items) {
    console.log(items);
}).catch(function (error) {
    console.log(error);
});
```

*ES 5*
```javascript
var gw2Api = require('./index').default;

gw2Api({
    endpoints: 'items'
}).then(function (items) {
    console.log(items);
}).catch(function (error) {
    console.log(error);
});
```

### Examples
```javascript
import gw2Api from 'gw2_api_miniwrapper';

gw2Api({ // get All items
    endpoints: 'items'
}).then(function (items) {
    console.log(items);
}).catch(function (error) {
    console.log(error);
});

gw2Api({ // get items 1 and 2
    endpoints: 'items',
    ids: [1, 2]
}).then(function (items) {
    console.log(items);
}).catch(function (error) {
    console.log(error);
});

gw2Api({ //search for recipe input, ID 46731
    endpoints: ['recipes','search'],
    parameters: {
        input: '46731' //switch to output: <ID> for output
    }
}).then(function(data){
    console.log(data);
})

gw2Api({  // Account endpoint (apiKey required)
    endpoints: 'account',
    apiKey: 'APIKEY_HERE'
}).then(function (data) {
    console.log(data);
}).catch(function (error) {
    console.log(error);
})



gw2Api({  // Gets current daily achievements (expands them)
    endpoints: ['achievements', 'daily']
}).then(function (data) {
    _.forEach(data, function (category) {  // Using Lodash.forEach to loop throught objects  import _ from 'lodash'
        _.forEach(category, function (achievement) {
            gw2Api({
                endpoints: 'achievements',
                ids: achievement.id
            })
                .then(function (achievementData) {
                    console.log(achievementData);
                })
                .catch(function (err) {
                    console.log(err);
                })
        })
    })
}).catch(function (error) {
    console.log(error);
});

```

### Todos

 - TESTS

License
----

MIT


