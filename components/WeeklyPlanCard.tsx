import React from 'react';
import { WeeklyPlan } from '../types';

const DetailItem: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
    <div className={className}>
        <dt className="text-sm font-medium text-slate-400">{label}</dt>
        <dd className="mt-1 text-slate-200">{children}</dd>
    </div>
);

const IdeaItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-400 flex-shrink-0 mt-1"><path d="m12 5 3 3-3 3-3-3 3-3zM5 12l3 3-3 3-3-3 3-3zM12 19l3 3-3 3-3-3 3-3zM19 12l3 3-3 3-3-3 3-3z"/></svg>
        <span>{children}</span>
    </li>
);

const WeeklyPlanCard: React.FC<{ weekPlan: WeeklyPlan }> = ({ weekPlan }) => {
    const { week, theme, holidays, ideiasGuia, trafficCampaign } = weekPlan;

    return (
        <div className="bg-slate-800/70 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-slate-800">
                <h3 className="text-xl font-bold text-white">Semana {week}: <span className="text-teal-300">{theme}</span></h3>
                {holidays && holidays.length > 0 && holidays.some(h => h.trim()) && (
                     <p className="text-sm text-slate-400 mt-1">🎉 Foco em: {holidays.join(', ')}</p>
                )}
            </div>
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Content Ideas */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-white">💡 Ideias Guia</h4>
                    <ul className="space-y-3 text-slate-300">
                        {ideiasGuia.map((idea, index) => <IdeaItem key={index}>{idea}</IdeaItem>)}
                    </ul>
                </div>

                {/* Traffic Campaign */}
                <div className="space-y-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-lg text-white">🎯 Campanha de Tráfego Pago</h4>
                    <dl className="space-y-4">
                        <DetailItem label="Plataforma">{trafficCampaign.platform}</DetailItem>
                        <DetailItem label="Objetivo da Campanha">{trafficCampaign.objective}</DetailItem>
                        <div>
                            <dt className="text-sm font-medium text-slate-400">Público-Alvo</dt>
                            <dd className="mt-2 text-slate-300 border-l-2 border-slate-600 pl-3 space-y-2">
                                <p><strong className="font-medium text-slate-200">Descrição:</strong> {trafficCampaign.targetAudience.description}</p>
                                <p><strong className="font-medium text-slate-200">Localização:</strong> {trafficCampaign.targetAudience.location}</p>
                                <p><strong className="font-medium text-slate-200">Idade:</strong> {trafficCampaign.targetAudience.age}</p>
                                <p><strong className="font-medium text-slate-200">Interesses:</strong> {trafficCampaign.targetAudience.interests.join(', ')}</p>
                            </dd>
                        </div>
                         <DetailItem label="Sugestão de Anúncio (Copy)">
                            <p className="whitespace-pre-wrap italic">"{trafficCampaign.adCopySuggestion}"</p>
                        </DetailItem>
                        {trafficCampaign.keywords && trafficCampaign.keywords.length > 0 && (
                            <DetailItem label="Palavras-chave (Google Ads)">
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {trafficCampaign.keywords.map((kw, i) => <span key={i} className="bg-teal-400/10 text-teal-300 text-xs font-mono px-2 py-1 rounded">{kw}</span>)}
                                </div>
                            </DetailItem>
                        )}
                    </dl>
                </div>
            </div>
        </div>
    )
};

export default WeeklyPlanCard;