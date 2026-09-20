import React from 'react';
import { Compass, ArrowRight, Home } from 'lucide-react';

interface NotFoundPageProps {
  navigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ navigate }) => {
  return (
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 text-[#075985] flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 text-[#0284C7]" />
        </div>
        <span className="text-4xl font-extrabold font-serif text-slate-900 block">404</span>
        <h1 className="text-xl font-bold font-serif text-slate-800">Page Not Found</h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          The requested page could not be located. Please check the URL or return to the main healthcare travel portal.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#075985] hover:bg-[#0369a1] flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </button>
          <button
            onClick={() => navigate('/services')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200"
          >
            View Services
          </button>
        </div>
      </div>
    </div>
  );
};
