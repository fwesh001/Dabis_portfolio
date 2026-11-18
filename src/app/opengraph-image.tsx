import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const alt = 'Olehi Davis — Software & Electronics Engineer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  let portraitDataUri: string | null = null;
  try {
    const imgPath = path.join(process.cwd(), 'src', 'app', 'icon.jpg');
    const buffer = fs.readFileSync(imgPath);
    portraitDataUri = `data:image/jpeg;base64,${buffer.toString('base64')}`;
  } catch {
    portraitDataUri = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
          color: '#fafafa',
          position: 'relative',
        }}
      >
        {/* Left Column: Identity & Tagline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            maxWidth: '680px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '20px',
              color: '#3b82f6',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '9999px',
                background: '#3b82f6',
              }}
            />
            <span>Available for work</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                margin: 0,
                color: '#ffffff',
              }}
            >
              Olehi Davis
            </h1>
            <div
              style={{
                fontSize: '30px',
                fontWeight: 700,
                color: '#3b82f6',
                margin: 0,
              }}
            >
              Web, Desktop/Mobile &amp; Electronics Engineer
            </div>
            <p
              style={{
                fontSize: '22px',
                color: '#a1a1aa',
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              Building full-stack web apps, cross-platform desktop &amp; Android software, and embedded microcontroller devices.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '18px',
              color: '#71717a',
            }}
          >
            <span>FCT, Abuja, Nigeria</span>
            <span>•</span>
            <span>olehi-davis-portfolio.vercel.app</span>
          </div>
        </div>

        {/* Right Column: Circular Portrait Photo */}
        {portraitDataUri && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '340px',
              height: '340px',
              borderRadius: '9999px',
              border: '4px solid #3b82f6',
              padding: '10px',
              background: '#18181b',
              flexShrink: 0,
            }}
          >
            <img
              src={portraitDataUri}
              alt="Olehi Davis"
              width={316}
              height={316}
              style={{
                width: '316px',
                height: '316px',
                borderRadius: '9999px',
                objectFit: 'cover',
              }}
            />
          </div>
        )}
      </div>
    ),
    {
      ...size,
    }
  );
}
