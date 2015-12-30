# GuildWars 2 API Wrapper
Lightweight, simple to use GuildWars 2 API Wrapper


### Version
2.1.2

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
    input: '46731' //switch to output: <ID> for output
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



```

### Todos

 - TESTS

License
----

MIT


