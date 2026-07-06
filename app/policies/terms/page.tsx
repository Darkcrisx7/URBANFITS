import { PolicyLayout } from "@/components/policy-layout";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms of Service">
      <p>Last updated: July 2026</p>
      <p>
        By placing an order on UrbanFits.Store you agree to provide accurate delivery information and
        to be present (or arrange for someone) to accept the Cash on Delivery payment when your order
        arrives.
      </p>
      <p>
        Product prices, availability, and promotional offers are subject to change without notice.
        Coupons cannot be combined unless explicitly stated.
      </p>
      <p>
        We reserve the right to cancel orders in cases of suspected fraud, repeated failed deliveries,
        or stock unavailability, in which case you will be notified by email or phone.
      </p>
    </PolicyLayout>
  );
}
