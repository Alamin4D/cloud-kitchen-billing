import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  corporateBills: [],
  eventBills: [],
  invoiceSeq: 1,
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    addCorporateBill(state, action) {
      state.corporateBills.unshift(action.payload);
      state.invoiceSeq += 1;
    },
    updateCorporateBill(state, action) {
      const idx = state.corporateBills.findIndex((b) => b.id === action.payload.id);
      if (idx !== -1) state.corporateBills[idx] = action.payload;
    },
    deleteCorporateBill(state, action) {
      state.corporateBills = state.corporateBills.filter((b) => b.id !== action.payload);
    },

    addEventBill(state, action) {
      state.eventBills.unshift(action.payload);
      state.invoiceSeq += 1;
    },
    updateEventBill(state, action) {
      const idx = state.eventBills.findIndex((b) => b.id === action.payload.id);
      if (idx !== -1) state.eventBills[idx] = action.payload;
    },
    deleteEventBill(state, action) {
      state.eventBills = state.eventBills.filter((b) => b.id !== action.payload);
    },

    resetAll(state) {
      state.corporateBills = [];
      state.eventBills = [];
      state.invoiceSeq = 1;
    },
  },
});

export const {
  addCorporateBill,
  updateCorporateBill,
  deleteCorporateBill,
  addEventBill,
  updateEventBill,
  deleteEventBill,
  resetAll,
} = billingSlice.actions;

export default billingSlice.reducer;