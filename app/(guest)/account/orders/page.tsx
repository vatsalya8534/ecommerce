import { CustomerOrdersPage } from "@/components/customer-orders-page";
import { GuestAccessPrompt } from "@/components/guest-access-prompt";
import { getCurrentUser } from "@/lib/auth";

export default async function AccountOrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,_#f7faf3_0%,_#ffffff_45%,_#f4f7ef_100%)] px-4 py-10 sm:px-6 lg:px-8">
        <GuestAccessPrompt
          title="Sign in to view your orders"
          description="Your cart and checkout data will appear in your account history after you sign in. Create an account or log in to continue."
          primaryLabel="Log in"
          secondaryLabel="Sign up"
          primaryHref="/login?mode=login&redirect=/account/orders"
          secondaryHref="/login?mode=signup&redirect=/account/orders"
        />
      </div>
    );
  }

  return <CustomerOrdersPage user={user} />;
}
