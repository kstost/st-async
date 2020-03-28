function o(cb) {
    if (cb.constructor.name === 'AsyncFunction') {
        cb(o.bind({}));
    } else {
        if (arguments.length > 1) {
            let fns = Array.from(arguments).filter(f => (f.constructor.name === 'Function'));
            let cf = arguments[arguments.length - 1];
            if (cf.constructor.name !== 'Object') { cf = null; }
            o(async o => {
                try {
                    for (let i = 0; i < fns.length; i++) { await o(fns[i]); }
                } catch (e) {
                    if (cf) { cf.catch(e); }
                } finally {
                    if (cf) { cf.finally(); }
                }
            });
        } else {
            if (cb.constructor.name === 'Function') {
                let ob = this;
                return new Promise((resolve, reject) => {
                    let fn = function (data, error) {
                        ob.data = data;
                        if (!error) {
                            resolve(data);
                        } else {
                            reject(error);
                        }
                    };
                    fn.data = ob.data;
                    cb(fn);
                });
            }
        }
    }
}
module.exports = o;
