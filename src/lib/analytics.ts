// Google Analytics Event Tracking Utility

declare global {
    interface Window {
        gtag?: (
            command: string,
            targetId: string,
            config?: Record<string, any>
        ) => void;
    }
}

// Track custom events
export const trackEvent = (
    eventName: string,
    eventParams?: Record<string, any>
) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, eventParams);
    }
};

// Track page views (useful for client-side navigation)
export const trackPageView = (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'G-EYC0XDCW24', {
            page_path: url,
        });
    }
};

// Common event tracking functions
export const analytics = {
    // Track button clicks
    trackButtonClick: (buttonName: string, location?: string) => {
        trackEvent('button_click', {
            button_name: buttonName,
            location: location || 'unknown',
        });
    },

    // Track form submissions
    trackFormSubmit: (formName: string, formType?: string) => {
        trackEvent('form_submit', {
            form_name: formName,
            form_type: formType || 'general',
        });
    },

    // Track sign ups
    trackSignUp: (method: string) => {
        trackEvent('sign_up', {
            method: method, // e.g., 'email', 'google', etc.
        });
    },

    // Track conversions (goals)
    trackConversion: (conversionType: string, value?: number) => {
        trackEvent('conversion', {
            conversion_type: conversionType,
            value: value || 0,
        });
    },

    // Track user engagement
    trackEngagement: (action: string, category?: string) => {
        trackEvent('engagement', {
            action: action,
            category: category || 'general',
        });
    },

    // Track outbound links
    trackOutboundLink: (url: string, linkText?: string) => {
        trackEvent('click', {
            event_category: 'outbound',
            event_label: url,
            transport_type: 'beacon',
            link_text: linkText || url,
        });
    },

    // Track newsletter subscription
    trackNewsletterSignup: (source: string) => {
        trackEvent('newsletter_signup', {
            source: source, // e.g., 'footer', 'hero', 'newsletter_section'
        });
    },

    // Track pricing plan views
    trackPlanView: (planName: string, planPrice: string) => {
        trackEvent('view_item', {
            item_name: planName,
            item_category: 'pricing_plan',
            price: planPrice,
        });
    },

    // Track pricing plan interest (CTA clicks)
    trackPlanInterest: (planName: string, planPrice: string) => {
        trackEvent('add_to_cart', {
            currency: 'USD',
            value: parseFloat(planPrice) || 0,
            items: [
                {
                    item_name: planName,
                    item_category: 'pricing_plan',
                    price: planPrice,
                },
            ],
        });
    },
};
