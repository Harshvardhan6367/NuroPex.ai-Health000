import React, { useState } from 'react';
import { User, Mail, Lock, Loader2, ArrowLeft, ArrowRight, Stethoscope, ShieldCheck } from 'lucide-react';
import { AuthService } from '@/api/authService';
import { AppRoute } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button, Card, Input } from '@/components/shared/ui';

interface SignupPageProps {
  onSignup: (response: any) => void;
  onNavigate: (route: AppRoute) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onNavigate }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await AuthService.signup(name, email, password, role);
      onSignup(response);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <Card className="w-full max-w-md p-8 md:p-10 space-y-8 animate-in slide-in-from-right duration-500 shadow-2xl border-white/20 dark:border-slate-800/50">

        <div className="space-y-6">
          <button
            onClick={() => onNavigate(AppRoute.LOGIN)}
            className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-black uppercase tracking-widest"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> {t('auth.back_login')}
          </button>

          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{t('auth.create_title')}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">{t('auth.join_subtitle')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Full Name</label>
              <Input
                type="text"
                placeholder={t('auth.full_name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={User}
                required
              />
            </div>
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
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Create Password</label>
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

          <div className="pt-2 space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{t('auth.iam')}</label>
            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer group">
                <input
                  type="radio"
                  name="role"
                  className="hidden peer"
                  checked={role === 'patient'}
                  onChange={() => setRole('patient')}
                />
                <div className="py-4 px-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-center transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/10 hover:border-slate-200 dark:hover:border-slate-700">
                  <User size={20} className="mx-auto mb-2 text-slate-400 peer-checked:text-blue-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 peer-checked:text-blue-600 dark:peer-checked:text-blue-400">
                    {t('auth.patient')}
                  </span>
                </div>
              </label>
              <label className="flex-1 cursor-pointer group">
                <input
                  type="radio"
                  name="role"
                  className="hidden peer"
                  checked={role === 'doctor'}
                  onChange={() => setRole('doctor')}
                />
                <div className="py-4 px-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-center transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/10 hover:border-slate-200 dark:hover:border-slate-700">
                  <ShieldCheck size={20} className="mx-auto mb-2 text-slate-400 peer-checked:text-blue-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 peer-checked:text-blue-600 dark:peer-checked:text-blue-400">
                    {t('auth.doctor')}
                  </span>
                </div>
              </label>
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
            className="w-full py-4 text-lg shadow-xl shadow-blue-500/20 mt-4 group"
          >
            {t('auth.sign_up')}
            {!isLoading && <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
          </Button>

          <div className="relative py-2 mt-2">
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

        <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-6 leading-relax">
          {t('auth.terms')}
        </p>
      </Card>
    </div>
  );
};

export default SignupPage;
