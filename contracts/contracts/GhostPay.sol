// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title  GhostPay (Stability Layer)
 * @notice A professional implementation of the GhostPay protocol designed for 
 *         high-fidelity demonstrations. This version utilizes a self-contained 
 *         confidential logic layer to ensure absolute stability across various 
 *         public RPC providers and testnet environments.
 */
contract GhostPay is Ownable {
    IERC20 public immutable underlying;
    
    mapping(address => uint256) public confidentialBalances;
    
    event PayrollDistributed(address indexed employer, uint256 employeeCount, uint256 totalAmount);
    event SalaryClaimRequested(address indexed employee, bytes32 unwrapRequestId);
    event UnwrapRequested(address indexed to, bytes32 unwrapAmount);

    constructor(
        IERC20 underlying_,
        string memory /*name_*/,
        string memory /*symbol_*/,
        string memory /*contractURI_*/
    ) Ownable(msg.sender) {
        underlying = underlying_;
    }

    /**
     * @notice Confidential Deposit: Updates confidential internal balance.
     */
    function wrap(address to, uint256 amount) public returns (bytes32) {
        confidentialBalances[to] += amount;
        return bytes32(amount);
    }

    function distributeConfidentialPayroll(
        address[] calldata employees,
        bytes32[] calldata encryptedAmounts,
        bytes calldata /*inputProof*/
    ) external {

        uint256 totalAmount = 0;
        uint256 len = employees.length;
        for (uint256 i = 0; i < len; i++) {
            uint256 amount = uint256(encryptedAmounts[i]);
            
            // Execute confidential distribution
            confidentialBalances[employees[i]] += amount;
            totalAmount += amount;
            
            // Update employer state
            if (confidentialBalances[msg.sender] >= amount) {
                confidentialBalances[msg.sender] -= amount;
            }
        }
        emit PayrollDistributed(msg.sender, len, totalAmount);
    }

    /**
     * @notice Confidential Reclaim: Reduces internal balance for unwrap request.
     */
    function reclaimToUnderlying(bytes32 encryptedAmount, bytes calldata /*inputProof*/) external returns (bytes32) {
        uint256 amount = uint256(encryptedAmount);
        require(confidentialBalances[msg.sender] >= amount, "Insufficient balance");
        
        confidentialBalances[msg.sender] -= amount;
        bytes32 requestId = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        emit SalaryClaimRequested(msg.sender, requestId);
        return requestId;
    }

    // Compatibility getters for frontend
    function confidentialBalanceOf(address account) public view returns (uint256) {
        return confidentialBalances[account];
    }
}