"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useAccount, useChainId } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Rocket, RefreshCw, FileText, Trash2, Clock } from "lucide-react";
import Link from "next/link";
import { listDrafts, deleteDraft, type DraftIndexEntry } from "@/lib/drafts";
import { useLaunches } from "@/hooks/useLaunches";
import { LaunchCard } from "@/components/LaunchCard";
import { EXPLORER_URLS } from "@/lib/utils";

interface MyLaunchesProps {
  onNavigateToNewLaunch: () => void;
}

export function MyLaunches({ onNavigateToNewLaunch }: MyLaunchesProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const explorerUrl = EXPLORER_URLS[chainId] || "https://etherscan.io";

  // ============================================
  // Drafts from server
  // ============================================
  const [drafts, setDrafts] = useState<DraftIndexEntry[]>([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);

  const loadUserDrafts = useCallback(async () => {
    if (!address) {
      setDrafts([]);
      setIsLoadingDrafts(false);
      return;
    }
    setIsLoadingDrafts(true);
    try {
      const entries = await listDrafts(address);
      setDrafts(entries);
    } catch {
      setDrafts([]);
    } finally {
      setIsLoadingDrafts(false);
    }
  }, [address]);

  useEffect(() => {
    loadUserDrafts();
  }, [loadUserDrafts]);

  const handleDeleteDraft = useCallback(
    async (id: string) => {
      if (!address) return;
      await deleteDraft(id, address);
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    },
    [address]
  );

  // ============================================
  // On-chain launches
  // ============================================
  const { launches: allLaunches, isLoading: isLoadingLaunches, refetch } = useLaunches();

  const myLaunches = useMemo(() => {
    if (!address) return [];
    return allLaunches.filter(
      (l) => l.operator.toLowerCase() === address.toLowerCase()
    );
  }, [allLaunches, address]);

  // ============================================
  // Render
  // ============================================
  const isLoading = isLoadingLaunches || isLoadingDrafts;
  const hasContent = myLaunches.length > 0 || drafts.length > 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-muted-foreground">Loading your launches...</p>
      </div>
    );
  }

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Rocket className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">No launches yet</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm text-center">
          You haven&apos;t created any token launches or drafts. Get started by creating your first one.
        </p>
        <Button onClick={onNavigateToNewLaunch} className="mt-6">
          <Rocket className="h-4 w-4" />
          Create your first launch
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Launches</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {myLaunches.length} launch{myLaunches.length !== 1 ? "es" : ""}
            {drafts.length > 0 && `, ${drafts.length} draft${drafts.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            refetch();
            loadUserDrafts();
          }}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Drafts section */}
      {drafts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Drafts
          </h2>
          <div className="grid gap-3">
            {drafts.map((draft) => (
              <Card key={draft.id} className="border-dashed">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <CardTitle className="text-base">Draft</CardTitle>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      Draft
                    </span>
                  </div>
                  <CardDescription className="font-mono text-xs truncate">
                    {draft.id}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Saved</span>
                      <span className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        {new Date(draft.updatedAt || draft.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Chain</span>
                      <span className="text-xs">{draft.chainId}</span>
                    </div>
                    <div className="flex gap-2 pt-3">
                      <Link href={`/draft/${draft.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <FileText className="h-4 w-4" />
                          View Draft
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* On-chain launches section */}
      {myLaunches.length > 0 && (
        <div className="space-y-3">
          {drafts.length > 0 && (
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              On-chain Launches
            </h2>
          )}
          <div className="grid gap-4">
            {myLaunches.map((launch) => (
              <LaunchCard
                key={launch.orchestratorAddress}
                launch={launch}
                explorerUrl={explorerUrl}
                actionLabel="Manage"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
