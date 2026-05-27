import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get('title') || 'MathOdyssey';
  const era = searchParams.get('era') || '';
  const subtitle = searchParams.get('subtitle') || '数学的发现之旅';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0a0a1a 100%)',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          {era && (
            <div
              style={{
                fontSize: '20px',
                color: '#818cf8',
                letterSpacing: '4px',
                textTransform: 'uppercase',
              }}
            >
              {era}
            </div>
          )}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: '#e8e8f0',
              textAlign: 'center',
              lineHeight: 1.2,
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#a0a0c0',
              textAlign: 'center',
              marginTop: '8px',
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '24px',
              padding: '12px 24px',
              borderRadius: '8px',
              background: 'rgba(129, 140, 248, 0.15)',
              border: '1px solid rgba(129, 140, 248, 0.3)',
            }}
          >
            <span style={{ fontSize: '28px' }}>🧭</span>
            <span style={{ fontSize: '22px', color: '#818cf8', fontWeight: 600 }}>
              MathOdyssey
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
