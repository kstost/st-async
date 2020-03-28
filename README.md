# st-async
```js
/*
    Install by below
    $ npm install st-async
*/

let o = require('st-async');

// Example 1
o(
    o => {
        o('hello');
    },
    o => {
        console.log(o.data); // hello
        o('world');
    },
    o => {
        console.log(o.data); // world
        o();
    }
)

// Example 2
o(
    o => {
        o('hello');
    },
    o => {
        console.log(o.data); // hello
        o('world');
    },
    o => {
        console.log(o.data); // world
        o(null, 'error');
    },
    o => {
        console.log(o.data); // Can't run
        o();
    },
    {
        catch: o => {
            console.log(o); // error
        },
        finally: o => {
            console.log('Finally');
        },
    }
)

// Example 3
o(async o => {
    try {
        await o(o => {
            o('hello');
        });
        await o(o => {
            console.log(o.data); // hello
            o(null, 'error');
        });
        await o(o => {
            console.log(o.data); // Can't run
        });
    } catch (e) {
        console.log(e); // error
    } finally {
        console.log('Finally');
    }
});
```
