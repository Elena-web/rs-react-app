import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SelectionState {
  selectedIds: string[];
}

const initialState: SelectionState = {
  selectedIds: [],
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    toggleSelection(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((i) => i !== id);
      } else {
        state.selectedIds.push(id);
      }
    },
    clearSelection(state) {
      state.selectedIds = [];
    },
  },
});

export const { toggleSelection, clearSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
