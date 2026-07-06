import { PolicyLayout } from "@/components/policy-layout";

export const metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <PolicyLayout title="Refund Policy">
      <p>Last updated: July 2026</p>
      <p>
        Since all orders are Cash on Delivery, refunds apply only to returned or exchanged items.
        Approved returns are refunded via bank transfer or store credit within 5-7 business days of
        the item reaching our warehouse.
      </p>
      <p>
        Items must be unworn, unwashed, and returned with original tags within 7 days of delivery.
        Final sale items marked as such at checkout are not eligible for return.
      </p>
      <p>To start a return, contact support@urbanfits.store with your order ID.</p>
    </PolicyLayout>
  );
}
