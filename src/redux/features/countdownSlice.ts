// redux/slices/countdownSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CountdownState {
  nextSlotTime: number | null;
}

const initialState: CountdownState = {
  nextSlotTime: null,
};

const countdownSlice = createSlice({
  name: "countdown",
  initialState,
  reducers: {
    setNextSlotTime(state, action: PayloadAction<number>) {
      state.nextSlotTime = action.payload;
    },
    clearNextSlotTime(state) {
      state.nextSlotTime = null;
    },
  },
});

export const { setNextSlotTime, clearNextSlotTime } = countdownSlice.actions;
export default countdownSlice.reducer;
