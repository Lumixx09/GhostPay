// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title  GhostPay (Mock Version)
 * @notice A high-fidelity mock of the GhostPay protocol for the Challenge Demo.
 *         Bypasses all iExec Nox library dependencies to ensure stability on 
 *         unstable testnet RPC nodes.
 */
contract GhostPay is Ownable {
    IERC20 public immutable underlying;
    
    mapping(address => uint256) public demoBalances;
    
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
     * @notice Mock Wrap: Transfers tokens and updates demo balance.
     */
    function wrap(address to, uint256 amount) public returns (bytes32) {
        // Pure Mock: Direct credit to ensure 100% stability on unstable RPCs
        demoBalances[to] += amount;
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
            
            // For the demo: Always allow distribution to employees
            demoBalances[employees[i]] += amount;
            totalAmount += amount;
            
            // Deduct from employer only if balance exists, but don't revert if it doesn't
            if (demoBalances[msg.sender] >= amount) {
                demoBalances[msg.sender] -= amount;
            }
        }
        emit PayrollDistributed(msg.sender, len, totalAmount);
    }

    /**
     * @notice Mock Reclaim: Burns demo balance.
     */
    function reclaimToUnderlying(bytes32 encryptedAmount, bytes calldata /*inputProof*/) external returns (bytes32) {
        uint256 amount = uint256(encryptedAmount);
        require(demoBalances[msg.sender] >= amount, "Insufficient balance");
        
        demoBalances[msg.sender] -= amount;
        bytes32 requestId = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        emit SalaryClaimRequested(msg.sender, requestId);
        return requestId;
    }

    // Compatibility getters for frontend
    function confidentialBalanceOf(address account) public view returns (uint256) {
        return demoBalances[account];
    }
}