"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useChainId } from "wagmi";
import { TALLY_LAUNCH_FACTORY_ADDRESSES } from "@/config/contracts";
import { ZERO_ADDRESS } from "@/lib/utils";
import { AlertCircle, Rocket, Github, Plus, List, Globe } from "lucide-react";

const NAV_ITEMS = [
  { label: "New Launch", href: "/new", icon: Plus },
  { label: "All Launches", href: "/launches", icon: Globe },
] as const;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const pathname = usePathname();
  const contractAddress = TALLY_LAUNCH_FACTORY_ADDRESSES[chainId];
  const isDeployed = !!contractAddress && contractAddress !== ZERO_ADDRESS;

  const navItems = [
    ...NAV_ITEMS,
    ...(isConnected
      ? [{ label: "My Launches", href: "/my-launches", icon: List } as const]
      : []),
  ];

  function isActive(href: string) {
    if (href === "/launches") {
      return pathname === "/launches" || pathname.startsWith("/launches/");
    }
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/launches" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Tally Launch</span>
          </Link>

          <div className="flex items-center gap-4">
            {!isDeployed && (
              <div className="hidden sm:flex items-center gap-2 rounded-lg bg-amber-100 px-3 py-1.5 text-sm text-amber-800">
                <AlertCircle className="h-4 w-4" />
                Contract not deployed on this network
              </div>
            )}
            <appkit-button balance="hide" />
          </div>
        </div>
      </header>

      {/* Mobile tabs */}
      <div className="md:hidden w-full border-b bg-muted/30">
        <div className="flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                isActive(item.href)
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile */}
        <aside className="hidden md:flex w-60 flex-col border-r bg-muted/30 p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
            {/* Network Warning */}
            {!isDeployed && (
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

            {children}
          </div>
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
