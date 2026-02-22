import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://xenorai.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/dashboard/',
                    '/account/',
                    '/api/',
                    '/(auth)/',
                    '/conversations/',
                    '/domains/',
                    '/leads/',
                    '/products/',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
