import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import SparklesIcon from './icons/SparklesIcon';
import KeyIcon from './icons/KeyIcon';
import EyeIcon from './icons/EyeIcon';
import EyeOffIcon from './icons/EyeOffIcon';
import { BRAZILIAN_STATES } from '../constants/states';
import { MODELS } from '../constants/models';

interface CompanyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  companyDescription: string;
  setCompanyDescription: (description: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
    </svg>
);

const Step: React.FC<{
    stepNumber: number;
    title: string;
    description: string;
    status: 'active' | 'completed' | 'inactive';
    isLast?: boolean;
    children: React.ReactNode;
}> = ({ stepNumber, title, description, status, isLast = false, children }) => {
    
    const statusClasses = {
        circle: {
            active: 'bg-teal-500 text-white ring-4 ring-teal-500/30',
            completed: 'bg-teal-500 text-white',
            inactive: 'bg-slate-700 text-slate-400',
        },
        content: {
            active: 'border-teal-500',
            completed: 'border-slate-700',
            inactive: 'border-slate-800',
        }
    };

    return (
        <div className={`relative flex items-start ${!isLast ? 'pb-8' : ''}`}>
            {/* Connecting line */}
            {!isLast && (
                 <div className="absolute left-6 top-0 h-full w-0.5 bg-slate-700" aria-hidden="true"/>
            )}
           
            {/* Icon */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-300 ${statusClasses.circle[status]} z-10`}>
                {status === 'completed' ? <CheckIcon className="w-6 h-6"/> : stepNumber}
            </div>

            {/* Content */}
            <div className={`ml-6 flex-1 bg-slate-800/50 p-6 rounded-xl border transition-colors duration-300 ${statusClasses.content[status]}`}>
                <h3 className="text-lg font-bold text-slate-100">{title}</h3>
                <p className="text-sm text-slate-400 mt-1 mb-4">{description}</p>
                {children}
            </div>
        </div>
    )
};


const CompanyInput: React.FC<CompanyInputProps> = ({
  apiKey,
  setApiKey,
  companyDescription,
  setCompanyDescription,
  selectedState,
  setSelectedState,
  selectedModel,
  setSelectedModel,
  onGenerate,
  isLoading,
}) => {
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  
  const step1Complete = apiKey.trim().length >= 10;
  const step2Complete = companyDescription.trim().length >= 10;
  const step3Complete = !!selectedState;
  
  const isButtonDisabled = isLoading || !step1Complete || !step2Complete || !step3Complete;

  let activeStep = 0;
  if (step1Complete) activeStep = 1;
  if (step1Complete && step2Complete) activeStep = 2;
  if (step1Complete && step2Complete && step3Complete) activeStep = 3;
  if (isButtonDisabled) activeStep = Math.min(activeStep, 3);
  else activeStep = 4;


  const getStatus = (stepIndex: number): 'active' | 'completed' | 'inactive' => {
      if(stepIndex < activeStep) return 'completed';
      if(stepIndex === activeStep) return 'active';
      return 'inactive';
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
            <Step stepNumber={1} title="Insira sua Chave API da OpenAI" description="Sua chave é usada apenas para esta sessão e não é armazenada." status={getStatus(0)}>
                 <div className="relative">
                    <KeyIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="api-key"
                      type={isKeyVisible ? 'text' : 'password'}
                      className="w-full pl-12 pr-12 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition duration-200"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setIsKeyVisible(!isKeyVisible)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      aria-label={isKeyVisible ? 'Ocultar chave' : 'Mostrar chave'}
                    >
                      {isKeyVisible ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
            </Step>
            
            <Step stepNumber={2} title="Descreva sua empresa" description="Forneça detalhes sobre seu negócio, segmento e público-alvo. (mín. 10 caracteres)" status={getStatus(1)}>
                <textarea
                    id="company-description"
                    rows={4}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition duration-200"
                    placeholder="Ex: Somos uma startup de moda sustentável que vende roupas feitas de material reciclado para o público jovem..."
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    disabled={isLoading}
                />
            </Step>

            <Step stepNumber={3} title="Selecione seu estado" description="Isso nos ajuda a incluir feriados e eventos regionais relevantes no seu cronograma." status={getStatus(2)}>
                 <select
                    id="state-select"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition duration-200"
                  >
                    <option value="" disabled>Selecione um estado...</option>
                    {BRAZILIAN_STATES.map(state => (
                      <option key={state.value} value={state.value}>{state.name}</option>
                    ))}
                  </select>
            </Step>

            <Step stepNumber={4} title="Escolha o Modelo de IA" description="Modelos diferentes oferecem um balanço entre velocidade, custo e qualidade da análise." status={getStatus(3)} isLast={true}>
                 <select
                    id="model-select"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition duration-200"
                  >
                    {MODELS.map(model => (
                      <option key={model.id} value={model.id}>{model.name}</option>
                    ))}
                  </select>
            </Step>

        <div className="pt-6 text-center">
          <button
            onClick={onGenerate}
            disabled={isButtonDisabled}
            className="inline-flex items-center justify-center gap-3 px-10 py-4 font-bold text-lg text-white bg-teal-500 rounded-lg shadow-lg shadow-teal-500/20 hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span>Gerando Análise...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-6 h-6" />
                <span>Gerar Análise de Mercado</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyInput;