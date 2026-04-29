import { Nav } from "@/components/nav";
import { LeaderboardSidebar } from "@/components/leaderboard-sidebar";
import { getCurrentUser, getLeaderboard } from "@/lib/dal";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, leaderboard] = await Promise.all([
    getCurrentUser(),
    getLeaderboard(10),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-background focus:shadow-md"
      >
        Skip to main content
      </a>
      <Nav user={user} />
      <div className="flex flex-1">
        <main
          id="main-content"
          className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 md:px-8"
        >
          {children}
        </main>
        <LeaderboardSidebar rows={leaderboard} currentUserId={user.id} />
      </div>
    </div>
  );
}
