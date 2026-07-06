import { PolicyLayout } from "@/components/policy-layout";

export const metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy">
      <p>Last updated: July 2026</p>
      <p>
        We currently ship across India via our logistics partners, with delivery typically taking
        3-7 business days depending on your location. Orders above ₹2000 ship free; a flat ₹99
        shipping fee applies below that threshold.
      </p>
      <p>
        All orders are Cash on Delivery — pay in cash to the delivery agent when your package
        arrives. Please keep your phone reachable, as our courier partner may call to confirm
        delivery details.
      </p>
      <p>
        Once your order ships, you can track its status any time from the Orders section of your
        account.
      </p>
    </PolicyLayout>
  );
}
