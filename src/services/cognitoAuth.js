import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import {jwtDecode} from "jwt-decode";

// AWS Cognito Configuration
const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};

const userPool = new CognitoUserPool(poolData);

class CognitoAuthService {
  // Sign Up
  signUp(userData) {
    return new Promise((resolve, reject) => {
      const { email, password, firstName, lastName, phoneNumber, address } = userData;
      
      const attributeList = [
        new CognitoUserAttribute({
          Name: 'email',
          Value: email,
        }),
        new CognitoUserAttribute({
          Name: 'given_name',
          Value: firstName,
        }),
        new CognitoUserAttribute({
          Name: 'family_name',
          Value: lastName,
        }),
        new CognitoUserAttribute({
          Name: 'phone_number',
          Value: phoneNumber,
        }),
        new CognitoUserAttribute({
          Name: 'address',
          Value: address,
        }),
      ];

      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        
        const cognitoUser = result.user;
        resolve({
          user: cognitoUser,
          userConfirmed: result.userConfirmed,
          userSub: result.userSub,
        });
      });
    });
  }

  // Confirm Sign Up (Email Verification)
  confirmSignUp(email, verificationCode) {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.confirmRegistration(verificationCode, true, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  // Resend Confirmation Code
  resendConfirmationCode(email) {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

 

// Sign In
signIn(email, password) {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const accessToken = result.getAccessToken().getJwtToken();
        const idToken = result.getIdToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();

        // Store tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("idToken", idToken);
        localStorage.setItem("refreshToken", refreshToken);

        // ✅ Decode ID token to extract groups
        const decodedIdToken = jwtDecode(idToken);
        const groups = decodedIdToken["cognito:groups"] || [];
        console.log(groups);
        const role = groups.includes("Admin") ? "admin" : "User";

        // Get user attributes
        cognitoUser.getUserAttributes((err, attributes) => {
          if (err) {
            reject(err);
            return;
          }

          const userAttributes = {};
          attributes.forEach((attribute) => {
            userAttributes[attribute.getName()] = attribute.getValue();
          });

          resolve({
            user: {
              id: userAttributes.sub,
              email: userAttributes.email,
              firstName: userAttributes.given_name,
              lastName: userAttributes.family_name,
              phoneNumber: userAttributes.phone_number,
              address: userAttributes.address,
              emailVerified: userAttributes.email_verified === "true",
              role, // 👈 role comes from groups now
            },
            tokens: {
              accessToken,
              idToken,
              refreshToken,
            },
          });
        });
      },
      onFailure: (err) => {
        reject(err);
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        reject({
          code: "NewPasswordRequired",
          message: "New password required",
          userAttributes,
          requiredAttributes,
        });
      },
      mfaRequired: (challengeName, challengeParameters) => {
        reject({
          code: "MfaRequired",
          challengeName,
          challengeParameters,
        });
      },
    });
  });
}


  // Sign Out
  signOut() {
    return new Promise((resolve) => {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.signOut();
      }
      
      // Clear tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('idToken');
      localStorage.removeItem('refreshToken');
      // localStorage.clear();
      
      resolve();
    });
  }

  // Get Current User
  // getCurrentUser() {
  //   return new Promise((resolve, reject) => {
  //     const cognitoUser = userPool.getCurrentUser();
      
  //     if (!cognitoUser) {
  //       reject(new Error('No current user'));
  //       return;
  //     }

  //     cognitoUser.getSession((err, session) => {
  //       if (err) {
  //         reject(err);
  //         return;
  //       }

  //       if (!session.isValid()) {
  //         reject(new Error('Session is not valid'));
  //         return;
  //       }

  //       cognitoUser.getUserAttributes((err, attributes) => {
  //         if (err) {
  //           reject(err);
  //           return;
  //         }

  //         const userAttributes = {};
  //         attributes.forEach((attribute) => {
  //           userAttributes[attribute.getName()] = attribute.getValue();
  //         });

  //         resolve({
  //           id: userAttributes.sub,
  //           email: userAttributes.email,
  //           firstName: userAttributes.given_name,
  //           lastName: userAttributes.family_name,
  //           phoneNumber: userAttributes.phone_number,
  //           address: userAttributes.address,
  //           emailVerified: userAttributes.email_verified === 'true',
  //           role: userAttributes['custom:role'] || 'customer',
  //         });
  //       });
  //     });
  //   });
  // }

  getCurrentUser() {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      reject(new Error('No current user'));
      return;
    }

    cognitoUser.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }

      if (!session.isValid()) {
        reject(new Error('Session is not valid'));
        return;
      }

      // decode id token to extract groups
      let role = 'user';
      try {
        const idToken = session.getIdToken().getJwtToken();
        const decoded = jwtDecode(idToken);
        const groups = decoded['cognito:groups'] || [];
        if (Array.isArray(groups) && groups.some(g => String(g).toLowerCase() === 'admin')) {
          role = 'admin';
        }
      } catch (e) {
        // ignore decode errors — fallback to 'user'
      }

      // fetch attributes as before
      cognitoUser.getUserAttributes((err, attributes) => {
        if (err) {
          reject(err);
          return;
        }

        const userAttributes = {};
        attributes.forEach((attribute) => {
          userAttributes[attribute.getName()] = attribute.getValue();
        });

        resolve({
          id: userAttributes.sub,
          email: userAttributes.email,
          firstName: userAttributes.given_name,
          lastName: userAttributes.family_name,
          phoneNumber: userAttributes.phone_number,
          address: userAttributes.address,
          emailVerified: userAttributes.email_verified === 'true',
          role, // role derived from groups
        });
      });
    });
  });
}


  // Refresh Token
  refreshSession() {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();
      
      if (!cognitoUser) {
        reject(new Error('No current user'));
        return;
      }

      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
          return;
        }

        if (session.isValid()) {
          resolve(session);
          return;
        }

        const refreshToken = session.getRefreshToken();
        cognitoUser.refreshSession(refreshToken, (err, session) => {
          if (err) {
            reject(err);
            return;
          }

          const accessToken = session.getAccessToken().getJwtToken();
          const idToken = session.getIdToken().getJwtToken();

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('idToken', idToken);

          resolve(session);
        });
      });
    });
  }

  // Forgot Password
  forgotPassword(email) {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.forgotPassword({
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  // Confirm Password Reset
  confirmPassword(email, verificationCode, newPassword) {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess: () => {
          resolve('Password confirmed successfully');
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  // Change Password
  changePassword(oldPassword, newPassword) {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();
      
      if (!cognitoUser) {
        reject(new Error('No current user'));
        return;
      }

      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
          return;
        }

        cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      });
    });
  }

  // Update User Attributes
updateUserAttributes(attributes) {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      reject(new Error('No current user'));
      return;
    }

    // ✅ Ensure session is valid before updating
    cognitoUser.getSession((err, session) => {
      if (err) {
        reject(new Error('User is not authenticated'));
        return;
      }

      if (!session.isValid()) {
        reject(new Error('User session expired. Please log in again.'));
        return;
      }

      const attributeList = Object.keys(attributes).map(key => {
        return new CognitoUserAttribute({
          Name: key,
          Value: attributes[key],
        });
      });

      cognitoUser.updateAttributes(attributeList, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  });
}



  
  // Delete User
  deleteUser() {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();
      
      if (!cognitoUser) {
        reject(new Error('No current user'));
        return;
      }

      cognitoUser.deleteUser((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Clear tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('idToken');
        localStorage.removeItem('refreshToken');
        
        resolve(result);
      });
    });
  }

  // Get JWT Token
  getJwtToken() {
    return localStorage.getItem('idToken');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getJwtToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  }

  validateToken(token) {
    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error('No token found'));
        return;
      }

      try {
        const decoded = jwtDecode(token);

        // Expiry check
        if (decoded.exp * 1000 < Date.now()) {
          reject(new Error('Token expired'));
          return;
        }

        // If needed, check audience/clientId match
        if (
          decoded.aud !== process.env.REACT_APP_COGNITO_CLIENT_ID &&
          decoded.client_id !== process.env.REACT_APP_COGNITO_CLIENT_ID
        ) {
          reject(new Error('Invalid audience'));
          return;
        }

        // ✅ Return user info from token
        resolve({
          id: decoded.sub,
          email: decoded.email,
          firstName: decoded.given_name,
          lastName: decoded.family_name,
          role: decoded['custom:role'] || 'customer',
        });
      } catch (err) {
        reject(new Error('Invalid token'));
      }
    });
  }
}

export default new CognitoAuthService();