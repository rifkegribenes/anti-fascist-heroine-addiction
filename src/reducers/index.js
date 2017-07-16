const initialState = {
  count: 1,
  auth: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_AUTH': {
      const updatedState = Object.assign({}, state);
      updatedState.auth = action.payload;
      return updatedState;
    }
    default: return state;
  }
};

export default reducer;
