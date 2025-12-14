"use client";
import { useState } from "react";
import RegisterForm from "@/app/UIComponents/UILoginComponents/register-form";
import { Button } from '../UIGenericComponents/button';

export default function RegisterModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
        <RegisterForm />
      </div>
    </div>
  );
}
