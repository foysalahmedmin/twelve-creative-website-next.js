import { createSlice } from "@reduxjs/toolkit";

interface BookingModalState {
  isOpen: boolean;
}

const initialState: BookingModalState = {
  isOpen: false,
};

const bookingModalSlice = createSlice({
  name: "bookingModal",
  initialState,
  reducers: {
    openBookingModal: (state) => {
      state.isOpen = true;
    },
    closeBookingModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openBookingModal, closeBookingModal } =
  bookingModalSlice.actions;
export default bookingModalSlice.reducer;
