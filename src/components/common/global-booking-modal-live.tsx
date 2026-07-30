import { GlobalBookingModal } from "@/components/common/global-booking-modal";
import { getPublicIndustryOptions } from "@/lib/api/industries";

export async function LiveGlobalBookingModal() {
  const industries = await getPublicIndustryOptions();
  return <GlobalBookingModal industries={industries} />;
}
