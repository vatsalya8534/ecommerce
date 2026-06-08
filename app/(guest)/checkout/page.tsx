import { CheckoutPage } from "@/components/checkout-page";
import { GuestAccessPrompt } from "@/components/guest-access-prompt";
import { getCurrentUser } from "@/lib/auth";

export default async function CheckoutRoutePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,_#f7faf3_0%,_#ffffff_45%,_#f4f7ef_100%)] px-4 py-10 sm:px-6 lg:px-8">
        <GuestAccessPrompt
          title="Sign in to complete checkout"
          description="Your cart is saved already. Sign in or create an account to place the order, keep your history, and view it in Orders."
          primaryLabel="Log in to checkout"
          secondaryLabel="Create account"
          primaryHref="/login?mode=login&redirect=/checkout"
          secondaryHref="/login?mode=signup&redirect=/checkout"
        />
      </div>
    );
  }

  return <CheckoutPage user={user} />;
}
