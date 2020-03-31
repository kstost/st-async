function stAsync(cb) {
    function get_type(data, typestr) {
        if (!data) { return false; }
        return data.constructor.name === typestr;
    }
    const MODE_GET_MAIN_DATA = 0;
    const MODE_FUNCTION = 1;
    const MODE_ASYNC_FUNCTION = 2;
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
            return stAsync(async binded_function => {
                try {
                    for (let i = 0; i < step_functions.length; i++) {
                        if (get_type(step_functions[i], 'Function')) {
                            await binded_function({ mode: MODE_FUNCTION, body: step_functions[i] });
                        }
                        if (get_type(step_functions[i], 'Array') && step_functions.length) {
                            let promise_function = step_functions[i].splice(0, 1)[0];
                            binded_function({ mode: MODE_ASYNC_FUNCTION, body: await promise_function(...step_functions[i]) });
                        }
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
        if (get_type(cb, 'AsyncFunction')) {
            let main_object = {};
            let binded_function = stAsync.bind(main_object);
            return cb(binded_function);
        }
        if (!get_type(cb, 'Object')) { return; }
        if (cb.mode === MODE_ASYNC_FUNCTION) {
            this.data = cb.body;
            if (!this.list) { this.list = []; }
            this.list.push(cb.body);
            return;
        }
        if (cb.mode === MODE_GET_MAIN_DATA) {
            return this;
        }
        if (cb.mode === MODE_FUNCTION) {
            if (get_type(cb.body, 'Function')) {
                let ob = this;
                return new Promise((resolve, reject) => {
                    let fn = function (data, error) {
                        if (!error) {
                            ob.data = data;
                            if (!ob.list) { ob.list = []; }
                            ob.list.push(data);
                            resolve(data);
                        } else {
                            reject(error);
                        }
                    };
                    fn.data = ob.data;
                    cb.body(fn);
                });
            }
            return;
        }
    }
}
stAsync.catch = function (f) { return { catch: [f] }; }
stAsync.finally = function (f) { return { finally: [f] }; }
try { module.exports = stAsync; } catch{ }
