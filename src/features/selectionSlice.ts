import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CatCard {
  id: string;
  imageId: string;
  imageUrl: string;
  title: string;
  description?: string;
  detailsUrl: string;
}

export interface SelectionState {
  selectedIds: string[];
  selectedItems: Record<string, CatCard>;
}

const initialState: SelectionState = {
  selectedIds: [],
  selectedItems: {},
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    toggleSelection(state, action: PayloadAction<CatCard>) {
      const card = action.payload;
      const id = card.id;

      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((i) => i !== id);
        const { [id]: _, ...rest } = state.selectedItems;
        state.selectedItems = rest;
      } else {
        state.selectedIds.push(id);
        state.selectedItems[id] = card;
      }
    },
    clearSelection(state) {
      state.selectedIds = [];
      state.selectedItems = {};
    },
  },
});

export const { toggleSelection, clearSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
