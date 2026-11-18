import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Olehi Davis — Senior Software Engineer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
          color: '#fafafa',
          border: '1px solid #27272a',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: '#18181b',
              border: '1.5px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#10b981',
            }}
          >
            OD
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Olehi Davis</span>
            <span style={{ fontSize: '16px', color: '#a1a1aa' }}>Senior Software Engineer</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            Distributed Systems &amp; Modern Web Architecture
          </h1>
          <p style={{ fontSize: '24px', color: '#a1a1aa', margin: 0 }}>
            Designing resilient backend services, developer tooling, and high-craft applications.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #27272a',
            paddingTop: '24px',
            fontSize: '16px',
            color: '#71717a',
          }}
        >
          <span>https://olehidavis.dev</span>
          <span style={{ color: '#10b981' }}>Available for Roles &amp; Consulting</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
