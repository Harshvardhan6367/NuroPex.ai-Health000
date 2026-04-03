import React, { useState } from 'react';
import { Stethoscope, User, ArrowRight, Loader2, Lock, ShieldCheck, Mail } from 'lucide-react';
import { AppRoute } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button, Card, Input } from '@/components/shared/ui';
import { AuthService } from '@/api/authService';

interface LoginPageProps {
  onLogin: (response: any) => void;
  onNavigate: (route: AppRoute) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
  const { t } = useLanguage();
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [email, setEmail] = useState('patient@demo.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleRoleChange = (newRole: 'patient' | 'doctor') => {
    setRole(newRole);
    if (newRole === 'patient') {
      setEmail('patient@demo.com');
      setPassword('password123');
    } else {
      setEmail('doctor@demo.com');
      setPassword('password123');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await AuthService.login(email, password, role);
      onLogin(response);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <Card className="w-full max-w-md p-8 md:p-10 space-y-8 animate-in zoom-in-95 duration-500 shadow-2xl border-white/20 dark:border-slate-800/50">

        {/* Branding Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 transform hover:scale-110 transition-transform duration-300">
            <Stethoscope className="text-white w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-1">
              VEDAX<span className="text-blue-600">-AI</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">{t('auth.signin_subtitle')}</p>
          </div>
        </div>

        {/* Role Multi-Toggle */}
        <div className="bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-2xl flex relative">
          <button
            onClick={() => handleRoleChange('patient')}
            className={`flex-1 py-3 text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 z-10 ${role === 'patient'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-500'
              }`}
          >
            <User size={18} /> {t('auth.patient')}
          </button>
          <button
            onClick={() => handleRoleChange('doctor')}
            className={`flex-1 py-3 text-sm font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 z-10 ${role === 'doctor'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-500'
              }`}
          >
            <ShieldCheck size={18} /> {t('auth.doctor')}
          </button>

          {/* Animated Slider */}
          <div
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-slate-800 rounded-xl shadow-lg transition-all duration-300 ease-out ${role === 'doctor' ? 'translate-x-[calc(100%+3px)]' : 'translate-x-[3px]'
              }`}
          ></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Email Address</label>
              <Input
                type="email"
                placeholder={t('auth.email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Password</label>
                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:underline">
                  {t('auth.forgot_password')}
                </button>
              </div>
              <Input
                type="password"
                placeholder={t('auth.password_placeholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-2xl text-center animate-shake">
              {error}
            </div>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full py-4 text-lg shadow-xl shadow-blue-500/20 group"
          >
            {t('auth.sign_in')}
            {!isLoading && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white dark:bg-slate-950 px-4">
              Or continue with
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={async () => {
              try {
                await AuthService.loginWithGoogle();
              } catch (err: any) {
                setError(err.message || 'Google login failed');
              }
            }}
            className="w-full py-4 border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3 font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
              />
            </svg>
            Google
          </Button>
        </form>


        <div className="space-y-6 pt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider scale-90">
                {t('auth.new_user')}
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={() => onNavigate(AppRoute.SIGNUP)}
            className="w-full border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transform hover:-translate-y-0.5"
          >
            {t('auth.create_account')}
          </Button>
        </div>

        {/* Demo Credentials Alert */}
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Demo Credentials</p>
            <div className="flex flex-col gap-1 mt-1 text-[10px] font-bold text-slate-600 dark:text-slate-300">
              <p><span className="text-blue-600">Patient:</span> patient@demo.com / password123</p>
              <p><span className="text-indigo-600">Doctor:</span> doctor@demo.com / password123</p>
            </div>
          </div>
        </div>

      </Card>
    </div >
  );
};

export default LoginPage;
