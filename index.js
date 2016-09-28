const {getDefaultParams} = require('funky-di-util');

let callTimes = 0;

function test(name, fn, delay = true) {
    if (delay) {
        callTimes++;
        return process.nextTick(() => test(name, fn, false));
    }

    try {
        if (! getArgs(fn).length) {
            fn();
            printSuccess();
        } else {
            let isCalled = false;

            const timeout = setTimeout(() => {
                if (! isCalled) {
                    throw Error('Callback not called within time limit');
                }
            }, module.exports.TIME_LIMIT);

            const cb = (err) => {
                clearTimeout(timeout);
                isCalled = true;
                if (err) {
                    printErr(err);
                } else {
                    printSuccess();
                }
            };

            fn(cb);
        }
    } catch (err) {
        printErr(err);
    }

    function printErr(err) {
        console.log('\nFailure: ' + name);
        console.log('Error message: "' + err.message + '"');
        callTimes--;

        if (callTimes === 0) {
            console.log();
        }
    }

    function getArgs(fn) {
        return Object.keys(getDefaultParams(fn));
    }

    function printSuccess() {
        process.stdout.write('.');
        callTimes--;

        if (callTimes === 0) {
            console.log();
        }
    }
}

test.TIME_LIMIT = 1000;
module.exports = test;
