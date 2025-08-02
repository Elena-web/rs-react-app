import reducer, {
  toggleSelection,
  clearSelection,
  type SelectionState,
} from './selectionSlice';

const initialState: SelectionState = {
  selectedIds: [],
};

describe('selectionSlice', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should add an id when it is not selected (toggle on)', () => {
    const state = initialState;
    const nextState = reducer(state, toggleSelection('123'));

    expect(nextState.selectedIds).toContain('123');
    expect(nextState.selectedIds).toHaveLength(1);
  });

  it('should remove an id when it is already selected (toggle off)', () => {
    const stateWithId: SelectionState = {
      selectedIds: ['123'],
    };
    const nextState = reducer(stateWithId, toggleSelection('123'));

    expect(nextState.selectedIds).not.toContain('123');
    expect(nextState.selectedIds).toHaveLength(0);
  });

  it('should correctly toggle the same id multiple times', () => {
    let state = initialState;

    state = reducer(state, toggleSelection('456'));
    expect(state.selectedIds).toEqual(['456']);

    state = reducer(state, toggleSelection('456'));
    expect(state.selectedIds).toEqual([]);

    state = reducer(state, toggleSelection('456'));
    expect(state.selectedIds).toEqual(['456']);
  });

  it('should handle multiple different ids independently', () => {
    let state = initialState;

    state = reducer(state, toggleSelection('A'));
    state = reducer(state, toggleSelection('B'));
    expect(state.selectedIds).toEqual(['A', 'B']);

    state = reducer(state, toggleSelection('A'));
    expect(state.selectedIds).toEqual(['B']);

    state = reducer(state, toggleSelection('C'));
    expect(state.selectedIds).toEqual(['B', 'C']);
  });

  it('should preserve the order of selection', () => {
    let state = initialState;

    state = reducer(state, toggleSelection('first'));
    state = reducer(state, toggleSelection('second'));
    state = reducer(state, toggleSelection('third'));

    expect(state.selectedIds).toEqual(['first', 'second', 'third']);
  });

  it('should not duplicate an id when toggled on twice', () => {
    let state = initialState;

    state = reducer(state, toggleSelection('789'));
    expect(state.selectedIds).toContain('789');

    state = reducer(state, toggleSelection('789'));
    expect(state.selectedIds).not.toContain('789');
    expect(state.selectedIds).toHaveLength(0);
  });

  it('should clear all selected ids when clearSelection is dispatched', () => {
    const populatedState: SelectionState = {
      selectedIds: ['1', '2', '3'],
    };
    const nextState = reducer(populatedState, clearSelection());

    expect(nextState.selectedIds).toEqual([]);
  });

  it('should handle clearSelection on an already empty state', () => {
    const nextState = reducer(initialState, clearSelection());

    expect(nextState.selectedIds).toEqual([]);
  });

  it('should not modify state on unknown action', () => {
    const stateBefore = { selectedIds: ['x', 'y'] };
    const action = { type: 'SOME_UNKNOWN_ACTION' };

    const nextState = reducer(stateBefore, action);

    expect(nextState).toEqual(stateBefore);
    expect(nextState.selectedIds).toEqual(['x', 'y']);
  });
});
