# Launch Lifecycle Rules

Reference document for TallyLaunchOrchestrator action preconditions.

## State Machine

```
SETUP ──[finalizeSetup()]──> FINALIZED ──[startAuction()]──> AUCTION_ACTIVE
                                                                   │
                                              ┌────────────────────┤
                                              │                    │
                                    [finalizeFailedAuction()]   (auction ends)
                                              │                    │
                                              v                    v
                                       AUCTION_FAILED        AUCTION_ENDED
                                        (terminal)                 │
                                                    [distributeLiquidity()]
                                                    [distributeTreasury()]
                                                    [distributeAll()]
                                                                   │
                                                                   v
                                                             DISTRIBUTED
                                                                   │
                                                          (if lockupDuration > 0)
                                                                   │
                                                                   v
                                                                LOCKED
                                                                   │
                                                       [withdrawPosition()]
                                                                   │
                                                                   v
                                                              UNLOCKED
```

## Token Source Types

| Value | Enum | Description | `finalizeSetup` Requirement |
|-------|------|-------------|-----------------------------|
| 0 | `MINT` | Orchestrator mints tokens | Orchestrator must have `MINTER_ROLE` on token contract |
| 1 | `TRANSFER_FROM` | Pull tokens via transferFrom | Operator must `approve(orchestrator, tokenAmount)` on token |
| 2 | `TRANSFER` | Tokens already in contract | `token.balanceOf(orchestrator) >= tokenAmount` |

## Action Preconditions

### `finalizeSetup()`

| Check | Condition | Error on Failure |
|-------|-----------|------------------|
| Required state | `state == SETUP` | `InvalidState(current, SETUP)` |
| Caller | `msg.sender == operator` | `OnlyOperator(caller, operator)` |
| If TRANSFER | `token.balanceOf(orchestrator) >= tokenAmount` | `InsufficientTokenBalance(required, actual)` |
| If TRANSFER_FROM | `token.allowance(operator, orchestrator) >= tokenAmount` | `InsufficientAllowance(required, actual)` |
| If MINT | `token.hasRole(MINTER_ROLE, orchestrator) == true` | `MissingMinterRole(token, orchestrator)` |

**Transitions state:** SETUP → FINALIZED

---

### `startAuction()`

| Check | Condition | Error on Failure |
|-------|-----------|------------------|
| Required state | `state == FINALIZED` | `InvalidState(current, FINALIZED)` |
| Caller | `msg.sender == operator` | `OnlyOperator(caller, operator)` |
| Start time (if set) | `startTime == 0 OR block.timestamp >= startTime` | `StartTimeInPast(startTime, now)` |
| Auction supply | `tokenAmount - (tokenAmount * liquidityAllocation / 10000) > 0` | `AuctionSupplyMustBePositive()` |

**Transitions state:** FINALIZED → AUCTION_ACTIVE

**Side effects:** Creates CCA contract, transfers tokens to CCA, sets `auctionEndTime`.

---

### `distributeLiquidity()`

| Check | Condition | Error on Failure |
|-------|-----------|------------------|
| Required state | NOT SETUP, FINALIZED, or AUCTION_FAILED | `InvalidState(current, AUCTION_ENDED)` |
| Auction ended | `block.timestamp >= auctionEndTime` | `AuctionNotEnded(now, auctionEndTime)` |
| Non-operator delay | If `msg.sender != operator`: `block.timestamp >= auctionEndTime + distributionDelay` | `DistributionNotPermissionless(now, permissionlessTime)` |
| Auction had bids | `totalRaised > 0` | `AuctionHasNoBids()` |
| Not already done | `distributionComplete[LIQUIDITY] == false` | Returns early (no revert) |

**Transitions state:** AUCTION_ACTIVE → AUCTION_ENDED (if first call), then eventually → DISTRIBUTED/LOCKED

---

### `distributeTreasury()`

| Check | Condition | Error on Failure |
|-------|-----------|------------------|
| Same as distributeLiquidity | (all timing/caller checks) | (same errors) |
| Liquidity done first | `distributionComplete[LIQUIDITY] == true` | Returns early (no revert) |
| Not already done | `distributionComplete[TREASURY] == false` | Returns early (no revert) |

---

### `distributeAll()`

Calls `_distributeLiquidity()` then `_distributeTreasury()` sequentially. Same preconditions as both combined.

---

### `finalizeFailedAuction()`

| Check | Condition | Error on Failure |
|-------|-----------|------------------|
| Required state | NOT SETUP, FINALIZED, or AUCTION_FAILED | `InvalidState(current, AUCTION_ENDED)` |
| Auction ended | `block.timestamp >= auctionEndTime` | `AuctionNotEnded(now, auctionEndTime)` |
| Non-operator delay | If `msg.sender != operator`: `block.timestamp >= auctionEndTime + distributionDelay` | `DistributionNotPermissionless(now, permissionlessTime)` |
| Zero bids | `auction.currencyRaised() == 0` | `AuctionNotFailed()` |

**Transitions state:** → AUCTION_FAILED (terminal)

**Side effects:** Returns all tokens to treasury.

---

### `withdrawPosition()`

| Check | Condition | Error on Failure |
|-------|-----------|------------------|
| Required state | `state == LOCKED OR state == UNLOCKED` | `InvalidState(current, UNLOCKED)` |
| Caller | `msg.sender == operator` | `OnlyOperator(caller, operator)` |
| Lockup expired | `block.timestamp >= distributionTimestamp + lockupDuration` | `LockupNotExpired(now, unlockTime)` |

**Transitions state:** → UNLOCKED

---

### `sweepToken()`

| Check | Condition | Error on Failure |
|-------|-----------|------------------|
| Required state | `state == DISTRIBUTED, LOCKED, or UNLOCKED` | `InvalidState(current, DISTRIBUTED)` |
| Caller | `msg.sender == operator` | `OnlyOperator(caller, operator)` |
| Balance > 0 | `token.balanceOf(orchestrator) > 0` | No revert, no-op |

---

### `sweepPaymentToken()`

Same as `sweepToken` but for the payment token (or ETH if `paymentToken == address(0)`).

---

### `transferOperator(address newOperator)`

| Check | Condition | Error on Failure |
|-------|-----------|------------------|
| Caller | `msg.sender == operator` | `OnlyOperator(caller, operator)` |
| Valid address | `newOperator != address(0)` | `InvalidAddress("newOperator")` |

Sets `pendingOperator`. Does NOT transfer immediately — requires acceptance.

---

### `acceptOperator()`

| Check | Condition | Error on Failure |
|-------|-----------|------------------|
| Caller | `msg.sender == pendingOperator` | `OnlyOperator(caller, pendingOperator)` |

Completes the operator transfer. Updates lockup contract if it exists.

## Custom Errors Reference

| Error | Description |
|-------|-------------|
| `InvalidState(LaunchState current, LaunchState required)` | Wrong lifecycle state |
| `OnlyOperator(address caller, address operator)` | Caller is not the operator |
| `InsufficientAllowance(uint256 required, uint256 actual)` | Token approval too low |
| `InsufficientTokenBalance(uint256 required, uint256 actual)` | Not enough tokens in contract |
| `MissingMinterRole(address token, address account)` | No MINTER_ROLE on token |
| `StartTimeInPast(uint256 startTime, uint256 currentTime)` | Scheduled start time not reached |
| `AuctionSupplyMustBePositive()` | Zero tokens for auction |
| `AuctionNotEnded(uint256 currentTime, uint256 endTime)` | Auction still running |
| `DistributionNotPermissionless(uint256 current, uint256 permissionless)` | Distribution delay not passed |
| `AuctionHasNoBids()` | Tried to distribute with zero bids |
| `AuctionNotFailed()` | Tried to finalize failed but auction had bids |
| `LockupNotExpired(uint256 currentTime, uint256 unlockTime)` | Lockup period still active |
| `InvalidAddress(string param)` | Zero address provided |
