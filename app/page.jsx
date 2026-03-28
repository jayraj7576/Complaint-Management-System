'use client';

import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import { 
  CheckCircle, 
  HelpCircle, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Existing Sections */}
      <Hero />
      <Features />

      {/* How it Works section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 border-none sm:text-4xl uppercase">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              A streamlined 4-step process to ensure your grievances are heard and resolved efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Step 
              number="1" 
              title="Report" 
              desc="Submit your complaint with a title, category, and relevant attachments." 
              icon={Plus}
              color="blue"
            />
            <Step 
              number="2" 
              title="Track" 
              desc="Get a unique Ticket ID to monitor real-time updates on your dashboard."
              icon={Clock}
              color="orange"
            />
            <Step 
              number="3" 
              title="Process" 
              desc="Administrators assign your ticket to the relevant department head for action."
              icon={ShieldCheck}
              color="purple"
            />
            <Step 
              number="4" 
              title="Resolve" 
              desc="Receive a notification once the issue is rectified and leave your feedback."
              icon={CheckCircle}
              color="green"
            />
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-24 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 border-none uppercase">
                Frequently Asked Questions
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-semibold">Who can submit a complaint?</AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                All registered students and staff members of JSPM's Jayawantrao Sawant Polytechnic can use this portal to submit their legitimate grievances.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-semibold">How long does it take to resolve a ticket?</AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                Response times vary by category. Urgent items are typically addressed within 24 hours, while academic or infrastructure issues may take 3-5 working days.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-semibold">Is my complaint anonymous?</AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                For administrative purposes, your identity is associated with the ticket. However, strict confidentiality is maintained throughout the resolution process.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-semibold">What is the escalation policy?</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  If a complaint is not resolved within the defined turnaround time, it is automatically escalated to the higher administrative authorities for immediate review.
                </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
              <h3 className="text-2xl font-bold text-white mb-6 border-none italic">
                Ready to voice your grievance?
              </h3>
              <a 
                href="/login" 
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-colors shadow-xl"
              >
                  Login to Portal <ChevronRight size={20} />
              </a>
          </div>
      </section>
    </div>
  );
}

function Step({ number, title, desc, icon: Icon, color }) {
    const colors = {
        blue: 'bg-blue-100 text-blue-600',
        orange: 'bg-orange-100 text-orange-600',
        purple: 'bg-purple-100 text-purple-600',
        green: 'bg-green-100 text-green-600'
    };
    return (
        <div className="relative p-6 flex flex-col items-center">
            <div className={`p-4 rounded-3xl mb-4 ${colors[color]}`}>
                <Icon size={32} />
            </div>
            <div className="absolute top-2 left-1/2 -translate-x-12 opacity-10 font-bold text-6xl pointer-events-none">
                {number}
            </div>
            <h4 className="text-lg font-bold text-slate-900 border-none">{title}</h4>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-[200px]">{desc}</p>
        </div>
    );
}
