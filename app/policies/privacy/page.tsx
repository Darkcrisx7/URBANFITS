import { PolicyLayout } from "@/components/policy-layout";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy">
      <p>Last updated: July 2026</p>
      <p>
        UrbanFits.Store collects the information you provide at checkout — name, email, phone number,
        and delivery address — solely to process and deliver your order. We do not sell customer data
        to third parties.
      </p>
      <p>
        Account details are stored securely and used only to manage your orders, wishlist, and saved
        addresses. You can request deletion of your account and associated data at any time by
        contacting support@urbanfits.store.
      </p>
      <p>
        We use cookies and local storage to remember your cart and preferences between visits. No
        payment card details are ever stored on our servers.
      </p>
    </PolicyLayout>
  );
}
