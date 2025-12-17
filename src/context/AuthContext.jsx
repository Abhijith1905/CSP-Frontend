import React, { createContext, useContext, useReducer, useEffect } from 'react';
import cognitoAuth from '../services/cognitoAuth';

const AuthContext = createContext();

const initialState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        user: null,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return initialState;
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore user on mount
  useEffect(() => {
    const restore = async () => {
      dispatch({ type: 'AUTH_START' });
      try {
        const currentUser = await cognitoAuth.getCurrentUser();
        const groups = currentUser?.signInUserSession?.idToken?.payload?.['cognito:groups'] || [];
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { ...currentUser, groups },
        });
      } catch (err) {
        dispatch({ type: 'AUTH_FAILURE' });
      }
    };
    restore();
  }, []);

  // Login
  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { user, tokens } = await cognitoAuth.signIn(email, password);

      // Store tokens locally if needed
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('idToken', tokens.idToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);

      const groups = user?.signInUserSession?.idToken?.payload?.['cognito:groups'] || [];
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { ...user, groups },
      });

      return user;
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  // Signup
  const signup = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { user, userConfirmed } = await cognitoAuth.signUp(userData);
      localStorage.setItem('tempEmail', user.username);

      dispatch({ type: 'AUTH_SUCCESS', payload: user });
      return { user, userConfirmed };
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    await cognitoAuth.signOut();
    localStorage.removeItem('tempEmail');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'LOGOUT' });
  };

  // Update Profile
  const updateProfile = async (data) => {
    try {
      await cognitoAuth.refreshSession();

      const cognitoAttributes = {
        given_name: data.firstName,
        family_name: data.lastName,
        email: data.email,
        phone_number: data.phoneNumber,
        address: data.address,
      };

      await cognitoAuth.updateUserAttributes(cognitoAttributes);

      dispatch({ type: 'UPDATE_USER', payload: data });

      return true;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  };

  // Change Password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await cognitoAuth.refreshSession();
      await cognitoAuth.changePassword(currentPassword, newPassword);
      return true;
    } catch (error) {
      console.error('Error in changePassword:', error);
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
