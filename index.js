const Promise = require('bluebird');

/**
 * Wrap a function in a newrelic background transaction
 *
 * The handle function only receives the event and context variables from the lambda.
 *
 * @param  {Object}   newrelic Newrelic Object
 * @param  {String}   name     Transaction name
 * @param  {String}   [group]  Group name
 * @param  {Function} handle   (event, context) Function to wrap that must return a promise
 * @return {Function}          Wrapped function
 */
exports.createBackgroundTransaction = function (newrelic, name, group, handle) {
    const args = Array.prototype.slice.call(arguments);
    const fn = args[args.length - 1];

    const wrappedFn = (event, context, callback) => {
        return Promise.try(() => {
            return fn(event, context);
        })
        .then((val) => {
            newrelic.endTransaction();
            callback(null, val);
        })
        .catch((err) => {
            newrelic.noticeError(err);
            newrelic.endTransaction();
            callback(err, null);
        });
    };

    args[args.length - 1] = wrappedFn;

    return newrelic.createBackgroundTransaction.apply(newrelic, args);
};
