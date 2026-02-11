import React, { useState, useEffect } from 'react';

interface LoginProps {
  onLogin: (user: { username: string; role: string; displayName: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const users = [
    { 
      username: 'admin', 
      role: 'Admin', 
      displayName: 'Lumensec-Admin',
      description: 'Full system access',
      requiresPassword: true,
      password: 'FATMA',
      tenant_id: "d99e4b24-8a5c-4e3d-9f1a-2c3b4d5e6f7a"
    },
    { 
      username: 'analyst', 
      role: 'Analyst', 
      displayName: 'SOC-Analyst',
      description: 'Incident management',
      requiresPassword: false,
      tenant_id: "d99e4b24-8a5c-4e3d-9f1a-2c3b4d5e6f7a"
    },
    { 
      username: 'guest', 
      role: 'Guest', 
      displayName: 'Guest-Access',
      description: 'Read-only access',
      requiresPassword: false,
      tenant_id: "d99e4b24-8a5c-4e3d-9f1a-2c3b4d5e6f7a"
    }
  ];

  useEffect(() => {
    console.log("LUMENSEC // BOOT SEQUENCE INITIALIZED");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const user = users.find(u => u.username === selectedUser);
    if (!user) return;

    if (user.requiresPassword && !showPasswordInput) {
      setShowPasswordInput(true);
      return;
    }

    setIsAuthenticating(true);
    setError('');

    setTimeout(() => {
      if (user.requiresPassword) {
        if (passcode === user.password) {
          onLogin(user);
        } else {
          setError('Invalid password');
          setIsAuthenticating(false);
          setPasscode('');
        }
      } else {
        onLogin(user);
      }
    }, 800);
  };

  const handleUserChange = (username: string) => {
    setSelectedUser(username);
    setShowPasswordInput(false);
    setPasscode('');
    setError('');
  };

  const handleEmergencyReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 opacity-80"></div>
      
      <div className={`relative w-full max-w-md p-10 bg-slate-900/40 backdrop-blur-3xl border ${error ? 'border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.1)]' : 'border-slate-800 shadow-2xl'} rounded-[3rem] text-center transition-all duration-500 ${error ? 'animate-shake' : ''}`}>
        
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-10px); }
            80% { transform: translateX(10px); }
          }
          .animate-shake { animation: shake 0.5s ease-in-out; }
        `}</style>

        <div className="mb-10 inline-flex items-center justify-center w-24 h-24 bg-slate-950 border border-slate-800 rounded-3xl relative group">
          <div className="absolute inset-0 bg-indigo-500/10 blur-xl group-hover:bg-indigo-500/20 transition-all rounded-full"></div>
          <span className="text-4xl font-black text-white italic relative z-10 tracking-tighter">L</span>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-950 shadow-lg"></div>
        </div>

        <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic mb-2">SOC Access Portal</h1>
        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.4em] mb-10">
          {showPasswordInput ? 'Enter Admin Password' : 'Select User Role'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!showPasswordInput ? (
            <div className="space-y-3">
              {users.map((user) => (
                <label
                  key={user.username}
                  className={`block cursor-pointer transition-all ${
                    selectedUser === user.username
                      ? 'bg-indigo-600/20 border-indigo-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  } border rounded-2xl p-5`}
                >
                  <input
                    type="radio"
                    name="user"
                    value={user.username}
                    checked={selectedUser === user.username}
                    onChange={(e) => handleUserChange(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="text-white font-bold text-sm flex items-center gap-2">
                        {user.displayName}
                        {user.requiresPassword && (
                          <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="text-slate-500 text-xs font-mono">{user.description}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      user.role === 'Admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      user.role === 'Analyst' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {user.role}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="relative">
              <input 
                type="password"
                autoFocus
                placeholder="ENTER ADMIN PASSWORD"
                className={`w-full bg-slate-950 border ${error ? 'border-red-500 text-red-400' : 'border-slate-800 text-white'} rounded-2xl px-6 py-5 text-center font-mono text-sm tracking-[0.5em] outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-800`}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                disabled={isAuthenticating}
              />
              {error && (
                <p className="absolute -bottom-6 left-0 w-full text-[8px] text-red-500 font-black uppercase tracking-widest italic animate-pulse">
                  {error}
                </p>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowPasswordInput(false);
                  setPasscode('');
                  setError('');
                }}
                className="mt-3 text-xs text-slate-500 hover:text-white transition-colors"
              >
                ← Back to user selection
              </button>
            </div>
          )}

          <button 
            type="submit"
            disabled={isAuthenticating || !selectedUser || (showPasswordInput && !passcode)}
            className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden
              ${isAuthenticating || !selectedUser || (showPasswordInput && !passcode)
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 active:scale-95'}
            `}
          >
            {isAuthenticating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : showPasswordInput ? 'Verify & Enter' : 'Enter SOC'}
          </button>
        </form>

        <div className="mt-12 flex flex-col items-center space-y-6">
          <div className="text-slate-600 text-[8px] font-mono uppercase tracking-widest leading-loose">
            Terminal Node: SOC-ALPHA-01<br/>
            Target: Render API
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={handleEmergencyReset}
              className="px-4 py-2 border border-slate-800 rounded-lg text-[7px] text-slate-500 hover:text-white uppercase tracking-widest font-black transition-all hover:bg-slate-800"
            >
              [ Flush Cache ]
            </button>
            <a 
              href="https://lumensec-api.onrender.com" 
              target="_blank" 
              className="px-4 py-2 border border-slate-800 rounded-lg text-[7px] text-slate-500 hover:text-emerald-400 uppercase tracking-widest font-black transition-all hover:bg-slate-800"
            >
              [ Check API ]
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;