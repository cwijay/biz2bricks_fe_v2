import '@/app/global.css'
import { inter } from '@/app/UIComponents/fonts';
import { Providers } from './providers';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`$(inter.className) antialiased`}>
          <Providers>{children}</Providers>
        </body>
    </html>
  );
}
