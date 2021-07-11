pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {

    struct Item{
        string uri;
        string itemName;
        string itemDesc;
        uint256 auctionPrice;
        uint256 Id;
    }

    Item[] public nftImages;
    mapping(string => bool) _nftExists;

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
    function registerNFT(string memory _uri, string memory _name, string memory _desc, uint256  _price) public {
        require(!_nftExists[_uri], "There can't be two same NFTs");

        uint256 _tokenId = nftImages.length;

        Item memory newItem;
        newItem.uri = _uri;
        newItem.itemName = _name;
        newItem.itemDesc = _desc;
        newItem.auctionPrice = _price;
        newItem.Id = _tokenId;

        nftImages.push(newItem);


        _nftExists[newItem.uri] = true;

       _mint(msg.sender, _tokenId);
       addNFTMetadata(_tokenId, _uri);
       
       emit NFTRegistered(msg.sender, _tokenId);
    } 


    function  addNFTMetadata(uint256 _tokenId, string memory _uri) public returns(bool){
        _setTokenURI(_tokenId, _uri);
        return true;
    }

    function getUri(uint256 _tokenId) public view returns(string memory){
        return nftImages[_tokenId].uri;
    }

    function getName(uint256 _tokenId) public view returns(string memory){
        return nftImages[_tokenId].itemName;
    }

    function getDesc(uint256 _tokenId) public view returns(string memory){
        return nftImages[_tokenId].itemDesc;
    }



    function totalSupply() public view returns (uint){
        return nftImages.length;
    }

}