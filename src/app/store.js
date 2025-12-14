import { configureStore } from "@reduxjs/toolkit";
import billingReducer from "../features/billing/billingSlice";

const STORAGE_KEY = "cloud_kitchen_billing_state_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export const store = configureStore({
  reducer: { billing: billingReducer },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState({ billing: store.getState().billing });
});