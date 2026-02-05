"use client";

import { LaunchForm } from "@/components/LaunchForm";
import { useAccount, useChainId } from "wagmi";
import { TALLY_LAUNCH_FACTORY_ADDRESSES } from "@/config/contracts";
import { AlertCircle, Rocket, Github } from "lucide-react";

export default function Home() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const contractAddress = TALLY_LAUNCH_FACTORY_ADDRESSES[chainId];
  const isDeployed = contractAddress && contractAddress !== "0x0000000000000000000000000000000000000000";

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Tally Launch</span>
          </div>

          <div className="flex items-center gap-4">
            {isConnected && !isDeployed && (
              <div className="hidden sm:flex items-center gap-2 rounded-lg bg-amber-100 px-3 py-1.5 text-sm text-amber-800">
                <AlertCircle className="h-4 w-4" />
                Contract not deployed on this network
              </div>
            )}
            <appkit-button />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Launch Your Token
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Deploy token launches using TallyLaunchFactory on Uniswap V4.
            Configure auction parameters, allocation splits, and pool settings.
          </p>
        </div>

        {/* Network Warning */}
        {isConnected && !isDeployed && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Network Not Supported</h3>
                <p className="text-sm text-amber-700 mt-1">
                  TallyLaunchFactory is not deployed on this network. Please switch to a supported network
                  (Mainnet, Sepolia, Base, or Base Sepolia) and update the contract address in the config.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Launch Form */}
        <LaunchForm />

        {/* Info Cards */}
        <div className="max-w-2xl mx-auto mt-12 grid gap-4 sm:grid-cols-2">
          <InfoCard
            title="Fair Price Discovery"
            description="Continuous clearing auctions eliminate timing games and establish credible market prices."
          />
          <InfoCard
            title="Immediate Liquidity"
            description="Seamless transition from price discovery to active Uniswap V4 trading."
          />
          <InfoCard
            title="Permissionless"
            description="Anyone can bootstrap liquidity or participate without gatekeepers."
          />
          <InfoCard
            title="Transparent"
            description="All parameters are immutable and verifiable on-chain."
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Built with TallyLaunchFactory & Uniswap V4
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/withtally"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://docs.uniswap.org/contracts/liquidity-launchpad/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentation
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
