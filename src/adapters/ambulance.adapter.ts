import { Ambulance, BackendAmbulance } from "@/types/ambulance.type";

export const ambulanceAdapter = (raw: BackendAmbulance): Ambulance => {
  const city = raw.city;
  const cityObj = typeof city === "object" ? city : null;

  return {
    id: raw._id,
    name: raw.name,
    city: cityObj?.name ?? "",
    cityId: cityObj?._id ?? (typeof city === "string" ? city : ""),
    drivingLicenseNumber: raw.driving_license_number,
    ambulanceType: raw.ambulance_type,
    ambulanceNumber: raw.ambulance_number,
    status: raw.status,
  };
};

export const ambulancesAdapter = (raws: BackendAmbulance[]): Ambulance[] =>
  raws.map(ambulanceAdapter);
