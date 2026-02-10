"use client";

import { LaunchForm } from "@/components/launch-form";

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default function NewLaunchPage() {
  return (
    <>
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
    </>
  );
}
