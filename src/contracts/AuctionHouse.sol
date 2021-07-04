pragma solidity ^0.8.0;

import "./NFT.sol";

contract AuctionHouse{

    //CONTRACT FIELDS

    //array of all the auctions
    Auction[] public auctions;

    //map that contains every bid of a certain auction
    mapping(uint256 => Bid[]) public auctionBids;

    //for a given owner it returns a list of his auctions
    mapping(address => uint256[]) public auctionOwner;

    //Just the basic structure of a bid
    struct Bid{
        address payable from;
        uint256 amount;
    }

    struct Auction{
        string name;
        uint256 blockDeadline;
        uint256 startPrice;
        string metadata;
        uint256 nftId;
        address nftRepositoryAddress;
        address payable owner;
        bool active;
        bool finalized;
    }
    //----------------------------MODIFIERS-------------------------------------

    //Guarantees that msg.sender is the owner of an auction
    modifier onlyOwner(uint _auctionId){
        require(auctions[_auctionId].owner == msg.sender, "You are not the owner");
        _;
    }

    //Guarantees that this contract is owner of the given nft
    //_nftAddress 
    modifier contractIsNFTOwner(address _nftAddress, uint256 _nftId){
        address nftOwner = NFT(_nftAddress).ownerOf(_nftId);
        require(nftOwner == address(this), "This contract doesn't own this NFT");
        _;
    }

    fallback() external{
        revert();
    }

    //----------------------------FUNCTIONS-------------------------------------

    //returns the number of overall auctions
    function getCount() public view returns(uint){
        return auctions.length;
    }

    //for a given auction returns the number of bids 
    function getBidsCount(uint _auctionId) public view returns(uint){
        return auctionBids[_auctionId].length;
    }
    
    //for a given owner returns an array of owned auctions
    function getAuctionsOf(address _owner) public view returns(uint[] memory){
        uint[] memory owned = auctionOwner[_owner];
        return owned;
    }

    //for a given auctionId returns the current bid
    function getCurrentBid(uint _auctionId) public view returns(uint256, address){
        uint bidsLen = auctionBids[_auctionId].length;

        if(bidsLen > 0){
            Bid memory lastBid = auctionBids[_auctionId][bidsLen-1];
            return(lastBid.amount, lastBid.from);
        }
        //if you don't find anything just return 0's
        return(uint256(0), address(0));
    }


    //number of auctions that the owner owns
    function getAuctionsCountOfOwner(address _owner) public view returns(uint){
        return auctionOwner[_owner].length;
    }

    function getAuctionById(uint _auctionId) public view returns(Auction memory){
        return auctions[_auctionId];
    }


    /*
    For the given info creates an auction and adds it to the collections
    but only if the contract is the owner of the nft
    returns a boolean value so the dev could see whether the auction is created
    */
    function createAuction(address _nftRepositoryAddress, uint256 _nftId, string memory _auctionTitle, string memory _metadata, uint256 _startPrice, uint _blockDeadline)
    public contractIsNFTOwner(_nftRepositoryAddress, _nftId) returns(bool){
        uint auctionId = auctions.length;
        Auction memory newAuc;
        newAuc.name = _auctionTitle;
        newAuc.blockDeadline = _blockDeadline;
        newAuc.startPrice = _startPrice;
        newAuc.metadata = _metadata;
        newAuc.nftId = _nftId;
        newAuc.nftRepositoryAddress = _nftRepositoryAddress;
        newAuc.owner = payable(msg.sender);
        newAuc.active = true;
        newAuc.finalized = false;

        auctions.push(newAuc);
        auctionOwner[msg.sender].push(auctionId);

        emit CreatedAuction(msg.sender, auctionId);
        return true;
    } 

    //approves the transaction and transferes the nft
    function approveAndTransfer(address _from, address _to, address _nftRepositoryAddress, uint256 _nftId) internal returns(bool){
        NFT remoteContract = NFT(_nftRepositoryAddress);
        remoteContract.approve(_to, _nftId);
        remoteContract.transferFrom(_from, _to, _nftId);
        return true;
    }

    /*
    the owner cancels his ongoing auction
    nft is transfered back to the owner from the contract
    the winning bidder get his refund
    */
    function cancelAuction(uint _auctionId) public onlyOwner(_auctionId){
        Auction memory myAuction = auctions[_auctionId];
        uint bidsLen = auctionBids[_auctionId].length;

        if(bidsLen > 0){
            Bid memory lastBid = auctionBids[_auctionId][bidsLen-1];
            if(!lastBid.from.send(lastBid.amount)){
                revert();
            }
        }

        //approve and transfer the transaction from this contract to the auction owner
        if(approveAndTransfer(address(this), myAuction.owner, myAuction.nftRepositoryAddress, myAuction.nftId)){
            auctions[_auctionId].active = false;
            emit CanceledAuction(msg.sender, _auctionId);
        }
    }

    //Behaves on the certain status of the auction
    function finalizeAuction(uint _auctionId) public{
        Auction memory myAuction = auctions[_auctionId];
        uint bidsLen = auctionBids[_auctionId].length;

        //if the auction hasn't ended yet just revert
        if(block.timestamp < myAuction.blockDeadline) revert();

        //if there are no bids it cancels the auction
        if(bidsLen == 0){
            cancelAuction(_auctionId);
        }
        else{// the money goes to the owner and the nft goes to the winner
            Bid memory lastBid = auctionBids[_auctionId][bidsLen - 1];

            if(!myAuction.owner.send(lastBid.amount)){
                revert();
            }

            if(approveAndTransfer(address(this), lastBid.from, myAuction.nftRepositoryAddress, myAuction.nftId)){
                auctions[_auctionId].active = false;
                auctions[_auctionId].finalized = true;
                emit FinalizedAuction(msg.sender, _auctionId);
            }
        }
    }

    function bidOnAuction(uint _auctionId) external payable {
        uint ethSent = msg.value;
        Auction memory myAuction = auctions[_auctionId];

        //owner can't bid on his own auctions
        if(myAuction.owner == msg.sender) revert();

        //can't bid if the auction has expired
        if(block.timestamp > myAuction.blockDeadline) revert();

        uint bidsLen = auctionBids[_auctionId].length;
        uint256 tmpAmount = myAuction.startPrice;
        Bid memory lastBid;

        //checking if there are any bids
        if(bidsLen > 0){
            lastBid = auctionBids[_auctionId][bidsLen - 1];
            tmpAmount = lastBid.amount;
        }

        //the amount sent has to be greater than the last bid
        if(ethSent < tmpAmount) revert();

        //if everything passed we refund the last bidder
        if(bidsLen > 0){
            if(!lastBid.from.send(lastBid.amount)){
                revert();
            }
        }

        //and then insert the new bid
        Bid memory newBid;
        newBid.from = payable(msg.sender);
        newBid.amount = ethSent;
        auctionBids[_auctionId].push(newBid);

        emit SuccessfulBid(msg.sender, _auctionId);

    }

    //----------------------------EVENTS-------------------------------------

    event SuccessfulBid(address _from, uint _auctionId);

    event CreatedAuction(address _owner, uint _auctionId);

    event CanceledAuction(address _owner, uint _auctionId);

    event FinalizedAuction(address _owner, uint _auctionId);

}