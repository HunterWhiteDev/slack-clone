export const initialState = {
  user: {
    displayName: "live_demo_test_account",
    photoURL: "https://miro.medium.com/max/875/1*0FqDC0_r1f5xFz3IywLYRA.jpeg",
  },
};

export const actionTypes = {
  SET_USER: "SET_USER",
};

const reducer = (state, action) => {
  console.log(action);

  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
  }
};

export default reducer;
