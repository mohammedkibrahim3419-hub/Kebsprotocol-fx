// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StablecoinFX {
    string public name;
    string public symbol;
    uint8 public decimals = 6;
    uint256 public totalSupply;
    address public owner;
    uint256 public exchangeRate;
    string public peggedCurrency;

    mapping(address => uint256) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Mint(address indexed to, uint256 amount);
    event RateUpdated(uint256 newRate);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(string memory _name, string memory _symbol, string memory _currency, uint256 _rate) {
        name = _name;
        symbol = _symbol;
        peggedCurrency = _currency;
        exchangeRate = _rate;
        owner = msg.sender;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Mint(to, amount);
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function updateRate(uint256 newRate) public onlyOwner {
        exchangeRate = newRate;
        emit RateUpdated(newRate);
    }
}
