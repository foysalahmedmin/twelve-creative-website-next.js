import { GlobalBookingModal } from "@/components/common/global-booking-modal";
import { getPublicBookingSetting } from "@/lib/api/booking-settings";
import { getPublicIndustryOptions } from "@/lib/api/industries";

export async function LiveGlobalBookingModal() {
  const [industries, booking] = await Promise.all([
    getPublicIndustryOptions(),
    getPublicBookingSetting(),
  ]);
  return <GlobalBookingModal industries={industries} booking={booking} />;
}
