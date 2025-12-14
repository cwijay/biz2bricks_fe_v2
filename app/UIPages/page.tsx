
import { lusitana } from "@/app/UIComponents/fonts";
import LoginForm from "@/app/UIComponents/UILoginComponents/login-form";
import GoogleLogin from "@/app/UIComponents/UILoginComponents/google-login";

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen p-8 gap-8">
      {/* Left column: static content */}
      <div className="md:w-1/2 w-full flex flex-col justify-center items-start bg-gray-50 rounded-lg p-8">
        <h1 className={`${lusitana.className} mb-6 text-2xl md:text-3xl font-bold`}>Dashboard</h1>
        <p className="mb-4 text-gray-700 text-base md:text-lg">
          Welcome to the dashboard! Here you can find useful information, tips, or any static content you want to display to your users. You can customize this section as needed.
        </p>
        <ul className="list-disc pl-6 text-gray-600">
          <li>Feature 1: Quick access to your data</li>
          <li>Feature 2: Secure login and user management</li>
          <li>Feature 3: Responsive design for all devices</li>
        </ul>
      </div>
      {/* Right column: login form */}
      <div className="md:w-1/2 w-full flex flex-col justify-center items-center bg-white rounded-lg p-8 shadow">
        {/* <LoginForm /> */}
        <h1>Login with Google</h1>
        <GoogleLogin />
      </div>
    </div>
  );
}
