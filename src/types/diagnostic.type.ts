// Backend shape from GET /diagnostic-tests/public
export type BackendDiagnosticTest = {
  _id: string;
  name: string;
  description: string;
  price_start_from: number;
  createdAt: string;
  updatedAt: string;
};

// Frontend normalized shape
export type DiagnosticTest = {
  id: string;
  name: string;
  description: string;
  priceStartFrom: number;
};

// Backend shape from GET /labs/public
export type BackendLab = {
  _id: string;
  name: string;
  description: string;
  hotline: string;
  logo: string;
  address: string;
  about: string;
  city: { _id: string; name: string } | string;
  tests: string[];
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
};

// Frontend normalized shape
export type Lab = {
  id: string;
  name: string;
  description: string;
  hotline: string;
  logo: string;
  address: string;
  about: string;
  city: string;
  cityId: string;
  tests: string[];
};

// Diagnostic Booking payload for POST /diagnostic-bookings
export type DiagnosticBookingPayload = {
  test: string;   // test ObjectId
  lab: string;    // lab ObjectId
  address: string;
  phone: string;
  price: number;
  preferred_date_time?: string; // ISO string
};
