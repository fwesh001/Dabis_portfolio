import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Olehi Davis — Portfolio & Technical Blog',
    short_name: 'Olehi Davis',
    description:
      'Portfolio, projects, and technical blog of Olehi Davis — Web Developer, Desktop/Mobile App Developer, and Electronics Engineer.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'View Projects',
        short_name: 'Projects',
        description: 'Explore featured web, desktop, mobile, and electronics projects',
        url: '/#projects',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Technical Blog',
        short_name: 'Blog',
        description: 'Read engineering notes and technical articles',
        url: '/blog',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Contact Olehi Davis',
        short_name: 'Contact',
        description: 'Get in touch via phone, email, or socials',
        url: '/#contact',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
