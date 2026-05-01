// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20ToERC7984Wrapper} from
    "@iexec-nox/nox-confidential-contracts/contracts/token/extensions/ERC20ToERC7984Wrapper.sol";
import {ERC7984} from "@iexec-nox/nox-confidential-contracts/contracts/token/ERC7984.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Nox, euint256, externalEuint256} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";

/**
 * @title  GhostPay
 * @notice Confidential bulk payroll built on the iExec Nox protocol.
 *         The employer (owner) wraps a standard ERC-20 into the confidential
 *         ERC-7984 representation and then distributes encrypted salaries to
 *         employees in a single batch. Per-employee amounts are never visible
 *         on the public ledger.
 *
 * @dev    Encryption / decryption flow:
 *           - Off-chain (frontend): the dApp uses the Nox JS SDK
 *             (`iexec-nox/handle`) to encrypt each plaintext salary, producing
 *             one `externalEuint256` handle per employee plus a single
 *             `inputProof` (an EIP-712 signature attesting to all handles).
 *           - On-chain (this contract): we resolve every external handle to
 *             an internal `euint256` via `Nox.fromExternal` and perform a
 *             confidential transfer.
 *
 *         Reclaim is a two-step flow per the ERC-7984 wrapper spec:
 *           1. `reclaimToUnderlying` burns the encrypted amount and returns an
 *              `unwrapRequestId`.
 *           2. The caller then invokes `finalizeUnwrap` (inherited from the
 *              wrapper) once the Nox protocol has decrypted the burnt amount
 *              off-chain. `finalizeUnwrap` is responsible for the actual
 *              ERC-20 transfer back to the employee.
 */
contract GhostPay is ERC20ToERC7984Wrapper, Ownable {
    /// @notice Emitted once per batch payroll distribution.
    /// @param  employer      The employer who triggered the payroll.
    /// @param  employeeCount Number of employees paid in this batch.
    event PayrollDistributed(address indexed employer, uint256 employeeCount);

    /// @notice Emitted when an employee initiates an unwrap of their salary.
    /// @param  employee         The employee reclaiming.
    /// @param  unwrapRequestId  The wrapper's request id; needed to finalize.
    event SalaryClaimRequested(address indexed employee, euint256 unwrapRequestId);

    error EmptyPayroll();
    error LengthMismatch();

    constructor(
        IERC20 underlying_,
        string memory name_,
        string memory symbol_,
        string memory contractURI_
    )
        ERC20ToERC7984Wrapper(underlying_)
        ERC7984(name_, symbol_, contractURI_)
        Ownable(msg.sender)
    {}

    /**
     * @notice Distribute encrypted salaries to multiple employees atomically.
     * @dev    The caller (the employer) must already hold confidential balance
     *         in this contract — i.e. they must have called `wrap()` first
     *         with the underlying ERC-20.
     *
     * @param  employees         Recipient addresses.
     * @param  encryptedAmounts  One encrypted handle per employee, produced
     *                           off-chain via the Nox JS SDK.
     * @param  inputProof        The EIP-712 proof attesting to ALL of the
     *                           encrypted handles in this call. The Nox SDK
     *                           returns a single proof for an arbitrary number
     *                           of handles in the same encryption session.
     */
    function distributeConfidentialPayroll(
        address[] calldata employees,
        externalEuint256[] calldata encryptedAmounts,
        bytes calldata inputProof
    ) external onlyOwner {
        uint256 len = employees.length;
        if (len == 0) revert EmptyPayroll();
        if (len != encryptedAmounts.length) revert LengthMismatch();

        for (uint256 i = 0; i < len; ++i) {
            // Verify the handle was produced by a legitimate Handle Gateway
            // and obtain an internal euint256 we can pass to the transfer.
            euint256 amount = Nox.fromExternal(encryptedAmounts[i], inputProof);

            // Confidentially move tokens from the employer's encrypted balance
            // to the employee's encrypted balance. The plaintext value is
            // never seen on-chain.
            _transfer(msg.sender, employees[i], amount);
        }

        emit PayrollDistributed(msg.sender, len);
    }

    /**
     * @notice Step 1 of unwrapping: burn confidential tokens and request a
     *         decryption from the Nox protocol.
     * @dev    Step 2 (`finalizeUnwrap`) is exposed by the parent
     *         `ERC20ToERC7984Wrapper` and must be called once the protocol
     *         has decrypted the burnt amount off-chain.
     *
     * @param  encryptedAmount  Encrypted amount to unwrap.
     * @param  inputProof       EIP-712 proof for `encryptedAmount`.
     * @return unwrapRequestId  The opaque id needed to call `finalizeUnwrap`.
     */
    function reclaimToUnderlying(
        externalEuint256 encryptedAmount,
        bytes calldata inputProof
    ) external returns (euint256 unwrapRequestId) {
        unwrapRequestId = unwrap(msg.sender, msg.sender, encryptedAmount, inputProof);
        emit SalaryClaimRequested(msg.sender, unwrapRequestId);
    }
}