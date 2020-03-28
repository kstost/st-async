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
            console.log(o); // ['hello', 'world']
        },
    }
)

// Example 3
o(
    o => {
        o('hello');
    },
    new Promise((resolve, reject) => {
        resolve('by promise');
    }),
    o => {
        console.log(o.data); // by promise
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
            console.log(o); // ['hello', 'by promise', 'world']
        },
    }
)

// Example 4
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
