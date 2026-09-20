import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const whatsappNumber = '919876543210';
  const defaultMessage = encodeURIComponent(
    'Hello Pranava Nexus Care team, I would like assistance with medical travel coordination and treatment enquiries.'
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end group">
      <div className="hidden md:flex items-center mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span>Chat with Travel Coordinator</span>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Pranava Nexus Care on WhatsApp"
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-8 h-8 fill-current" />
        <span className="sr-only">WhatsApp Coordination Desk</span>
      </a>
    </div>
  );
};
