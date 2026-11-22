import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, User, Phone, KeyRound, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, verifyRegistration, forgotPassword, resetPassword } = useAuth();

  // Mode: 'login' | 'signup' | 'otp' | 'forgot' | 'reset'
  const [mode, setMode] = useState('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [receivedOtp, setReceivedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const redirectPath = location.state?.from?.pathname || '/';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      await login(email, password, false);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      setErrorMessage(msg);
      if (msg.includes('Account not verified')) {
        const match = msg.match(/\b\d{6}\b/);
        if (match) {
          setReceivedOtp(match[0]);
          setOtp(match[0]);
        }
        setMode('otp');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await signup(fullName, email, phone, password);
      const code = res?.data || '';
      if (code) {
        setReceivedOtp(code);
        setOtp(code);
      }
      setSuccessMessage('Verification code generated for ' + email);
      setMode('otp');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp.trim())) {
      setErrorMessage('Please enter a 6-digit verification code.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      await verifyRegistration(email, otp.trim());
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await forgotPassword(email);
      const code = res?.data || '';
      if (code) {
        setReceivedOtp(code);
        setOtp(code);
      }
      setSuccessMessage('Verification OTP sent to ' + email);
      setMode('reset');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to process request.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp.trim())) {
      setErrorMessage('Please enter the 6-digit OTP code.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      await resetPassword(email, otp.trim(), newPassword);
      setSuccessMessage('Password updated successfully. Please sign in.');
      setMode('login');
      setPassword('');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#080808] min-h-[85vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 text-white">
      <div className="max-w-md w-full bg-[#121212] border border-zinc-800 p-8 sm:p-10 space-y-6 shadow-2xl relative">
        
        {/* Brand Logo & Title */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <img src="/assets/logo.png" alt="VIBE SEEKERS" className="h-12 w-auto mx-auto brightness-110" />
          </Link>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mt-2">
            {mode === 'login' && 'Sign In to Vibe Seekers'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'otp' && 'Verify Your Email'}
            {mode === 'forgot' && 'Reset Your Password'}
            {mode === 'reset' && 'Set New Password'}
          </h2>
          <p className="text-xs text-zinc-400 uppercase tracking-wider">
            {mode === 'login' && 'Unlock saved addresses & track your drops'}
            {mode === 'signup' && 'Join the Indian streetwear revolution'}
            {mode === 'otp' && `Enter the 6-digit code sent to ${email}`}
            {mode === 'forgot' && 'We will send a 6-digit recovery OTP to your email'}
            {mode === 'reset' && 'Enter your OTP and choose a new password'}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Development Helper Pill if OTP is returned */}
        {receivedOtp && (
          <div className="p-2.5 bg-black border border-zinc-700 text-center text-xs">
            <span className="text-zinc-400">DEMO VERIFICATION CODE: </span>
            <strong className="text-white font-mono tracking-widest text-sm">{receivedOtp}</strong>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-black border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setMode('forgot');
                  }}
                  className="text-[11px] text-zinc-400 hover:text-white underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white text-black font-extrabold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-xl disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vivek Matne"
                  className="w-full bg-black border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-black border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Phone Number (10 Digits)
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9860498749"
                  className="w-full bg-black border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-black border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white text-black font-extrabold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-xl disabled:opacity-50"
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>
        )}

        {/* OTP VERIFICATION FORM */}
        {mode === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                6-Digit Verification Code
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-black border border-zinc-800 pl-10 pr-4 py-2.5 text-sm text-white font-mono tracking-widest focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white text-black font-extrabold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'VERIFYING...' : 'CONFIRM & ACTIVATE'}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-black border border-zinc-800 pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white text-black font-extrabold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'SENDING CODE...' : 'SEND RECOVERY OTP'}
            </button>
          </form>
        )}

        {/* RESET PASSWORD FORM */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                6-Digit Recovery OTP
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full bg-black border border-zinc-800 px-3.5 py-2.5 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new secure password"
                className="w-full bg-black border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white text-black font-extrabold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'RESETTING...' : 'UPDATE PASSWORD'}
            </button>
          </form>
        )}

        {/* Footer Mode Switchers */}
        <div className="pt-4 border-t border-zinc-800 text-center text-xs text-zinc-400">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setMode('signup');
                }}
                className="text-white font-bold hover:underline ml-1 uppercase tracking-wider"
              >
                Sign Up Here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setMode('login');
                }}
                className="text-white font-bold hover:underline ml-1 uppercase tracking-wider"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
