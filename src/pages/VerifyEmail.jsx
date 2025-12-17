import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiX, FiMail } from 'react-icons/fi';
import cognitoAuth from '../services/cognitoAuth';

function VerifyEmail() {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const tempEmail = localStorage.getItem('tempEmail');
    if (!tempEmail) {
      console.log('No email found in localStorage, redirecting to register');
      navigate('/signup');
      return;
    }
    console.log('Retrieved email from localStorage:', tempEmail);
    setEmail(tempEmail);
  }, [navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    console.log('Submitting verification code:', verificationCode);

    try {
      const result = await cognitoAuth.confirmSignUp(email, verificationCode);
      console.log('Verification result:', result);
      
      if (result==='SUCCESS') {
        setSuccess(true);
        setTimeout(() => {
          console.log('Redirecting to login after successful verification');
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    try {
      await cognitoAuth.resendConfirmationCode(email);
      setCountdown(60);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <FiMail className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your email address
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a verification code to {email}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10">
          {success ? (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiCheck className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Email address verified successfully! Redirecting to login...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiX className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter verification code"
                    maxLength={6}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || verificationCode.length !== 6}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting || verificationCode.length !== 6
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {isSubmitting ? 'Verifying...' : 'Verify Email Address'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={countdown > 0}
                  className={`text-sm font-medium ${
                    countdown > 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:text-blue-500'
                  }`}
                >
                  {countdown > 0
                    ? `Resend code in ${countdown}s`
                    : 'Resend verification code'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;