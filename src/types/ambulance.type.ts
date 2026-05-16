// Backend shape from GET /ambulances/public
export type BackendAmbulance = {
  _id: string;
  name: string;
  city: { _id: string; name: string } | string;
  driving_license_number: string;
  ambulance_type: string;
  ambulance_number: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
};

// Frontend normalized shape
export type Ambulance = {
  id: string;
  name: string;
  city: string;
  cityId: string;
  drivingLicenseNumber: string;
  ambulanceType: string;
  ambulanceNumber: string;
  status: "Active" | "Inactive";
};

// Ambulance Booking payload for POST /ambulance-bookings
export type AmbulanceBookingPayload = {
  from_address: string;
  to_address: string;
  isRoundTrip: boolean;
  date_time: string; // ISO string
  phone: string;
  ambulance_type: string;
};
