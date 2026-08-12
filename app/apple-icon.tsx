import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default async function AppleIcon() {
  const fontData = await readFile(
    path.join(process.cwd(), 'assets/fonts/CormorantGaramond-Bold.woff')
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FDFBF7',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: 'Cormorant Garamond',
            fontWeight: 700,
            fontSize: 92,
            color: '#3d0a14',
            letterSpacing: '-4px',
          }}
        >
          SR
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Cormorant Garamond', data: fontData, weight: 700, style: 'normal' }],
    }
  );
}
