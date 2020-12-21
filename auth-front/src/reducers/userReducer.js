import { REGISTER_USER, LOGIN_USER, LOGOUT_USER } from '../utils/enum';

const userReducer = (state = {}, action) => {
  switch (action.type) {
    case REGISTER_USER:
      return { ...state, registerSuccess: action.payload };

    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };

    case LOGOUT_USER:
      return { ...state, logoutSuccess: action.payload };

    default:
      return state;
  }
}

export default userReducer;