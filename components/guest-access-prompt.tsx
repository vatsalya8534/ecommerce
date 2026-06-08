import Link from "next/link";

type GuestAccessPromptProps = {
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function GuestAccessPrompt({
  title,
  description,
  primaryLabel = "Log in",
  primaryHref = "/login?mode=login",
  secondaryLabel = "Sign up",
  secondaryHref = "/login?mode=signup",
}: GuestAccessPromptProps) {
  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#dde4d1] bg-white p-6 shadow-[0_28px_90px_-52px_rgba(31,41,18,0.24)] sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#71805b]">
        Guest access
      </p>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-[#14190e]">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-8 text-[#5d6750]">
        {description}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={primaryHref}
          className="inline-flex items-center justify-center rounded-full bg-[#2f3b1d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#243015]"
        >
          {primaryLabel}
        </Link>
        <Link
          href={secondaryHref}
          className="inline-flex items-center justify-center rounded-full border border-[#cad2bb] px-6 py-3 text-sm font-semibold text-[#263118] transition hover:bg-[#f5f8ef]"
        >
          {secondaryLabel}
        </Link>
      </div>
    </div>
  );
}
