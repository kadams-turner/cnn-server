const { resolve } = require('path');

/**
 * Simple healthcheck middleware.
 *
 * @example
 * const packageJSON = require('./package.json');
 * const healthcheck = require('../some/path/healthcheck')(packageJSON);
 * app.use('/healthcheck', healthcheck);
 *
 * @param {Object} packageJSON - Your project's package.json file.
 * @param {Object} [extensions] - Additional values you want to include.
 * @return {Function} Healthcheck middleware.
 */
function healthcheck(packageJSON, additonalMetrics = {}) {
    if (!packageJSON) {
        log.error('No package.json was provided to the healthcheck.');
        process.exit(1);
    }

    function metrics() {
        return Object.assign({}, {
            name: packageJSON.name,
            versionPackage: packageJSON.version
        }, additonalMetrics);
    };

    return (req, res) => {
        if (res.send) {
            res.json(metrics());
        } else {
            res(JSON.stringify(metrics(), null, 2));
        }
    };
};

const healthcheckRoute = {
    path: '/_healthcheck',
    handler: healthcheck(require(resolve(process.cwd(), 'package.json')))
};

module.exports = {
    // healthcheck,
    healthcheckRoute
};
