import { BackendGuideBooking, TGuideBooking } from "@/types/guide.type";
import { format, parseISO } from "date-fns";

export const adaptGuideBooking = (backendData: BackendGuideBooking): TGuideBooking => {
  return {
    id: backendData._id,
    customerId: typeof backendData.customer === "object" ? backendData.customer?._id : backendData.customer,
    cityId: typeof backendData.city === "object" ? backendData.city?._id : backendData.city,
    cityName: typeof backendData.city === "object" ? backendData.city?.name : "",
    hospitalId: typeof backendData.hospital === "object" ? backendData.hospital?._id : backendData.hospital,
    hospitalName: typeof backendData.hospital === "object" ? backendData.hospital?.name : "",
    age: backendData.age,
    description: backendData.description,
    status: backendData.status,
    date: backendData.createdAt ? format(parseISO(backendData.createdAt), "dd MMM yyyy, p") : "-",
  };
};
