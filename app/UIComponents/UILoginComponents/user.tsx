import {
 UserIcon
} from '@heroicons/react/24/outline';

import { auth } from "@/auth";
export default  async function User(){
    const  session = await auth();
    console.log("Session in User Component:", session);
    if(!session || !session.user){
        
        return <div>Loading...</div>;
    }
    return(
        <div>
          {/* <UserIcon className='w-6' /><p className="hidden md:block">Anand Parikh</p> */}
          <img src={session.user.image || ''} alt="User Avatar" className="w-8 h-8 rounded-full"/>
          <p className="hidden md:block">{session.user.name}</p>
        </div>
    );
}