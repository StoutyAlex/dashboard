
let environmentConfig;
try {
    environmentConfig = require('/etc/silver-dashboard/component_configuration.json');
} catch (ex) {
    environmentConfig = { environment: 'dev' }
}

const config = require(`./${environmentConfig.environment}`);

module.exports = config;