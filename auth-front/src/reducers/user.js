/* 초기 상태 선언 */
export const initialState = {
  userInfo: null,
};

/* 액션 타입 만들기 */
const LOGIN_USER = 'user/LOGIN_USER';
const LOGOUT_USER = 'user/LOGOUT_USER';

/* 액션 만들기 함수 */
export const login = (user) => ({
  type: LOGIN_USER,
  data: user
});

export const logout = () => ({
  type: LOGOUT_USER
});

/* 리듀서 선언 */
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, userInfo: action.data };

    case LOGOUT_USER:
      return { ...state, userInfo: null };

    default:
      return state;
  }
}

export default userReducer;