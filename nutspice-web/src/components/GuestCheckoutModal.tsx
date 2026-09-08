"use client";

import { ArrowRight, X, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface GuestCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuestCheckoutModal({ isOpen, onClose }: GuestCheckoutModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden text-center">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-brand/40 hover:text-brand hover:bg-brand/5 transition-all cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 bg-[#C5A059]/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-[#C5A059]">
          <ShieldCheck size={32} />
        </div>

        <h3 className="text-2xl font-serif font-bold text-brand mb-2">Sign In to Checkout</h3>
        <p className="text-brand/60 text-xs leading-relaxed mb-8">
          Please log in or sign up to complete your purchase. Your items will remain safely in your cart!
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/login?returnUrl=/cart")}
            className="w-full bg-[#1B3022] text-[#C5A059] py-4 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-[#25422f] transition-all shadow-lg flex items-center justify-center space-x-2 group cursor-pointer"
          >
            <span>Login / Register</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-brand/5 text-brand/70 py-3 rounded-xl font-bold tracking-widest uppercase text-[10px] hover:bg-brand/10 transition-all cursor-pointer"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
