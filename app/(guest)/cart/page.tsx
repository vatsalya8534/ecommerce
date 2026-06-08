import { CartPage } from "@/components/cart-page";
import { getCurrentUser } from "@/lib/auth";

export default async function CartRoutePage() {
  const user = await getCurrentUser();

  return <CartPage isAuthenticated={Boolean(user)} />;
}
