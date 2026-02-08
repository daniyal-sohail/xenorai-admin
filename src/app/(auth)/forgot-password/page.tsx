'use client'
import React from 'react';
import MovingCards from '@/components/common/MovingCards';
import ForgotPasswordForm from '@/components/authComponents/ForgotPasswordForm';

const Page = () => {
    return (
        <div className="relative p-6 bg-white z-1 sm:p-0">
            <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row sm:p-0">
                {/* Login form */}
                <ForgotPasswordForm />
                <MovingCards />
            </div>
        </div>
    );
};

export default Page;