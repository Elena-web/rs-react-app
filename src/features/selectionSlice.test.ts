import reducer, {
  toggleSelection,
  clearSelection,
  type SelectionState,
  type CatCard,
} from './selectionSlice';

const initialState: SelectionState = {
  selectedIds: [],
  selectedItems: {},
};

const exampleCard: CatCard = {
  id: '123',
  imageId: 'img123',
  imageUrl: 'https://example.com/img123.jpg',
  title: 'Example Cat',
  detailsUrl: 'https://example.com/details/123',
};

describe('selectionSlice', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should add a card when it is not selected (toggle on)', () => {
    const state = initialState;
    const nextState = reducer(state, toggleSelection(exampleCard));

    expect(nextState.selectedIds).toContain(exampleCard.id);
    expect(nextState.selectedItems[exampleCard.id]).toEqual(exampleCard);
    expect(nextState.selectedIds).toHaveLength(1);
  });

  it('should remove a card when it is already selected (toggle off)', () => {
    const stateWithCard: SelectionState = {
      selectedIds: [exampleCard.id],
      selectedItems: { [exampleCard.id]: exampleCard },
    };
    const nextState = reducer(stateWithCard, toggleSelection(exampleCard));

    expect(nextState.selectedIds).not.toContain(exampleCard.id);
    expect(nextState.selectedItems[exampleCard.id]).toBeUndefined();
    expect(nextState.selectedIds).toHaveLength(0);
  });

  it('should correctly toggle the same card multiple times', () => {
    let state = initialState;

    state = reducer(state, toggleSelection(exampleCard));
    expect(state.selectedIds).toEqual([exampleCard.id]);

    state = reducer(state, toggleSelection(exampleCard));
    expect(state.selectedIds).toEqual([]);

    state = reducer(state, toggleSelection(exampleCard));
    expect(state.selectedIds).toEqual([exampleCard.id]);
  });

  it('should clear all selections when clearSelection is dispatched', () => {
    const populatedState: SelectionState = {
      selectedIds: [exampleCard.id],
      selectedItems: { [exampleCard.id]: exampleCard },
    };
    const nextState = reducer(populatedState, clearSelection());

    expect(nextState.selectedIds).toEqual([]);
    expect(nextState.selectedItems).toEqual({});
  });
});
