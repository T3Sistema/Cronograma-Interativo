import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import CompanyInput from './components/CompanyInput';
import ScheduleView from './components/ScheduleView';
import MarketAnalysisView from './components/MarketAnalysisView';
import AssistantButton from './components/AssistantButton';
import AssistantModal from './components/AssistantModal';
import DownloadButton from './components/DownloadButton';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generateMarketAnalysis, generateMonthlyPlan, getAssistantResponse, generateHolidayContentIdeas } from './services/openaiService';
import { getHolidays } from './constants/brazilianHolidays';
import { BRAZILIAN_STATES } from './constants/states';
import { MODELS } from './constants/models';
import { Schedule, Holiday, MarketAnalysisData, ChatMessage, MonthlyPlan, MarketAnalysis, HolidayIdeasCache } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import SparklesIcon from './components/icons/SparklesIcon';
import HolidayIdeasModal from './components/HolidayIdeasModal';

const getMonthsToDisplay = (numberOfMonths: number): string[] => {
    const months: string[] = [];
    const today = new Date();
    for (let i = 0; i < numberOfMonths; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        months.push(`${year}-${month}`);
    }
    return months;
}

function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [companyDescription, setCompanyDescription] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>(MODELS[0].id);
  const [schedule, setSchedule] = useState<Schedule>(new Map());
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysisData>(null);
  
  const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(false);
  const [isPlanLoading, setIsPlanLoading] = useState<boolean>(false);
  const [generationAttempted, setGenerationAttempted] = useState<boolean>(false);
  const [analysisForPlan, setAnalysisForPlan] = useState<MarketAnalysis | null>(null);

  const [monthsToDisplay, setMonthsToDisplay] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Assistant State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isAssistantEnabled, setIsAssistantEnabled] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isAssistantLoading, setIsAssistantLoading] = useState<boolean>(false);
  
  // Holiday Ideas State
  const [holidayIdeas, setHolidayIdeas] = useState<HolidayIdeasCache>(new Map());
  const [isIdeasModalOpen, setIsIdeasModalOpen] = useState<boolean>(false);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);

  const handleOpenHolidayModal = useCallback((holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setIsIdeasModalOpen(true);
  }, []);

  const handleCloseHolidayModal = () => {
    setIsIdeasModalOpen(false);
    setSelectedHoliday(null);
  };

  const handleGenerateAnalysis = useCallback(async () => {
    if (isAnalysisLoading || companyDescription.trim().length < 10 || !selectedState || !apiKey) return;

    setIsAnalysisLoading(true);
    setGenerationAttempted(true);
    setAnalysisForPlan(null);
    setSchedule(new Map()); 
    setIsAssistantEnabled(false);
    setChatHistory([]);
    setHolidayIdeas(new Map());
    
    setMarketAnalysis({ status: 'loading' });

    try {
        const stateName = BRAZILIAN_STATES.find(s => s.value === selectedState)?.name || selectedState;
        const analysis = await generateMarketAnalysis(apiKey, companyDescription, stateName, selectedModel);
        setMarketAnalysis({ status: 'success', data: analysis });
        setAnalysisForPlan(analysis);
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred.';
        setMarketAnalysis({ status: 'error', error: errorMsg });
        console.error(`Failed to generate market analysis`, error);
    } finally {
        setIsAnalysisLoading(false);
    }
  }, [apiKey, companyDescription, selectedState, selectedModel, isAnalysisLoading]);

  const handleGeneratePlan = useCallback(async () => {
    if (isPlanLoading || !analysisForPlan || !apiKey) return;

    setIsPlanLoading(true);
    setIsAssistantEnabled(false);
    setChatHistory([]);
    setHolidayIdeas(new Map());

    const newMonthsToDisplay = getMonthsToDisplay(1);
    setMonthsToDisplay(newMonthsToDisplay);

    const [currentMonthKey] = newMonthsToDisplay;
    const [yearStr] = currentMonthKey.split('-');
    const year = parseInt(yearStr, 10);

    const allHolidaysForYear = getHolidays(year, selectedState);
    const holidaysForMonth = allHolidaysForYear.filter(h => h.date.startsWith(currentMonthKey));
    
    const stateName = BRAZILIAN_STATES.find(s => s.value === selectedState)?.name || selectedState;

    const initialSchedule = new Map();
    initialSchedule.set(currentMonthKey, { status: 'loading', holidays: holidaysForMonth });
    setSchedule(initialSchedule);

    try {
        const monthlyPlan = await generateMonthlyPlan(
            apiKey,
            companyDescription, 
            stateName, 
            currentMonthKey, 
            holidaysForMonth, 
            analysisForPlan,
            selectedModel
        );
        
        const finalSchedule = new Map();
        finalSchedule.set(currentMonthKey, { status: 'success', data: monthlyPlan, holidays: holidaysForMonth });
        setSchedule(finalSchedule);
        
        // Setup Assistant Context
        const context = {
            marketAnalysis: analysisForPlan,
            plan: monthlyPlan,
        };

        const systemInstruction = `Você é um tutor de IA, um especialista sênior em marketing digital, estratégia de negócios e inteligência de mercado. Seu nome é "Assistente de Estratégia Triad3". Você SÓ PODE discutir o conteúdo do plano de marketing e da análise de mercado fornecidos. Se o usuário perguntar sobre algo fora do escopo, recuse educadamente e redirecione a conversa para o plano de marketing. Use o contexto para dar respostas precisas e detalhadas.
            DADOS DE CONTEXTO (Análise e Plano Gerado):
            \`\`\`json
            ${JSON.stringify(context, null, 2)}
            \`\`\`
            `;
        
        const welcomeMessage: ChatMessage = {
            role: 'assistant',
            text: 'Olá! Sou seu assistente de estratégia. Analisei todo o seu plano. Como posso ajudar a detalhar as estratégias ou campanhas para você?'
        }
        setChatHistory([{role: 'system', text: systemInstruction}, welcomeMessage]);
        setIsAssistantEnabled(true);

    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred.';
        const finalSchedule = new Map();
        finalSchedule.set(currentMonthKey, { status: 'error', error: errorMsg, holidays: holidaysForMonth });
        setSchedule(finalSchedule);
        console.error(`Failed to generate monthly plan for ${currentMonthKey}`, error);
    } finally {
        setIsPlanLoading(false);
    }
  }, [apiKey, companyDescription, selectedState, analysisForPlan, selectedModel, isPlanLoading]);

  const handleFetchHolidayIdeas = useCallback(async (date: string, name: string) => {
    if (holidayIdeas.has(date) && holidayIdeas.get(date)?.status !== 'error') return;

    setHolidayIdeas(prev => new Map(prev).set(date, { status: 'loading' }));
    
    try {
        const ideas = await generateHolidayContentIdeas(apiKey, companyDescription, name, date, selectedModel);
        setHolidayIdeas(prev => new Map(prev).set(date, { status: 'success', data: ideas }));
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Falha ao buscar ideias.';
        setHolidayIdeas(prev => new Map(prev).set(date, { status: 'error', error: errorMsg }));
        console.error(`Failed to fetch ideas for ${name}`, error);
    }
  }, [apiKey, companyDescription, selectedModel, holidayIdeas]);

  const handleDownloadPdf = useCallback(async () => {
    const analysisElement = document.getElementById('market-analysis-section');
    const scheduleElement = document.getElementById('schedule-section');

    if (!analysisElement) {
        console.error("Content elements for PDF not found.");
        return;
    }

    setIsDownloading(true);

    try {
        const pdf = new jsPDF('p', 'mm', 'a4', true);
        
        const processElement = async (element: HTMLElement) => {
            const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#0f172a', useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const imgPdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            let heightLeft = imgPdfHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgPdfHeight, undefined, 'FAST');
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgPdfHeight, undefined, 'FAST');
                heightLeft -= pdfHeight;
            }
        };

        await processElement(analysisElement);
        
        if (scheduleElement && schedule.size > 0 && schedule.values().next().value?.status === 'success') {
          pdf.addPage();
          await processElement(scheduleElement);
        }

        pdf.save(`Plano_Estrategico_Triad3_${new Date().toISOString().slice(0, 10)}.pdf`);

    } catch (error) {
        console.error("Failed to generate PDF", error);
    } finally {
        setIsDownloading(false);
    }
  }, [schedule]);


  const handleSendMessage = useCallback(async (message: string) => {
    if (isAssistantLoading || !message.trim() || !apiKey) return;

    setIsAssistantLoading(true);
    const userMessage: ChatMessage = { role: 'user', text: message };
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    
    try {
        const modelResponse = await getAssistantResponse(apiKey, selectedModel, newHistory);
        setChatHistory(prev => [...prev, modelResponse]);
    } catch(error) {
        console.error("Assistant chat error:", error);
        const errorMessage = error instanceof Error ? error.message : "Desculpe, ocorreu um erro desconhecido.";
        const errorResponse: ChatMessage = { role: 'assistant', text: errorMessage };
        setChatHistory(prev => [...prev, errorResponse]);
    } finally {
        setIsAssistantLoading(false);
    }
  }, [apiKey, selectedModel, chatHistory, isAssistantLoading]);


  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <main>
        <Header />
        <CompanyInput 
          apiKey={apiKey}
          setApiKey={setApiKey}
          companyDescription={companyDescription}
          setCompanyDescription={setCompanyDescription}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          onGenerate={handleGenerateAnalysis}
          isLoading={isAnalysisLoading}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {generationAttempted && (
              <div id="market-analysis-section">
                <MarketAnalysisView analysisData={marketAnalysis} />
              </div>
            )}
            
            {analysisForPlan && !isAnalysisLoading && (
                <div className="my-8 text-center border-t border-slate-700 pt-8">
                     <button
                        onClick={handleGeneratePlan}
                        disabled={isPlanLoading}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                    >
                        {isPlanLoading ? (
                        <>
                            <LoadingSpinner />
                            <span>Gerando Plano Mensal...</span>
                        </>
                        ) : (
                        <>
                            <SparklesIcon className="w-5 h-5" />
                            <span>Gerar Plano Mensal</span>
                        </>
                        )}
                    </button>
                </div>
            )}

            {schedule.size > 0 && (
                <>
                <div className="my-8 flex justify-end">
                    <DownloadButton onClick={handleDownloadPdf} isLoading={isDownloading} />
                </div>
                <div id="schedule-section">
                <ScheduleView 
                    schedule={schedule}
                    monthsToDisplay={monthsToDisplay}
                    generationAttempted={generationAttempted}
                    onOpenHolidayModal={handleOpenHolidayModal}
                />
                </div>
                </>
            )}
        </div>
      </main>

      {isAssistantEnabled && (
        <>
            <AssistantButton onClick={() => setIsAssistantOpen(true)} />
            <AssistantModal
                isOpen={isAssistantOpen}
                onClose={() => setIsAssistantOpen(false)}
                history={chatHistory}
                onSendMessage={handleSendMessage}
                isLoading={isAssistantLoading}
            />
        </>
      )}

      <HolidayIdeasModal
        isOpen={isIdeasModalOpen}
        onClose={handleCloseHolidayModal}
        holiday={selectedHoliday}
        holidayIdeasCache={holidayIdeas}
        onFetchHolidayIdeas={handleFetchHolidayIdeas}
      />

      <footer className="text-center p-6 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Cronograma Interativo Triad3. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;