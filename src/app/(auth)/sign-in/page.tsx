'use client'
import React from 'react';
import SignInForm from '@/components/authComponents/SignInForm';
import MovingCards from '@/components/common/MovingCards';

const Page = () => {
    return (
        <div className="relative p-6 bg-white z-1 sm:p-0">
            <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row sm:p-0">
                {/* Login form */}
                <SignInForm />
                <MovingCards />
            </div>
        </div>
    );
};

export default Page;