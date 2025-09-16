
import React, { useState } from 'react';
import BotIcon from '../icons/BotIcon';
import GoogleIcon from '../icons/GoogleIcon';
import EmailIcon from '../icons/EmailIcon';
import LockIcon from '../icons/LockIcon';
import UserCircleIcon from '../icons/UserCircleIcon';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import { authorizedAdmins } from '../../constants/admins';
import { authorizedUsers, authorizedGoogleUsers } from '../../constants/users';


interface AuthPageProps {
  onLogin: () => void;
}

type AuthView = 'login' | 'google-verify';

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isAdminView, setIsAdminView] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isAdminView) {
      const admin = authorizedAdmins.find(
        (a) => a.name.toLowerCase() === name.trim().toLowerCase() && a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
      );
      if (admin) {
        onLogin();
      } else {
        setError('Invalid admin credentials. Please try again.');
      }
    } else {
      const user = authorizedUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );
      if (user) {
        onLogin();
      } else {
        setError('Invalid credentials or unauthorized user.');
      }
    }
  };

  const handleGoogleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isAuthorized = authorizedGoogleUsers.find(
      (authorizedEmail) => authorizedEmail.toLowerCase() === email.trim().toLowerCase()
    );

    if (isAuthorized) {
      onLogin();
    } else {
      setError('This Google account is not authorized to access NeerAI.');
    }
  };
  
  const handleTabChange = (isAdmin: boolean) => {
    setIsAdminView(isAdmin);
    // Clear form fields and errors when switching tabs
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
  };
  
  const resetToLoginView = () => {
    setAuthView('login');
    setEmail('');
    setError(null);
  }

  const renderLoginForm = () => (
    <>
      {/* Login Mode Tabs */}
      <div className="flex border-b border-[color:var(--color-accent-teal)]/20">
          <button 
              onClick={() => handleTabChange(false)}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${!isAdminView ? 'text-[color:var(--color-accent-light-teal)] border-b-2 border-[color:var(--color-accent-teal)]' : 'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]'}`}
          >
              User Access
          </button>
          <button 
              onClick={() => handleTabChange(true)}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${isAdminView ? 'text-[color:var(--color-accent-light-teal)] border-b-2 border-[color:var(--color-accent-teal)]' : 'text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]'}`}
          >
              Admin Control
          </button>
      </div>

      <form className="space-y-4" onSubmit={handleLoginSubmit}>
          {isAdminView && (
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircleIcon />
                  </div>
                  <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      required={isAdminView}
                      className="w-full pl-10 pr-3 py-2 bg-[color:var(--color-bg-light-indigo)]/70 border border-[color:var(--color-accent-teal)]/20 rounded-md focus:ring-2 focus:ring-[color:var(--color-accent-teal)] focus:outline-none"
                      aria-label="Full Name"
                  />
              </div>
          )}
          <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EmailIcon />
              </div>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full pl-10 pr-3 py-2 bg-[color:var(--color-bg-light-indigo)]/70 border border-[color:var(--color-accent-teal)]/20 rounded-md focus:ring-2 focus:ring-[color:var(--color-accent-teal)] focus:outline-none"
                  aria-label="Email Address"
              />
          </div>
          <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon />
              </div>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-3 py-2 bg-[color:var(--color-bg-light-indigo)]/70 border border-[color:var(--color-accent-teal)]/20 rounded-md focus:ring-2 focus:ring-[color:var(--color-accent-teal)] focus:outline-none"
                  aria-label="Password"
              />
          </div>

          <div className="text-right">
              <a href="#" className="text-sm text-[color:var(--color-accent-light-teal)] hover:underline">Forgot Password?</a>
          </div>

          <button
              type="submit"
              className="w-full py-2 px-4 bg-[color:var(--color-accent-teal)] hover:bg-[color:var(--color-accent-light-teal)] rounded-md font-semibold text-[color:var(--color-bg-deep-indigo)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--color-accent-light-teal)] focus:ring-offset-[color:var(--color-bg-mid-indigo)]"
          >
              Sign In
          </button>

          {!isAdminView && (
              <>
                  <div className="relative flex py-3 items-center">
                      <div className="flex-grow border-t border-[color:var(--color-accent-teal)]/20"></div>
                      <span className="flex-shrink mx-4 text-[color:var(--color-text-secondary)] text-sm">Or continue with</span>
                      <div className="flex-grow border-t border-[color:var(--color-accent-teal)]/20"></div>
                  </div>
                  <button
                      type="button"
                      onClick={() => setAuthView('google-verify')}
                      className="w-full flex items-center justify-center py-2 px-4 bg-[color:var(--color-bg-light-indigo)]/70 hover:bg-[color:var(--color-bg-light-indigo)] border border-[color:var(--color-accent-teal)]/20 rounded-md font-medium text-[color:var(--color-text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--color-accent-teal)] focus:ring-offset-[color:var(--color-bg-mid-indigo)]"
                  >
                      <GoogleIcon />
                      <span className="ml-2">Sign in with Google</span>
                  </button>
              </>
          )}
      </form>
    </>
  );

  const renderGoogleVerifyForm = () => (
    <div className="space-y-4">
        <h2 className="text-center font-semibold text-[color:var(--color-text-primary)]">Verify Google Account</h2>
        <p className="text-center text-sm text-[color:var(--color-text-secondary)]">For security, please enter your Google email to verify your authorization.</p>
        <form className="space-y-4" onSubmit={handleGoogleVerifySubmit}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EmailIcon />
                </div>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Google email"
                    required
                    className="w-full pl-10 pr-3 py-2 bg-[color:var(--color-bg-light-indigo)]/70 border border-[color:var(--color-accent-teal)]/20 rounded-md focus:ring-2 focus:ring-[color:var(--color-accent-teal)] focus:outline-none"
                    aria-label="Google Email Address"
                />
            </div>
            <button
                type="submit"
                className="w-full py-2 px-4 bg-[color:var(--color-accent-teal)] hover:bg-[color:var(--color-accent-light-teal)] rounded-md font-semibold text-[color:var(--color-bg-deep-indigo)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--color-accent-light-teal)] focus:ring-offset-[color:var(--color-bg-mid-indigo)]"
            >
                Verify Email
            </button>
        </form>
        <button 
            onClick={resetToLoginView}
            className="w-full flex items-center justify-center text-sm text-[color:var(--color-accent-light-teal)] hover:underline"
        >
            <ArrowLeftIcon />
            <span className="ml-1">Back to login</span>
        </button>
    </div>
  );


  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-[color:var(--color-bg-mid-indigo)]/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-[color:var(--color-accent-teal)]/20 text-[color:var(--color-text-primary)]">
        <div className="flex flex-col items-center space-y-2">
            <BotIcon />
            <h1 className="text-2xl font-bold text-[color:var(--color-text-primary)]">Welcome to NeerAI</h1>
            <p className="text-[color:var(--color-text-secondary)]">
                {authView === 'login' ? 'Sign in to access the Groundwater Assistant' : 'Account Verification'}
            </p>
        </div>

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        
        {authView === 'login' ? renderLoginForm() : renderGoogleVerifyForm()}
      </div>
    </div>
  );
};

export default AuthPage;
