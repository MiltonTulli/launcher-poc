import { ExternalLink } from "lucide-react";
import { shortenAddress } from "@/lib/utils";

interface InfoRowProps {
  label: string;
  value: string;
  isAddress?: boolean;
  explorerUrl?: string;
}

export function InfoRow({ label, value, isAddress: isAddr, explorerUrl }: InfoRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-border last:border-0 gap-1 sm:gap-4">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      {isAddr && explorerUrl ? (
        <a
          href={`${explorerUrl}/address/${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-mono text-xs text-primary hover:underline truncate"
        >
          {shortenAddress(value)}
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      ) : (
        <span className="text-sm font-medium text-foreground text-right truncate">{value}</span>
      )}
    </div>
  );
}
