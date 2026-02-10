"use client";

import React from "react";
import { Address } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LaunchState } from "@/config/contracts";
import { ActionButton } from "./ActionButton";
import { PreconditionChecklist } from "./PreconditionChecklist";
import type { PreconditionCheck } from "./types";

interface ActionsPanelProps {
  address: Address;
  currentState: LaunchState;
  connectedAddress: Address | undefined;
  isOperator: boolean;
  isPermissionless: boolean | undefined;
  auctionTimeElapsed: boolean;
  preconditionsByAction: Record<string, PreconditionCheck[]>;
  onRefresh: () => void;
}

export function ActionsPanel({
  address,
  currentState,
  connectedAddress,
  isOperator,
  isPermissionless,
  auctionTimeElapsed,
  preconditionsByAction,
  onRefresh,
}: ActionsPanelProps) {
  const sections: React.ReactElement[] = [];

  // SETUP -> Finalize Setup
  if (connectedAddress && currentState === LaunchState.SETUP) {
    sections.push(
      <div key="finalize-setup" className="space-y-2">
        {preconditionsByAction["finalizeSetup"] && (
          <PreconditionChecklist
            checks={preconditionsByAction["finalizeSetup"]}
            action="Finalize Setup"
          />
        )}
        <ActionButton
          disabled={!isOperator}
          label="Finalize Setup"
          functionName="finalizeSetup"
          contractAddress={address}
          onSuccess={onRefresh}
          simulatable
        />
      </div>
    );
  }

  // FINALIZED -> Start Auction
  if (connectedAddress && currentState === LaunchState.FINALIZED) {
    sections.push(
      <div key="start-auction" className="space-y-2">
        {preconditionsByAction["startAuction"] && (
          <PreconditionChecklist
            checks={preconditionsByAction["startAuction"]}
            action="Start Auction"
          />
        )}
        <ActionButton
          disabled={!isOperator}
          label="Start Auction"
          functionName="startAuction"
          contractAddress={address}
          gas={BigInt(15_000_000)}
          onSuccess={onRefresh}
          simulatable
        />
      </div>
    );
  }

  // AUCTION_ENDED (or AUCTION_ACTIVE with time elapsed) -> distribution actions
  if (currentState === LaunchState.AUCTION_ENDED || auctionTimeElapsed) {
    const canAct = isOperator || isPermissionless;

    if (canAct) {
      sections.push(
        <div key="distribute-group" className="space-y-3">
          {preconditionsByAction["distributeAll"] && (
            <PreconditionChecklist
              checks={preconditionsByAction["distributeAll"]}
              action="Distribution"
            />
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <ActionButton
              label="Distribute All"
              functionName="distributeAll"
              contractAddress={address}
              onSuccess={onRefresh}
            />
            <ActionButton
              label="Distribute Liquidity"
              functionName="distributeLiquidity"
              contractAddress={address}
              variant="outline"
              onSuccess={onRefresh}
            />
          </div>
          {preconditionsByAction["distributeTreasury"] && (
            <PreconditionChecklist
              checks={[
                preconditionsByAction["distributeTreasury"].find(
                  (c) => c.id === "liquidity-complete"
                )!,
              ].filter(Boolean)}
              action="Distribute Treasury"
            />
          )}
          <ActionButton
            label="Distribute Treasury"
            functionName="distributeTreasury"
            contractAddress={address}
            variant="outline"
            onSuccess={onRefresh}
          />
        </div>
      );
    }

    // Finalize failed auction
    sections.push(
      <div key="finalize-failed" className="space-y-2">
        {preconditionsByAction["finalizeFailedAuction"] && (
          <PreconditionChecklist
            checks={preconditionsByAction["finalizeFailedAuction"]}
            action="Finalize Failed Auction"
          />
        )}
        <ActionButton
          label="Finalize Failed Auction"
          functionName="finalizeFailedAuction"
          contractAddress={address}
          variant="destructive"
          onSuccess={onRefresh}
        />
      </div>
    );
  }

  // DISTRIBUTED / LOCKED / UNLOCKED -> sweep + withdraw
  if (
    currentState === LaunchState.DISTRIBUTED ||
    currentState === LaunchState.LOCKED ||
    currentState === LaunchState.UNLOCKED
  ) {
    if (isOperator) {
      sections.push(
        <div key="sweep-group" className="grid gap-3 sm:grid-cols-2">
          <ActionButton
            label="Sweep Token"
            functionName="sweepToken"
            contractAddress={address}
            variant="outline"
            onSuccess={onRefresh}
          />
          <ActionButton
            label="Sweep Payment Token"
            functionName="sweepPaymentToken"
            contractAddress={address}
            variant="outline"
            onSuccess={onRefresh}
          />
        </div>
      );
    }
    if (currentState === LaunchState.LOCKED && connectedAddress) {
      sections.push(
        <div key="withdraw-position" className="space-y-2">
          {preconditionsByAction["withdrawPosition"] && (
            <PreconditionChecklist
              checks={preconditionsByAction["withdrawPosition"]}
              action="Withdraw Position"
            />
          )}
          <ActionButton
            disabled={!isOperator}
            label="Withdraw Position"
            functionName="withdrawPosition"
            contractAddress={address}
            onSuccess={onRefresh}
          />
        </div>
      );
    }
  }

  // Empty state messages
  if (sections.length === 0) {
    if (currentState === LaunchState.AUCTION_ACTIVE && !auctionTimeElapsed) {
      return (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Auction is in progress. No actions available until it ends.
            </p>
          </CardContent>
        </Card>
      );
    }
    if (currentState === LaunchState.AUCTION_FAILED) {
      return (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This auction has failed. No further actions are available.
            </p>
          </CardContent>
        </Card>
      );
    }
    if (!connectedAddress) {
      return (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Connect your wallet to perform actions on this launch.
            </p>
            <div>
              <appkit-button balance="hide" />
            </div>
          </CardContent>
        </Card>
      );
    }
    if (!isOperator) {
      return (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Only the operator can perform actions in this state.
            </p>
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">{sections}</div>
      </CardContent>
    </Card>
  );
}
