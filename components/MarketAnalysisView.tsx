import React from 'react';
import { MarketAnalysisData, MarketFact, PurchaseJourneyStage } from '../types';
import LoadingSpinner from './LoadingSpinner';
import BriefcaseIcon from './icons/BriefcaseIcon';
import UsersIcon from './icons/UsersIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-700/50 text-teal-300 flex items-center justify-center">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        {children}
    </div>
);

const FactCard: React.FC<{ icon: React.ReactNode; fact: MarketFact; colorClass: string }> = ({ icon, fact, colorClass }) => (
    <div className="bg-slate-800 p-4 rounded-lg">
        <div className={`flex items-center gap-2 text-lg font-semibold ${colorClass}`}>
            {icon}
            <h4>{fact.point}</h4>
        </div>
        <p className="mt-2 text-slate-300 text-sm">{fact.description}</p>
    </div>
);

const MarketOverviewVisual: React.FC<{ data: MarketAnalysisData['data']['marketOverview'] }> = ({ data }) => (
    <div className="grid md:grid-cols-3 gap-4">
        <div>
            <h4 className="font-bold text-lg text-slate-200 mb-3 text-center">Oportunidades</h4>
            <div className="space-y-3">
                {data.opportunities.map((item, i) => <FactCard key={i} icon={<LightbulbIcon className="w-5 h-5"/>} fact={item} colorClass="text-green-400" />)}
            </div>
        </div>
        <div>
            <h4 className="font-bold text-lg text-slate-200 mb-3 text-center">Desafios</h4>
            <div className="space-y-3">
                 {data.challenges.map((item, i) => <FactCard key={i} icon={<AlertTriangleIcon className="w-5 h-5"/>} fact={item} colorClass="text-amber-400" />)}
            </div>
        </div>
        <div>
            <h4 className="font-bold text-lg text-slate-200 mb-3 text-center">Tendências</h4>
            <div className="space-y-3">
                {data.trends.map((item, i) => <FactCard key={i} icon={<TrendingUpIcon className="w-5 h-5"/>} fact={item} colorClass="text-sky-400" />)}
            </div>
        </div>
    </div>
);

const PsychographicProfileVisual: React.FC<{ data: MarketAnalysisData['data']['psychographicProfile'] }> = ({ data }) => (
    <div className="grid md:grid-cols-3 gap-4">
        <div>
            <h4 className="font-bold text-lg text-slate-200 mb-3">Valores</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                {data.values.map((item, i) => <li key={i}><strong className="text-slate-100">{item.point}:</strong> {item.description}</li>)}
            </ul>
        </div>
         <div>
            <h4 className="font-bold text-lg text-slate-200 mb-3">Estilo de Vida</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                {data.lifestyle.map((item, i) => <li key={i}><strong className="text-slate-100">{item.point}:</strong> {item.description}</li>)}
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-lg text-slate-200 mb-3">Dores e Necessidades</h4>
             <ul className="list-disc list-inside space-y-2 text-slate-300">
                {data.pains.map((item, i) => <li key={i}><strong className="text-slate-100">{item.point}:</strong> {item.description}</li>)}
            </ul>
        </div>
    </div>
);

const JourneyStage: React.FC<{ stage: PurchaseJourneyStage, index: number }> = ({ stage, index }) => (
    <div className="flex items-start gap-4">
        <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-lg z-10">{index + 1}</div>
            <div className="w-0.5 h-full bg-slate-600 min-h-[6rem]"></div>
        </div>
        <div className="pt-1.5">
            <h4 className="font-bold text-lg text-teal-300">{stage.stage}</h4>
            <p className="text-slate-300 mt-1 mb-2">{stage.description}</p>
            <div className="flex flex-wrap gap-2">
                {stage.touchpoints.map(tp => <span key={tp} className="bg-slate-700 text-slate-300 text-xs font-medium px-2 py-1 rounded-full">{tp}</span>)}
            </div>
        </div>
    </div>
)

const BehavioralAnalysisVisual: React.FC<{ data: MarketAnalysisData['data']['behavioralAnalysis'] }> = ({ data }) => (
    <div className="relative">
        {data.purchaseJourney.map((stage, i) => (
           <JourneyStage key={i} stage={stage} index={i} />
        ))}
    </div>
);


const MarketAnalysisView: React.FC<{ analysisData: MarketAnalysisData }> = ({ analysisData }) => {
    if (!analysisData) return null;

    if (analysisData.status === 'loading') {
        return (
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-teal-400 pl-4">Análise de Mercado Estratégica</h2>
                <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-400 bg-slate-800/50 rounded-xl">
                    <LoadingSpinner className="h-8 w-8" />
                    <span>Construindo infográfico de análise de mercado...</span>
                </div>
            </div>
        );
    }

    if (analysisData.status === 'error') {
        return (
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-teal-400 pl-4">Análise de Mercado Estratégica</h2>
                <div className="flex flex-col items-center justify-center h-48 text-red-400 bg-red-500/10 rounded-xl p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 mb-2"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                    <span className="font-semibold text-lg">Erro ao gerar Análise</span>
                    <p className="text-sm text-center mt-1">{analysisData.error || 'Não foi possível carregar a análise de mercado.'}</p>
                </div>
            </div>
        );
    }

    if (analysisData.status === 'success' && analysisData.data) {
        const { marketOverview, psychographicProfile, behavioralAnalysis } = analysisData.data;
        return (
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-teal-400 pl-4">Análise de Mercado (Infográfico)</h2>
                <div className="space-y-8">
                    <Section icon={<BriefcaseIcon className="w-7 h-7" />} title={marketOverview.title}>
                       <MarketOverviewVisual data={marketOverview} />
                    </Section>
                    <Section icon={<UsersIcon className="w-7 h-7" />} title={psychographicProfile.title}>
                        <PsychographicProfileVisual data={psychographicProfile} />
                    </Section>
                     <Section icon={<TrendingUpIcon className="w-7 h-7" />} title={behavioralAnalysis.title}>
                        <BehavioralAnalysisVisual data={behavioralAnalysis} />
                    </Section>
                </div>
            </div>
        );
    }

    return null;
}

export default MarketAnalysisView;