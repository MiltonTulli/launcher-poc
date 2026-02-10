import { Address } from "viem";

// ============================================
// TallyLaunchFactory ABI
// ============================================
export const TALLY_LAUNCH_FACTORY_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_platformAdmin", type: "address", internalType: "address" },
      { name: "_platformFeeBeneficiary", type: "address", internalType: "address" },
      { name: "_platformFeeOnLPFees", type: "uint256", internalType: "uint256" },
      { name: "_lockupImplementation", type: "address", internalType: "address" },
      { name: "_poolManager", type: "address", internalType: "contract IPoolManager" },
      { name: "_positionManager", type: "address", internalType: "contract IPositionManager" },
      { name: "_ccaFactory", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "BASIS_POINTS",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MAX_AUCTION_DURATION",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MAX_DISTRIBUTION_DELAY",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MAX_LOCKUP_DURATION",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MAX_PLATFORM_FEE_ON_LP_FEES",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MAX_PRICING_STEPS",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MIN_AUCTION_DURATION",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "MIN_PRICING_STEPS",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createLaunch",
    inputs: [
      { name: "token", type: "address", internalType: "address" },
      { name: "paymentToken", type: "address", internalType: "address" },
      { name: "operator", type: "address", internalType: "address" },
      {
        name: "params",
        type: "tuple",
        internalType: "struct LaunchParams",
        components: [
          { name: "tokenSource", type: "uint8", internalType: "enum TokenSource" },
          { name: "tokenAmount", type: "uint256", internalType: "uint256" },
          { name: "auctionDuration", type: "uint256", internalType: "uint256" },
          { name: "pricingSteps", type: "uint256", internalType: "uint256" },
          { name: "reservePrice", type: "uint256", internalType: "uint256" },
          { name: "startTime", type: "uint256", internalType: "uint256" },
          { name: "liquidityAllocation", type: "uint256", internalType: "uint256" },
          { name: "treasuryAllocation", type: "uint256", internalType: "uint256" },
          { name: "treasury", type: "address", internalType: "address" },
          { name: "poolFeeTier", type: "uint24", internalType: "uint24" },
          { name: "tickSpacing", type: "int24", internalType: "int24" },
          { name: "lockupDuration", type: "uint256", internalType: "uint256" },
          { name: "distributionDelay", type: "uint256", internalType: "uint256" },
          { name: "positionBeneficiary", type: "address", internalType: "address" },
          { name: "validationHook", type: "address", internalType: "address" },
          { name: "liquidityManager", type: "address", internalType: "address" },
        ],
      },
    ],
    outputs: [
      { name: "launchId", type: "uint256", internalType: "uint256" },
      { name: "launcherAddress", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getLaunch",
    inputs: [{ name: "launchId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLaunchCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "launchCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "launches",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "platformAdmin",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "platformFeeBeneficiary",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "platformFeeOnLPFees",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "poolManager",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IPoolManager" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "positionManagerContract",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IPositionManager" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "LaunchCreated",
    inputs: [
      { name: "launchId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "launcherAddress", type: "address", indexed: true, internalType: "address" },
      { name: "token", type: "address", indexed: true, internalType: "address" },
      { name: "paymentToken", type: "address", indexed: false, internalType: "address" },
      { name: "operator", type: "address", indexed: false, internalType: "address" },
      { name: "tokenAmount", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "auctionDuration", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "lockupDuration", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "platformFeeOnLPFees", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "InvalidAllocationSplit",
    inputs: [
      { name: "liquidityAllocation", type: "uint256", internalType: "uint256" },
      { name: "treasuryAllocation", type: "uint256", internalType: "uint256" },
      { name: "total", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "InvalidAuctionDuration",
    inputs: [{ name: "duration", type: "uint256", internalType: "uint256" }],
  },
  {
    type: "error",
    name: "InvalidDistributionDelay",
    inputs: [
      { name: "delay", type: "uint256", internalType: "uint256" },
      { name: "maxDelay", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "InvalidLockupDuration",
    inputs: [
      { name: "duration", type: "uint256", internalType: "uint256" },
      { name: "maxDuration", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "InvalidPlatformFeeOnLPFees",
    inputs: [
      { name: "fee", type: "uint256", internalType: "uint256" },
      { name: "maxFee", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "InvalidPoolFeeTier",
    inputs: [{ name: "tier", type: "uint24", internalType: "uint24" }],
  },
  {
    type: "error",
    name: "InvalidPricingSteps",
    inputs: [{ name: "steps", type: "uint256", internalType: "uint256" }],
  },
  {
    type: "error",
    name: "ReservePriceBelowMinimum",
    inputs: [
      { name: "provided", type: "uint256", internalType: "uint256" },
      { name: "minimum", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "PricingStepsExceedAuctionBlocks",
    inputs: [
      { name: "pricingSteps", type: "uint256", internalType: "uint256" },
      { name: "auctionBlocks", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "NotPlatformAdmin",
    inputs: [],
  },
  {
    type: "error",
    name: "ZeroAddress",
    inputs: [],
  },
] as const;

// ============================================
// TallyLaunchOrchestrator ABI
// ============================================
export const TALLY_LAUNCH_ORCHESTRATOR_ABI = [
  // --- View: individual fields ---
  {
    type: "function",
    name: "operator",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "state",
    inputs: [],
    outputs: [{ name: "", type: "uint8", internalType: "enum LaunchState" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "token",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "paymentToken",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tokenAmount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "auctionDuration",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "launchId",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tokenSource",
    inputs: [],
    outputs: [{ name: "", type: "uint8", internalType: "enum TokenSource" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "auctionEndTime",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "distributionDelay",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "distributionTimestamp",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  // --- View: struct-returning ---
  {
    type: "function",
    name: "getLaunchInfo",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct LaunchInfo",
        components: [
          { name: "launchId", type: "uint256", internalType: "uint256" },
          { name: "launcher", type: "address", internalType: "address" },
          { name: "token", type: "address", internalType: "address" },
          { name: "paymentToken", type: "address", internalType: "address" },
          { name: "operator", type: "address", internalType: "address" },
          { name: "treasury", type: "address", internalType: "address" },
          { name: "state", type: "uint8", internalType: "enum LaunchState" },
          { name: "auctionDuration", type: "uint256", internalType: "uint256" },
          { name: "pricingSteps", type: "uint256", internalType: "uint256" },
          { name: "reservePrice", type: "uint256", internalType: "uint256" },
          { name: "startTime", type: "uint256", internalType: "uint256" },
          { name: "liquidityAllocation", type: "uint256", internalType: "uint256" },
          { name: "treasuryAllocation", type: "uint256", internalType: "uint256" },
          { name: "poolFeeTier", type: "uint24", internalType: "uint24" },
          { name: "tickSpacing", type: "int24", internalType: "int24" },
          { name: "lockupDuration", type: "uint256", internalType: "uint256" },
          { name: "unlockTime", type: "uint256", internalType: "uint256" },
          { name: "positionBeneficiary", type: "address", internalType: "address" },
          { name: "platformFeeOnLPFees", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDistributionState",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct DistributionInfo",
        components: [
          { name: "totalRaised", type: "uint256", internalType: "uint256" },
          { name: "tokensSold", type: "uint256", internalType: "uint256" },
          { name: "treasuryPaid", type: "uint256", internalType: "uint256" },
          { name: "liquidityCreated", type: "uint256", internalType: "uint256" },
          { name: "liquidityComplete", type: "bool", internalType: "bool" },
          { name: "treasuryComplete", type: "bool", internalType: "bool" },
          { name: "cca", type: "address", internalType: "address" },
          { name: "lockupContract", type: "address", internalType: "address" },
          { name: "positionTokenId", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAuctionInfo",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct AuctionInfo",
        components: [
          { name: "cca", type: "address", internalType: "address" },
          { name: "startTime", type: "uint256", internalType: "uint256" },
          { name: "endTime", type: "uint256", internalType: "uint256" },
          { name: "currentPrice", type: "uint256", internalType: "uint256" },
          { name: "reservePrice", type: "uint256", internalType: "uint256" },
          { name: "tokensSold", type: "uint256", internalType: "uint256" },
          { name: "totalRaised", type: "uint256", internalType: "uint256" },
          { name: "isActive", type: "bool", internalType: "bool" },
          { name: "hasEnded", type: "bool", internalType: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isDistributionPermissionless",
    inputs: [],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isUnlocked",
    inputs: [],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pendingOperator",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  // --- State-changing functions ---
  {
    type: "function",
    name: "finalizeSetup",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "startAuction",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "distributeLiquidity",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "distributeTreasury",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "distributeAll",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "finalizeFailedAuction",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "sweepToken",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "sweepPaymentToken",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawPosition",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOperator",
    inputs: [{ name: "newOperator", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "acceptOperator",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "liquidityManager",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "updateLiquidityManager",
    inputs: [{ name: "newManager", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

// ============================================
// ERC20 MINIMAL ABI (for balance/allowance reads)
// ============================================
export const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "spender", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
] as const;

// ============================================
// ACCESS CONTROL ABI (for hasRole checks)
// ============================================
export const ACCESS_CONTROL_ABI = [
  {
    type: "function",
    name: "hasRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
] as const;

// keccak256("MINTER_ROLE")
export const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6" as const;
