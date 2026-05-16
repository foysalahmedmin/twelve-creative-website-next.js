export interface BackendGuideBooking {
  _id: string;
  customer: any;
  city: any;
  hospital: any;
  age: number;
  description: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface TGuideBooking {
  id: string;
  customerId: string;
  cityId: string;
  cityName?: string;
  hospitalId: string;
  hospitalName?: string;
  age: number;
  description: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  date: string;
}

export interface TCreateGuideBookingPayload {
  city: string;
  hospital: string;
  age: number;
  description: string;
}
