# st-async 
Be lazy, Write short 
 

```js
/*
    Install by below
    $ npm install st-async
*/
```

or you can add script to your web page immediately by running this code in console
```js
(function(pr){var loadJS = function(implementationCode, location){var url = pr+'://cdn.jsdelivr.net/gh/kstost/st-async/index.js';var scriptTag = document.createElement('script');scriptTag.src = url;scriptTag.onload = implementationCode;scriptTag.onreadystatechange = implementationCode;location.appendChild(scriptTag);};loadJS(function(){console.log('adding complete');}, document.head);})(location.href.split(':')[0]==='https'?'https':'http');
```

or
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/kstost/st-async/index.js"></script>
```
  
Usages
```js

let stAsync = require('st-async');
stAsync.set_promise(false); // give true as using Example 5, 6, 7, 8

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


// Example 7
stAsync(
    data => fetch('http://dummy.restapiexample.com/api/v1/employees').then(res => res.json()),
    data => fetch('http://dummy.restapiexample.com/api/v1/employees').then(res => res.json()),
    data => fetch('http://dummy.restapiexample.com/api/v1/employees').then(res => res.json()),
    data => fetch('http://dummy.restapiexample.com/api/v1/employees').then(res => res.json()),
    stAsync.finally(list => {
        console.log(list); // All resolved responses until now are in list
    })
)

// Example 8
stAsync(
    data => fetch('http://dummy.restapiexample.com/api/v1/employees').then(res => res.json()),
    data => fetch('http://dummy.restapiexample.com/api/v1/create', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify({ "name": "test", "salary": "123", "age": "23" }),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()),
    (data, resolve, reject) => {
        console.log(data); // response of http://dummy.restapiexample.com/api/v1/employees
        resolve();
    },
    stAsync.finally(list => {
        console.log(list); // All resolved responses until now are in list
    })
)

```
