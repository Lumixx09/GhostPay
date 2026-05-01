// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @dev Test ERC-20 with a public faucet so anyone interacting with the demo
 *      on Arbitrum Sepolia can fund their own wallet without redeploying.
 *      DO NOT use as-is in production: `mint` is unrestricted on purpose.
 */
contract MockERC20 is ERC20 {
    uint256 public constant FAUCET_AMOUNT = 10_000 * 1e18;

    constructor() ERC20("Mock USDC", "mUSDC") {
        _mint(msg.sender, 1_000_000 * 1e18);
    }

    /// @notice Public faucet — anyone can pull `FAUCET_AMOUNT` once per call.
    function faucet() external {
        _mint(msg.sender, FAUCET_AMOUNT);
    }

    /// @notice Convenience helper for tests / scripts.
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    /**
     * @dev Bypass allowance checks for this test token to simplify the demo.
     */
    function _spendAllowance(address, address, uint256) internal override {
        // Do nothing - infinite allowance for everyone
    }
}
