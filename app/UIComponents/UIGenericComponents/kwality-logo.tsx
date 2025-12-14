import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/UIComponents/fonts';
import Image from 'next/image';

export default function KwalityLogo() {
  return (
    <Image 
      src='/KwalityLogo.jpeg'
      alt='Kwality IceCream'
      width={400}
      height={400}
      style={{ background: 'none' }}
    />
  );
}
