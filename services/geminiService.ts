import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { MonthlyPlan, Holiday, MarketAnalysis } from '../types';

// =================================================================================
// NOTA: A chave de API é gerenciada via variável de ambiente (process.env.API_KEY)
// e não deve ser exposta ou solicitada no lado do cliente em um app de produção.
// Este app assume que a variável está configurada no ambiente de execução.
// =================================================================================

let ai: GoogleGenAI | null = null;
const getAI = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("A chave de API do Google Gemini não foi encontrada. Configure a variável de ambiente API_KEY.");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}


const monthsPt: { [key: string]: string } = {
  '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril',
  '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto',
  '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
};

const handleApiError = (error: any, context: string): Error => {
    console.error(`Error during ${context}:`, error);
    const message = error.message || 'Falha ao comunicar com a API do Google Gemini.';
    // Adicionar tratamento para erros específicos do Gemini se necessário
    return new Error(`Falha em '${context}': ${message}`);
}

const parseJsonResponse = (text: string) => {
    let jsonStr = text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse JSON response:", e, "Original text:", text);
        throw new Error("A resposta da IA não estava em um formato JSON válido.");
    }
}


export const generateMarketAnalysis = async (
    companyDescription: string,
    stateName: string,
    model: string,
): Promise<MarketAnalysis> => {
    const ai = getAI();
    const systemPrompt = `Você é um analista de mercado sênior, um consultor 'game changer'. Sua tarefa é criar uma análise de mercado profunda para uma empresa, que será usada para construir um infográfico. Responda SEMPRE com um único objeto JSON estruturado conforme o solicitado, sem nenhum texto ou formatação adicional.`;
    
    const userPrompt = `
        ${systemPrompt}

        **Informações da Empresa:**
        "${companyDescription}"

        **Estado de Atuação:**
        ${stateName}
        
        **Estrutura JSON de Saída Obrigatória:**
        {
            "marketOverview": {
                "title": "Visão Geral do Mercado de [Setor] em ${stateName}",
                "opportunities": [{"point": "Oportunidade 1", "description": "Descrição concisa e estratégica da oportunidade."}],
                "challenges": [{"point": "Desafio 1", "description": "Descrição concisa e estratégica do desafio."}],
                "trends": [{"point": "Tendência 1", "description": "Descrição concisa e estratégica da tendência."}]
            },
            "psychographicProfile": {
                "title": "Raio-X do Cliente Ideal",
                "values": [{"point": "Valor Principal 1", "description": "Como este valor guia as decisões do cliente."}],
                "lifestyle": [{"point": "Hábito ou Estilo de Vida 1", "description": "Descrição do hábito e como a empresa se encaixa nele."}],
                "pains": [{"point": "Dor ou Necessidade 1", "description": "Qual problema latente a empresa resolve."}]
            },
            "behavioralAnalysis": {
                "title": "Jornada de Compra Comportamental",
                "purchaseJourney": [
                    {"stage": "Reconhecimento", "description": "Como o cliente descobre que tem um problema.", "touchpoints": ["Redes Sociais", "Blogs"]},
                    {"stage": "Consideração", "description": "O que o cliente pesquisa e compara.", "touchpoints": ["Reviews", "Site", "Comparativos"]},
                    {"stage": "Decisão", "description": "Fatores que levam à compra.", "touchpoints": ["Depoimentos", "Oferta Direta"]},
                    {"stage": "Fidelização", "description": "Como manter o cliente engajado após a compra.", "touchpoints": ["Email Marketing", "Comunidade VIP"]}
                ]
            }
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: userPrompt,
            config: { responseMimeType: "application/json" }
        });
        const content = response.text;
        return parseJsonResponse(content);
    } catch (error) {
        throw handleApiError(error, `geração da análise de mercado`);
    }
};

export const generateMonthlyPlan = async (
    companyDescription: string,
    stateName: string,
    monthKey: string,
    holidaysForMonth: Holiday[],
    marketAnalysis: MarketAnalysis,
    model: string,
): Promise<MonthlyPlan> => {
    const ai = getAI();
    const [_, monthNumber] = monthKey.split('-');
    const monthName = monthsPt[monthNumber];
    
    const systemPrompt = `Você é um estrategista de marketing digital sênior. Sua tarefa é criar um plano tático mensal detalhado para uma empresa, com base na análise de mercado fornecida. Responda SEMPRE com um único objeto JSON estruturado conforme o solicitado, sem nenhum texto ou formatação adicional.`;
    
    const userPrompt = `
        ${systemPrompt}

        **Informações da Empresa:**
        "${companyDescription}"
        **Estado de Atuação:** ${stateName}
        **Mês do Planejamento:** ${monthName}
        **Análise de Mercado (Contexto Estratégico):**
        \`\`\`json
        ${JSON.stringify(marketAnalysis, null, 2)}
        \`\`\`
        **Datas Comemorativas Relevantes:**
        ${holidaysForMonth.length > 0 ? holidaysForMonth.map(h => `- ${h.name}`).join('\n') : "Nenhuma data principal."}

        **Estrutura JSON de Saída Obrigatória:**
        {
            "month": "${monthName}",
            "weeks": [
              {
                "week": 1,
                "theme": "O tema central e estratégico da semana 1, alinhado à análise...",
                "holidays": ["Nome do Feriado na Semana 1, se houver"],
                "ideiasGuia": [
                  "Ideia Guia 1: Descreva a execução e justifique o valor estratégico com base na análise. Ex: 'Criar um Reels mostrando os bastidores do [processo X], humanizando a marca para conectar com o valor de autenticidade do público.'",
                  "Ideia Guia 2: 'Publicar um carrossel educativo sobre [tópico Y], para atacar a dor [dor do cliente] e posicionar como autoridade.'",
                  "Ideia Guia 3: '...'",
                  "Ideia Guia 4: '...'"
                ],
                "trafficCampaign": {
                  "platform": "Meta Ads (Instagram/Facebook)",
                  "objective": "Ex: 'Alcance' para educar sobre um novo conceito.",
                  "targetAudience": {
                    "description": "Justifique o público. Ex: 'Público frio (lookalike 1% de compradores) para expandir a base e alcançar novos clientes com o mesmo perfil psicográfico.'",
                    "location": "Cidades principais de ${stateName}",
                    "age": "28-45",
                    "interests": ["interesse estratégico 1", "interesse estratégico 2"]
                  },
                  "adCopySuggestion": "Crie uma copy persuasiva, baseada em um insight comportamental da análise.",
                  "keywords": []
                }
              }
            ]
        }
        
        **Instruções de Mestre:**
        - Fundamente tudo com base na análise fornecida.
        - Seja específico nos públicos (frio, morno, quente, lookalike, remarketing).
        - Se a campanha for no Google Ads, preencha "keywords".
        - OBRIGATÓRIO: Forneça exatamente 4 "ideiasGuia" para cada semana e preencha TODOS os campos para as 4 semanas.
    `;

    try {
         const response = await ai.models.generateContent({
            model: model,
            contents: userPrompt,
            config: { responseMimeType: "application/json" }
        });
        const content = response.text;
        return parseJsonResponse(content);
    } catch (error) {
        throw handleApiError(error, `geração do plano mensal para ${monthName}`);
    }
};


export const createChatSession = (model: string, systemInstruction: string): Chat => {
    const ai = getAI();
    return ai.chats.create({
        model: model,
        config: {
            systemInstruction: systemInstruction,
        },
    });
};

export const generateHolidayContentIdeas = async (
    companyDescription: string,
    holidayName: string,
    holidayDate: string,
    model: string
): Promise<string[]> => {
    const ai = getAI();
    
    const prompt = `
      Você é um criativo de marketing digital especializado em conteúdo de oportunidade.
      Sua tarefa é gerar 3 ideias de conteúdo curtas, diretas e impactantes para uma empresa, aproveitando uma data comemorativa específica.

      **Empresa:**
      "${companyDescription}"

      **Data Comemorativa:**
      - Nome: ${holidayName}
      - Data: ${holidayDate}

      **Formato da Resposta:**
      Responda com um array JSON de strings. Cada string é uma ideia de conteúdo.
      Exemplo: ["Fazer uma live com especialistas sobre [tema relacionado].", "Criar um post de carrossel com 3 dicas rápidas sobre [assunto].", "Lançar uma oferta especial de 24h com a hashtag #[NomeDoFeriado]."]

      Seja criativo e conecte as ideias ao negócio descrito. Gere EXATAMENTE 3 ideias.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        const content = response.text;
        const ideas = parseJsonResponse(content);
        if (Array.isArray(ideas) && ideas.every(i => typeof i === 'string')) {
            return ideas;
        }
        throw new Error("A resposta da IA não retornou um array de strings.");
    } catch (error) {
        throw handleApiError(error, `geração de ideias para ${holidayName}`);
    }
};