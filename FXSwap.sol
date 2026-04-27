// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract FXSwap {
    address public owner;
    
    // Exchange rates (multiplied by 1e6 for precision)
    mapping(address => mapping(address => uint256)) public rates;
    mapping(address => string) public tokenSymbols;
    
    event Swap(address indexed from, address indexed to, uint256 amountIn, uint256 amountOut, address user);
    event RateUpdated(address tokenA, address tokenB, uint256 rate);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setTokenSymbol(address token, string memory symbol) public onlyOwner {
        tokenSymbols[token] = symbol;
    }

    function setRate(address tokenA, address tokenB, uint256 rate) public onlyOwner {
        rates[tokenA][tokenB] = rate;
        emit RateUpdated(tokenA, tokenB, rate);
    }

    function getAmountOut(address tokenIn, address tokenOut, uint256 amountIn) public view returns (uint256) {
        require(rates[tokenIn][tokenOut] > 0, "Rate not set");
        return (amountIn * rates[tokenIn][tokenOut]) / 1e6;
    }

    function swap(address tokenIn, address tokenOut, uint256 amountIn) public returns (uint256) {
        require(rates[tokenIn][tokenOut] > 0, "Rate not set");
        uint256 amountOut = getAmountOut(tokenIn, tokenOut, amountIn);
        require(IERC20(tokenOut).balanceOf(address(this)) >= amountOut, "Insufficient liquidity");

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenOut).transfer(msg.sender, amountOut);

        emit Swap(tokenIn, tokenOut, amountIn, amountOut, msg.sender);
        return amountOut;
    }

    function addLiquidity(address token, uint256 amount) public onlyOwner {
        IERC20(token).transferFrom(msg.sender, address(this), amount);
    }
}
