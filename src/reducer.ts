export const initialState = {};

export const actionTypes = {
  SET_USER: "SET_USER",
  SET_MESSAGES: "SET_MESSAGES",
  SET_SERACH: "SET_SEARCH",
  SET_SCROLL: "SET_SCROLL",
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_MESSAGES:
      return {
        ...state,
        messages: action.messages,
      };
    case actionTypes.SET_SERACH:
      return {
        ...state,
        search: action.search,
      };
    case actionTypes.SET_SCROLL:
      return {
        ...state,
        scroll: action.scroll,
      };

    default:
      return console.log("Default case in reduer.ts has been met.");
  }
};

export default reducer;
