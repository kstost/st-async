# st-async 
Be lazy, Write short 
 

```js
/*
    Install by below
    $ npm install st-async
*/

let stAsync = require('st-async');
stAsync.set_promise(false); // give true as using Example 5, 6

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
        console.log(JSON.stringify(list)); // undefined
    }),
)

// Example 5
stAsync(
    data => new Promise((resolve, reject) => {
        resolve('banana');
    }),
    data => new Promise((resolve, reject) => {
        console.log(data); // banana
        resolve('mango');
    }),
    (data, resolve) => {
        console.log(data); // mango
        resolve('kiwi');
    },
    (data, resolve, reject) => {
        console.log(data); // kiwi
        reject('lemon');
    },
    data => new Promise((resolve, reject) => {
        console.log(data);
        reject('water');
    }),
    stAsync.catch(reject_msg => {
        console.log(reject_msg); // lemon
    }),
    stAsync.finally(list => {
        console.log(list); // [ 'banana', 'mango', 'kiwi' ]
    })
)

// Example 6
stAsync(
    data => stAsync(
        data => new Promise((resolve, reject) => {
            resolve('head');
        }),
        data => new Promise((resolve, reject) => {
            console.log(data); // head
            resolve('first');
        }),
        stAsync.finally(list => {
            console.log(list); // [ 'head', 'first' ]
        })
    ),
    data => new Promise((resolve, reject) => {
        resolve('banana');
    }),
    data => new Promise((resolve, reject) => {
        console.log(data); // banana
        resolve('mango');
    }),
    (data, resolve) => {
        console.log(data); // mango
        resolve('kiwi');
    },
    (data, resolve, reject) => {
        console.log(data); // kiwi
        reject('lemon');
    },
    data => new Promise((resolve, reject) => {
        console.log(data);
        reject('water');
    }),
    stAsync.catch(reject_msg => {
        console.log(reject_msg); // lemon
    }),
    stAsync.finally(list => {
        console.log(list); // [ [ 'head', 'first' ], 'banana', 'mango', 'kiwi' ]
    })
)

```
