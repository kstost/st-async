# st-async 
Be lazy, Write short 
 

```js
/*
    Install by below
    $ npm install st-async
*/

let stAsync = require('st-async');

// Example 1
stAsync(
    o => { o('Hello'); },
    o => { o('World'); },
    stAsync.finally(list => {
        console.log(list); // ["Hello","World"]
    }),
)

// Example 2
stAsync(
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

// Example 3
stAsync(
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

// Example 4
stAsync(
    o => {
        o('Banana', 'Errrror!');
    },
    o => {
        console.log(o.data); // Can't run
        o('Fish');
    },
    stAsync.catch(error => {
        console.log(error); // Errrror!
    }),
    stAsync.finally(list => {
        console.log(JSON.stringify(list)); // [["Hello","World"],"Apple"]
    }),
)

// Example 5
stAsync(async o => {
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
