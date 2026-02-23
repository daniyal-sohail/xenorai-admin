'use client';

import { useEffect } from 'react';
import AOS from 'aos';

export default function AOSInit() {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: false,
            offset: 100,
        });
    }, []);

    return null;
}
