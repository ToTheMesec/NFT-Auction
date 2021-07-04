const AuctionHouse = artifacts.require("AuctionHouse");
const NFT = artifacts.require("NFT");

module.exports = function(deployer) {
  deployer.deploy(AuctionHouse);
  deployer.deploy(NFT, "NFT Auction", "NFTA");
};
