import Link from 'next/link';
import NavLinks from '@/app/UIComponents/UINavComponents/nav-links';
import KwalityLogo from '@/app/UIComponents/UIGenericComponents/kwality-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import User from '../UILoginComponents/user';
import Logout from '@/app/UIComponents/UILoginComponents/logout';
export default function SideNav() {

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex items-start justify-start mb-8">
        <KwalityLogo />
      </div>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <User />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        {/* <form>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3" >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form> */}
        <Logout />
      </div>
    </div>
  );
}
