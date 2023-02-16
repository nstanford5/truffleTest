const testerc721 = artifacts.require('testerc721.sol');

module.exports = function (deployer) {
  // the arguments are for the constructor
  deployer.deploy(testerc721, "testerc721", "TERC");
};