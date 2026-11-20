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
      setSuccessMessage('Password reset OTP sent to ' + email);
      setMode('reset');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not send reset OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      await resetPassword(email, otp.trim(), newPassword);
      setSuccessMessage('Password reset successfully. You can now login.');
      setMode('login');
      setPassword('');
      setOtp('');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        {/* Brand Logo & Title */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <img src="/assets/logo.png" alt="VIBE SEEKERS" className="h-10 w-auto mx-auto brightness-110" />
          </Link>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            {mode === 'login' && 'Sign In to Vibe Seekers'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'otp' && 'Verify Your Email'}
            {mode === 'forgot' && 'Reset Your Password'}
            {mode === 'reset' && 'Set New Password'}
          </h2>
          <p className="text-xs text-zinc-400">
            {mode === 'login' && 'Unlock your saved shipping address & order tracking'}
            {mode === 'signup' && 'Join the Indian streetwear revolution'}
            {mode === 'otp' && `Enter the 6-digit code sent to ${email}`}
            {mode === 'forgot' && 'We will send a 6-digit recovery OTP to your email'}
            {mode === 'reset' && 'Enter your OTP and choose a new secure password'}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
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
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
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
                  className="text-[11px] text-vibe-accent hover:underline font-semibold"
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
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-vibe-accent hover:bg-vibe-accentHover disabled:bg-zinc-800 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-vibe-accent/20"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="pt-2 text-center text-xs text-zinc-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setMode('signup');
                }}
                className="text-white font-bold hover:text-vibe-accent underline ml-1"
              >
                Sign Up
              </button>
            </div>
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
                  placeholder="e.g. Aryan Deshmukh"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
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
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Mobile Number (10 Digits)
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98XXXXXXXX"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Create Password (Min 6 Characters)
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-vibe-accent hover:bg-vibe-accentHover disabled:bg-zinc-800 text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-vibe-accent/20"
            >
              {loading ? 'Creating...' : 'Send Verification OTP'}
            </button>

            <div className="pt-2 text-center text-xs text-zinc-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setMode('login');
                }}
                className="text-white font-bold hover:text-vibe-accent underline ml-1"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* OTP VERIFICATION FORM */}
        {mode === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            {receivedOtp && (
              <div className="p-4 rounded-xl bg-orange-500/15 border border-orange-500/40 text-center shadow-lg animate-pulse">
                <span className="text-[11px] font-mono uppercase tracking-widest text-orange-400 font-bold block mb-1">
                  Your Verification OTP Code
                </span>
                <span className="text-3xl font-mono font-black text-white tracking-widest block select-all">
                  {receivedOtp}
                </span>
                <span className="text-[11px] text-zinc-300 mt-1 block">
                  (Code pre-filled below for quick verification)
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Enter 6-Digit OTP Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-vibe-accent"
              />
              <span className="text-[11px] text-zinc-500 block text-center mt-1">
                Valid for 5 minutes.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-vibe-accent hover:bg-vibe-accentHover text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <div className="flex justify-between items-center pt-2 text-xs">
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-zinc-500 hover:text-white"
              >
                Change Details
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await signup(fullName, email, phone, password);
                    const code = res?.data || '';
                    if (code) {
                      setReceivedOtp(code);
                      setOtp(code);
                    }
                    setSuccessMessage('Fresh verification code: ' + (code || 'Sent to ' + email));
                  } catch (err) {
                    setErrorMessage(err.response?.data?.message || 'Failed to resend code.');
                  }
                }}
                className="text-vibe-accent hover:underline font-bold"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Registered Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-vibe-accent hover:bg-vibe-accentHover text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all"
            >
              {loading ? 'Sending OTP...' : 'Send Recovery OTP'}
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-xs text-zinc-400 hover:text-white pt-2"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {/* RESET PASSWORD FORM */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
            {receivedOtp && (
              <div className="p-4 rounded-xl bg-orange-500/15 border border-orange-500/40 text-center shadow-lg animate-pulse">
                <span className="text-[11px] font-mono uppercase tracking-widest text-orange-400 font-bold block mb-1">
                  Password Reset Code
                </span>
                <span className="text-3xl font-mono font-black text-white tracking-widest block select-all">
                  {receivedOtp}
                </span>
                <span className="text-[11px] text-zinc-300 mt-1 block">
                  (Code pre-filled below)
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                6-Digit Recovery OTP
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2.5 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-vibe-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                New Password (Min 6 Characters)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-vibe-accent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-vibe-accent hover:bg-vibe-accentHover text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all"
            >
              {loading ? 'Resetting...' : 'Update Password & Login'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
