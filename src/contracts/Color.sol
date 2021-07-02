pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Color is ERC721{

    //array of colors 
    string[] public colors;

    mapping(string => bool) _colorExists;

    constructor() ERC721("Color", "COLOR"){

    }

    function mint(string memory _color) public{
        //require unique color
        require(!_colorExists[_color], "This color already exists");
        colors.push(_color);
        uint256 _id = colors.length;
        
        //color - add it
        _mint(msg.sender, _id);
        _colorExists[_color] = true;
        //call the mint function
        //color - track it
    }

    function totalSupply() public view returns(uint256 count){
        return colors.length;
    }
}