import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const size = { width: 200, height: 200 };
export const contentType = 'image/png';

export default async function Icon() {
  const fontData = await readFile(
    path.join(process.cwd(), 'assets/fonts/Manrope-ExtraBold.woff')
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
        }}
      >
        <div style={{ display: 'flex', fontFamily: 'Manrope', fontWeight: 800, fontSize: 180, color: '#6b1f2a' }}>
          R
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Manrope', data: fontData, weight: 800, style: 'normal' }] }
  );
}
