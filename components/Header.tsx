import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center p-6 md:p-8 border-b border-slate-700/50">
      <div className="inline-flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-sm mb-4 shadow-lg">
        <SparklesIcon className="w-5 h-5 text-teal-400" />
        <span className="font-medium text-slate-300">
          <span className="text-slate-400 mr-1.5">Powered by:</span>
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400">
            Triad3 Inteligência Digital
          </span>
        </span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
        Cronograma Interativo Triad3
      </h1>
      <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
        Descreva sua empresa e nosso assistente virtual criará um calendário de conteúdo e tráfego para as principais datas comemorativas do Brasil.
      </p>
    </header>
  );
};

export default Header;
