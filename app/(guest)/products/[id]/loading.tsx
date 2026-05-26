export default function Loading() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,245,245,0.96),_rgba(234,240,226,0.8)_38%,_#ffffff_72%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="h-5 w-36 animate-pulse rounded-full bg-[#e7ecde]" />

        <div className="mt-5 overflow-hidden rounded-[2rem] border border-[#dde4d1] bg-white p-5 shadow-[0_28px_90px_-52px_rgba(31,41,18,0.18)] lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid gap-4 md:grid-cols-[88px_minmax(0,1fr)]">
              <div className="order-2 flex gap-3 md:order-1 md:flex-col">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-20 w-20 animate-pulse rounded-[1.1rem] bg-[#eef2e8]" />
                ))}
              </div>
              <div className="order-1 min-h-[360px] animate-pulse rounded-[1.8rem] bg-[#f1f5eb] md:order-2 lg:min-h-[520px]" />
            </div>

            <div className="space-y-5">
              <div className="h-6 w-28 animate-pulse rounded-full bg-[#eef2e8]" />
              <div className="h-16 w-full max-w-2xl animate-pulse rounded-[1.4rem] bg-[#f1f5eb]" />
              <div className="h-5 w-64 animate-pulse rounded-full bg-[#eef2e8]" />
              <div className="h-44 animate-pulse rounded-[1.6rem] bg-[#f5f8f1]" />
              <div className="grid gap-5 md:grid-cols-2">
                <div className="h-14 animate-pulse rounded-2xl bg-[#f1f5eb]" />
                <div className="h-14 animate-pulse rounded-2xl bg-[#f1f5eb]" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="h-12 animate-pulse rounded-full bg-[#eef2e8]" />
                <div className="h-12 animate-pulse rounded-full bg-[#dce6cd]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
