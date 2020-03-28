function o(cb) {
    if (cb === undefined) {
        return this;
    } else if (arguments.length === 2 && arguments[1] && (typeof arguments[1] === 'boolean')) {
        this.data = arguments[0];
        if (!this.list) { this.list = []; }
        this.list.push(arguments[0]);
    } else if (cb.constructor.name === 'AsyncFunction') {
        cb(o.bind({}));
    } else {
        if (arguments.length > 1) {
            let fns = Array.from(arguments).filter(f => {
                let name = f.constructor.name;
                return name === 'Function' || name === 'Promise';
            });
            let cf = arguments[arguments.length - 1];
            if (cf.constructor.name !== 'Object') { cf = null; }
            o(async o => {
                try {
                    for (let i = 0; i < fns.length; i++) {
                        let no = fns[i];
                        let name = no.constructor.name;
                        if (name === 'Function') {
                            await o(no);
                        } else {
                            o(await no, true);
                        }
                    }
                } catch (e) {
                    if (cf) { cf.catch(e); }
                } finally {
                    if (cf) { cf.finally(o().list); }
                }
            });
        } else {
            if (cb.constructor.name === 'Function') {
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
                    cb(fn);
                });
            }
        }
    }
}
module.exports = o;
