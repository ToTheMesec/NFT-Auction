pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {

   constructor(string memory _name, string memory _symbol)  ERC721(_name, _symbol){}

    /*
    When an NFT is registered an event is triggered
    which shows which NFT has been registered
    _by represents the who registered the NFT
    _tokenId represents the specific NFT 
    */
    event NFTRegistered(address _by, uint256 _tokenId);

    /*
    registerNFT is a public function used to register an NFT
    it uses _mint function of the ERC721 token
    _tokenId will represent an NFT and _uri will contain metadata
    */
    function registerNFT(uint256 _tokenId, string memory _uri) public {
       _mint(msg.sender, _tokenId);
       addNFTMetadata(_tokenId, _uri);
       emit NFTRegistered(msg.sender, _tokenId);
    } 


    function  addNFTMetadata(uint256 _tokenId, string memory _uri) public returns(bool){
        _setTokenURI(_tokenId, _uri);
        return true;
    }

}