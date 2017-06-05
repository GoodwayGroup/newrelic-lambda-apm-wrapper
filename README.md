# Newrelic Lambda APM Wrapper

Currently, only wraps the a background transaction.

## Example

handler.js in lambda
```javascript
const nr = require('newrelic');
const createBackgroundTransaction = require('newrelic-lambda-apm-wrapper').createBackgroundTransaction.bind(null, nr);

exports.someFunction = createBackgroundTransaction('SomeFunction', (event, context) => {
    // figure out some stuff
    return someWork(event)
        .then(result => {
            statusCode: 200,
            body: JSON.stringify(result)
        });
});
```
