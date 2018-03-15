/* eslint-disable */
const Crowdsale = artifacts.require('./Crowdsale.sol');

module.exports = function(deployer) {
  // Parametrs:
  // - beginning of pre-ICO
  // - beginning of ICO
  // - duration pre-ICO in hours (30 days = 720 hours)
  // - duration ICO in hours (45 days = 1080 hours)
  // - ETH/USD (cents)
  deployer.deploy(
    Crowdsale,
    Math.round(1517407199000/1000.0) + 60,
    Math.round(1517407199000/1000.0 + 3024000) + 60,
    720, 1080, 1100000
  );
};
