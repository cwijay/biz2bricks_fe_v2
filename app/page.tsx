
"use client";
import AcmeLogo from '@/app/UIComponents/UIGenericComponents/kwality-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

//import LoginForm from '@/app/UIComponents/UILoginComponents/login-form';
import { useState } from 'react';
//import RegisterModal from '@/app/UIComponents/UILoginComponents/register-modal';
//import GoogleLogin from '@/app/UIComponents/UILoginComponents/google-login';

import SignIn from '@/app/UIComponents/UILoginComponents/sign-in';

export default function Page() {
  const [showRegister, setShowRegister] = useState(false);
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <Image src="/hero-desktop.png" width={1000} height={760} className='hidden md:block' alt='sfsadf'/>
        </div>
        <div className="flex flex-col justify-center rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to Biz2Bricks.</strong>
          </p>
          {/* <LoginForm /> */}
           <br />
            {/* <GoogleLogin /> */}
            <SignIn />
          {/* <div className="mt-2 text-center">
            <button type="button" onClick={() => setShowRegister(true)} className="text-blue-600 hover:underline text-sm bg-transparent border-none cursor-pointer">
              New user? Register here
            </button>
          </div> */}
        </div>
      </div>
      {/* <RegisterModal open={showRegister} onClose={() => setShowRegister(false)} /> */}
    </main>
  );
}
