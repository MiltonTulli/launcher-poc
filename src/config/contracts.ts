import { Address } from "viem";

// TallyLaunchFactory ABI - extracted from the contract
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
          { name: "tokenAmount", type: "uint256", internalType: "uint256" },
          { name: "auctionDuration", type: "uint256", internalType: "uint256" },
          { name: "pricingSteps", type: "uint256", internalType: "uint256" },
          { name: "reservePrice", type: "uint256", internalType: "uint256" },
          { name: "liquidityAllocation", type: "uint256", internalType: "uint256" },
          { name: "treasuryAllocation", type: "uint256", internalType: "uint256" },
          { name: "poolFeeTier", type: "uint24", internalType: "uint24" },
          { name: "lockupDuration", type: "uint256", internalType: "uint256" },
          { name: "distributionDelay", type: "uint256", internalType: "uint256" },
          { name: "treasury", type: "address", internalType: "address" },
          { name: "positionBeneficiary", type: "address", internalType: "address" },
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
    name: "getAllLaunches",
    inputs: [],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
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
    name: "InvalidReservePrice",
    inputs: [{ name: "price", type: "uint256", internalType: "uint256" }],
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

// Contract addresses per network
export const TALLY_LAUNCH_FACTORY_ADDRESSES: Record<number, Address> = {
  1: "0x0000000000000000000000000000000000000000", // Mainnet - TBD
  11155111: "0x6f32468767bbb1bc4516fa50420fd14c75c26d60", // Sepolia - TBD
  8453: "0x0000000000000000000000000000000000000000", // Base - TBD
  84532: "0x0000000000000000000000000000000000000000", // Base Sepolia - TBD
};

// Pool fee tiers
export const POOL_FEE_TIERS = [
  { value: 100, label: "0.01% - Stablecoins" },
  { value: 500, label: "0.05% - Correlated pairs" },
  { value: 3000, label: "0.30% - Standard" },
  { value: 10000, label: "1.00% - Exotic pairs" },
] as const;

// Validation constants (from contract)
export const LAUNCH_CONSTRAINTS = {
  MIN_AUCTION_DURATION: 3600, // 1 hour in seconds
  MAX_AUCTION_DURATION: 2592000, // 30 days in seconds
  MIN_PRICING_STEPS: 1,
  MAX_PRICING_STEPS: 1000,
  MAX_LOCKUP_DURATION: 63072000, // 730 days (2 years) in seconds
  MAX_DISTRIBUTION_DELAY: 2592000, // 30 days in seconds
  BASIS_POINTS: 10000,
} as const;

// LaunchParams type
export interface LaunchParams {
  tokenAmount: bigint;
  auctionDuration: bigint;
  pricingSteps: bigint;
  reservePrice: bigint;
  liquidityAllocation: bigint;
  treasuryAllocation: bigint;
  poolFeeTier: number;
  lockupDuration: bigint;
  distributionDelay: bigint;
  treasury: Address;
  positionBeneficiary: Address;
}

// Form values type (user-friendly)
export interface LaunchFormValues {
  token: string;
  paymentToken: string;
  operator: string;
  tokenAmount: string;
  auctionDurationDays: string;
  auctionDurationHours: string;
  pricingSteps: string;
  reservePrice: string;
  liquidityAllocationPercent: string;
  treasuryAllocationPercent: string;
  poolFeeTier: string;
  lockupDurationDays: string;
  distributionDelayDays: string;
  treasury: string;
  positionBeneficiary: string;
}

// Default form values
export const DEFAULT_FORM_VALUES: LaunchFormValues = {
  token: "",
  paymentToken: "",
  operator: "",
  tokenAmount: "",
  auctionDurationDays: "7",
  auctionDurationHours: "0",
  pricingSteps: "100",
  reservePrice: "",
  liquidityAllocationPercent: "80",
  treasuryAllocationPercent: "20",
  poolFeeTier: "3000",
  lockupDurationDays: "180",
  distributionDelayDays: "0",
  treasury: "",
  positionBeneficiary: "",
};
