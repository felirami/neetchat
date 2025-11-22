// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Tips
 * @notice Simple contract for sending tips between users
 * @dev Supports ERC20 tokens (USDC) and native ETH
 */
contract Tips {
    // Events
    event TipSent(
        address indexed from,
        address indexed to,
        address indexed token,
        uint256 amount,
        string message
    );

    /**
     * @notice Send a tip in native ETH
     * @param to Recipient address
     * @param message Optional message with the tip
     */
    function sendEthTip(address to, string memory message) external payable {
        require(to != address(0), "Invalid recipient");
        require(msg.value > 0, "Amount must be greater than 0");
        require(to != msg.sender, "Cannot tip yourself");

        (bool success, ) = to.call{value: msg.value}("");
        require(success, "Transfer failed");

        emit TipSent(msg.sender, to, address(0), msg.value, message);
    }

    /**
     * @notice Send a tip in ERC20 tokens
     * @param token Token contract address
     * @param to Recipient address
     * @param amount Amount to tip
     * @param message Optional message with the tip
     */
    function sendTokenTip(
        address token,
        address to,
        uint256 amount,
        string memory message
    ) external {
        require(to != address(0), "Invalid recipient");
        require(token != address(0), "Invalid token");
        require(amount > 0, "Amount must be greater than 0");
        require(to != msg.sender, "Cannot tip yourself");

        // Transfer tokens from sender to recipient
        // Note: This assumes the token contract follows the standard ERC20 interface
        // In production, use OpenZeppelin's SafeERC20 for safer transfers
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSignature(
                "transferFrom(address,address,uint256)",
                msg.sender,
                to,
                amount
            )
        );
        require(success, "Token transfer failed");

        emit TipSent(msg.sender, to, token, amount, message);
    }

    /**
     * @notice Get contract balance (for testing)
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

