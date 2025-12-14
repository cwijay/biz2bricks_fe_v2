"use client";
import { useState } from "react";
import { Button } from '../UIGenericComponents/button';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    mobile: "",
    address: "",
    captcha: ""
  });


  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCancel() {
    router.push('/');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Registration logic here
    alert("Registration submitted!");
  }

  return (
    <form className="space-y-4 max-w-md mx-auto bg-gray-50 p-8 rounded-lg shadow" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4">User Registration</h2>
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-xs font-medium mb-1">First Name</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} required className="w-full rounded border px-2 py-1" />
        </div>
        <div className="w-1/2">
          <label className="block text-xs font-medium mb-1">Last Name</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} required className="w-full rounded border px-2 py-1" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Company Name</label>
        <input name="companyName" value={form.companyName} onChange={handleChange} required className="w-full rounded border px-2 py-1" />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Email ID</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full rounded border px-2 py-1" />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Mobile No</label>
        <input name="mobile" type="tel" value={form.mobile} onChange={handleChange} required className="w-full rounded border px-2 py-1" />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Mailing Address</label>
        <textarea name="address" value={form.address} onChange={handleChange} required className="w-full rounded border px-2 py-1" />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Captcha</label>
        <input name="captcha" value={form.captcha} onChange={handleChange} required className="w-full rounded border px-2 py-1" placeholder="Enter captcha" />
      </div>
      <Button type="submit" className="w-32 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 mt-4">Register</Button>
    </form>
  );
}
