function stAsync(cb) {
    function get_type(data, typestr) {
        if (!data) { return false; }
        return data.constructor.name === typestr;
    }
    const MODE_GET_MAIN_DATA = 0;
    const MODE_FUNCTION = 1;
    const MODE_SET_DATA = 2;
    let arlist = Array.from(arguments);
    let arlength = arlist.length;
    if (arlength > 1 || (arlength === 1 && get_type(cb, 'Function'))) {
        let step_functions = Array.from(arlist).filter(f => {
            return get_type(f, 'Function') || get_type(f, 'Array');
        });
        if (step_functions.length) {
            let catch_finally = Array.from(arlist).map(f => {
                if (get_type(f, 'Object') && (f.catch || f.finally)) {
                    if (get_type(f.catch, 'Array') || get_type(f.finally, 'Array')) {
                        return f;
                    }
                }
            }).filter(f => f);
            let cf;
            if (!catch_finally.length) {
                cf = arlist[arlength - 1];
                if (!get_type(cf, 'Object')) { cf = null; }
            } else {
                let temp_work = {};
                catch_finally.forEach(f => {
                    if (f.catch && f.catch[0]) {
                        temp_work.catch = f.catch[0];
                    }
                    if (f.finally && f.finally[0]) {
                        temp_work.finally = f.finally[0];
                    }
                })
                cf = temp_work;
            }

            // 비동기 코드의 핵심 부분이다. stAsync 함수의 인자로써 async 함수를 넘겨준다
            // 넘겨준 함수는 CODE#001 에 cb 로써 들어간다
            return stAsync(async binded_function => {

                // CODE#002
                // 여기서 binded_function 는 main_object 를 품은 stAsync 의 복제본 함수이다

                try {
                    for (let i = 0; i < step_functions.length; i++) {
                        let resolved;
                        if (get_type(step_functions[i], 'Function')) {
                            resolved = await binded_function({ mode: MODE_FUNCTION, body: step_functions[i] });
                        }
                        if (get_type(step_functions[i], 'Array') && step_functions[i].length) {
                            let promise_function = (step_functions[i].splice(0, 1)[0]);
                            resolved = await promise_function(...step_functions[i]);
                        }
                        binded_function({ mode: MODE_SET_DATA, value: resolved });
                    }
                } catch (e) {
                    if (cf && cf.catch) { cf.catch(e); }
                } finally {
                    if (cf && cf.finally) {
                        let list = binded_function({ mode: MODE_GET_MAIN_DATA }).list;
                        cf.finally(list);
                    }
                }
                let list = binded_function({ mode: MODE_GET_MAIN_DATA }).list;
                return list;
            });
        }
    } else {
        if (get_type(cb, 'AsyncFunction')) { // CODE#001
            let main_object = {
                mode: stAsync.as_async
            };
            let binded_function = stAsync.bind(main_object);
            main_object.binded_function = binded_function;

            // main_object 를 품은 stAsync 함수의 복제본을 인자로 넘긴다.
            // 이로써 CODE#002 의 코드가 시작된다
            return cb(binded_function);
        }
        if (!get_type(cb, 'Object')) { return; }
        if (cb.mode === MODE_SET_DATA) {
            let data_obj = cb.data_obj;
            if (!data_obj) { data_obj = this; }
            if (!data_obj.list) {
                data_obj.list = [];
            }
            data_obj.list.push(cb.value);
            data_obj.data = cb.value;
            return data_obj;
        }
        if (cb.mode === MODE_GET_MAIN_DATA) {
            return this;
        }
        if (cb.mode === MODE_FUNCTION) {
            if (get_type(cb.body, 'Function')) {
                let ob = this;
                if (!ob.mode) {
                    return new Promise((resolve, reject) => {
                        let fn = function (data, error) {
                            if (!error) {
                                resolve(data);
                            } else {
                                reject(error);
                            }
                        };
                        fn.data = ob.data;
                        cb.body(fn);
                    });
                } else {
                    if (cb.body.length === 1) {
                        return cb.body(ob.data);
                    } else {
                        return new Promise((resolve, reject) => {
                            cb.body(ob.data, resolve, reject);
                        });
                    }
                }
            }
            return;
        }
    }
}
stAsync.catch = function (f) { return { catch: [f] }; }
stAsync.finally = function (f) { return { finally: [f] }; }
stAsync.set_promise = function (f) { stAsync.as_async = f; };
try { module.exports = stAsync; } catch{ }
