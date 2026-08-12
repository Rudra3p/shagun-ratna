import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default async function Icon() {
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
          borderRadius: '50%',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: 'Cormorant Garamond',
            fontWeight: 700,
            fontSize: 34,
            color: '#3d0a14',
            letterSpacing: '-1.5px',
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
