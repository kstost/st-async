function o(cb) {
    if (cb.constructor.name === 'AsyncFunction') {
        cb(o.bind({}));
    } else {
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
export default o;
if (false) {
    o(async o => {
        try {
            await o(o => {
                console.log(o.data);
                o(654);
            });
            await o(o => {
                console.log(o.data);
                o('sample', '에러');
            });
            await o(o => {
                console.log(o.data);
            });
        } catch (e) {
            console.log(e);
        }

    });
}