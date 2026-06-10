import { CustomerOrderDetailPage } from "@/components/customer-order-detail-page";
import { GuestAccessPrompt } from "@/components/guest-access-prompt";
import { getCurrentUser } from "@/lib/auth";

export default async function OrderDetailRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  const { id } = await params;

  if (!user) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,_#f7faf3_0%,_#ffffff_45%,_#f4f7ef_100%)] px-4 py-10 sm:px-6 lg:px-8">
        <GuestAccessPrompt
          title="Sign in to view order details"
          description="Your placed orders stay in your account history. Log in to open the full detail page for this order."
          primaryLabel="Log in"
          secondaryLabel="Create account"
          primaryHref={`/login?mode=login&redirect=/account/orders/${id}`}
          secondaryHref={`/login?mode=signup&redirect=/account/orders/${id}`}
        />
      </div>
    );
  }

  return <CustomerOrderDetailPage user={user} orderId={id} />;
}
