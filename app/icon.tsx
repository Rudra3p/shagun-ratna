import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default async function Icon() {
  const fontData = await readFile(
    path.join(process.cwd(), 'assets/fonts/AlexBrush-Regular.woff')
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
            fontFamily: 'Alex Brush',
            fontSize: 54,
            color: '#6b1f2a',
            WebkitTextStroke: '1.5px #6b1f2a',
            paddingBottom: 6,
          }}
        >
          S
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Alex Brush', data: fontData, weight: 400, style: 'normal' }],
    }
  );
}
