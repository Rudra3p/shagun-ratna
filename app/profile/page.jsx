"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import userApi from '@/lib/userApi';
import { Mail, Phone, Cake, LogOut, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    userApi.get('/profile')
      .then((res) => {
        if (!cancelled) setProfile(res.data.user);
      })
      .catch((err) => {
        if (cancelled) return;
        // Not signed in (or session expired) — send them to sign in / register
        if (err.response?.status === 401) {
          router.replace('/auth');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await userApi.post('/auth/signout');
    } catch {
      // Cookies are httpOnly server-side; even if this call fails, clear local state below
    }
    try {
      localStorage.removeItem('shagun_user_name');
      localStorage.removeItem('shagun_user_dob');
    } catch {
      // localStorage unavailable — nothing to clean up
    }
    window.location.href = '/';
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 size={22} className="animate-spin text-[#90060C]" />
      </div>
    );
  }

  const initial = profile.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2926] antialiased">
      <div className="max-w-[720px] mx-auto px-6 md:px-10 pt-28 pb-24">
        <h1 className="font-brand text-3xl sm:text-4xl text-[#1a1a1a] mb-10">My Profile</h1>

        <div className="bg-white border border-[#EBE3D5] rounded-2xl shadow-sm p-8 sm:p-10">
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-[#EBE3D5]/60">
            <div className="w-16 h-16 rounded-full bg-[#90060C] text-white flex items-center justify-center font-brand text-2xl shrink-0">
              {initial}
            </div>
            <div>
              <p className="font-brand text-xl text-[#1a1a1a]">{profile.name}</p>
              <p className="text-[11px] font-sans font-semibold uppercase tracking-widest text-[#9C8253] mt-1">
                {profile.gender}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-[#C5A059] shrink-0" />
              <span className="text-sm font-sans text-[#2D2926]">{profile.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-[#C5A059] shrink-0" />
              <span className="text-sm font-sans text-[#2D2926]">{profile.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Cake size={16} className="text-[#C5A059] shrink-0" />
              <span className="text-sm font-sans text-[#2D2926]">{profile.birthdate}</span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="mt-10 flex items-center gap-2 px-6 py-3 border border-[#90060C] text-[#90060C] hover:bg-[#90060C] hover:text-white font-sans text-xs font-semibold uppercase tracking-[0.2em] rounded-full transition-all duration-300 disabled:opacity-60 cursor-pointer"
          >
            {signingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
            {signingOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    </div>
  );
}
