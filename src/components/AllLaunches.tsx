"use client";

import { useChainId } from "wagmi";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Globe, RefreshCw } from "lucide-react";
import { useLaunches } from "@/hooks/useLaunches";
import { LaunchCard } from "@/components/LaunchCard";
import { EXPLORER_URLS } from "@/lib/utils";

export function AllLaunches() {
  const chainId = useChainId();
  const explorerUrl = EXPLORER_URLS[chainId] || "https://etherscan.io";
  const { launches, isLoading, refetch } = useLaunches();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-muted-foreground">Loading launches...</p>
      </div>
    );
  }

  if (launches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Globe className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">No launches yet</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm text-center">
          No token launches have been created on this network yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Launches</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {launches.length} launch{launches.length !== 1 ? "es" : ""} on this network
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {launches.map((launch) => (
          <LaunchCard
            key={launch.orchestratorAddress}
            launch={launch}
            explorerUrl={explorerUrl}
            showOperator
          />
        ))}
      </div>
    </div>
  );
}
