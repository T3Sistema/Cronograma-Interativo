import OpenAI from 'openai';
import { MonthlyPlan, Holiday, MarketAnalysis, ChatMessage } from '../types';

const getClient = (apiKey: string) => {
    if (!apiKey) {
        throw new Error("A chave de API da OpenAI não foi fornecida.");
    }
    return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
}

const monthsPt: { [key: string]: string } = {
  '01': 'Janeiro', '02': 'Fevereiro', '03': 'Março', '04': 'Abril',
  '05': 'Maio', '06': 'Junho', '07': 'Julho', '08': 'Agosto',
  '09': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
};

const handleApiError = (error: any, context: string): Error => {
    console.error(`Error during ${context}:`, error);
    let message = 'Falha ao comunicar com a API da OpenAI.';
    if (error instanceof OpenAI.APIError) {
        message = error.message || 'Ocorreu um erro na API da OpenAI.';
    }
    return new Error(`Falha em '${context}': ${message}`);
}

const parseJsonResponse = (text: string | null) => {
    if (!text) {
        throw new Error("A resposta da IA estava vazia.");
    }
    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse JSON response:", e, "Original text:", text);
        throw new Error("A resposta da IA não estava em um formato JSON válido.");
    }
}

export const generateMarketAnalysis = async (
    apiKey: string,
    companyDescription: string,
    stateName: string,
    model: string,
): Promise<MarketAnalysis> => {
    const openai = getClient(apiKey);
    const systemPrompt = `Você é um analista de mercado sênior, um consultor 'game changer'. Sua tarefa é criar uma análise de mercado profunda para uma empresa, que será usada para construir um infográfico. Responda SEMPRE com um único objeto JSON estruturado conforme o solicitado, sem nenhum texto ou formatação adicional.`;
    
    const userPrompt = `
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
        const response = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
        });
        const content = response.choices[0].message.content;
        return parseJsonResponse(content);
    } catch (error) {
        throw handleApiError(error, `geração da análise de mercado`);
    }
};

export const generateMonthlyPlan = async (
    apiKey: string,
    companyDescription: string,
    stateName: string,
    monthKey: string,
    holidaysForMonth: Holiday[],
    marketAnalysis: MarketAnalysis,
    model: string,
): Promise<MonthlyPlan> => {
    const openai = getClient(apiKey);
    const [_, monthNumber] = monthKey.split('-');
    const monthName = monthsPt[monthNumber];
    
    const systemPrompt = `Você é um estrategista de marketing digital sênior. Sua tarefa é criar um plano tático mensal detalhado para uma empresa, com base na análise de mercado fornecida. Responda SEMPRE com um único objeto JSON estruturado conforme o solicitado, sem nenhum texto ou formatação adicional.`;
    
    const userPrompt = `
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
        const response = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
        });
        const content = response.choices[0].message.content;
        return parseJsonResponse(content);
    } catch (error) {
        throw handleApiError(error, `geração do plano mensal para ${monthName}`);
    }
};


export const getAssistantResponse = async (
    apiKey: string,
    model: string,
    history: ChatMessage[]
): Promise<ChatMessage> => {
    const openai = getClient(apiKey);
    
    try {
        const response = await openai.chat.completions.create({
            model: model,
            messages: history.map(m => ({role: m.role, content: m.text})),
        });
        const content = response.choices[0].message.content;
        return { role: 'assistant', text: content || "Não recebi uma resposta." };
    } catch (error) {
        const err = handleApiError(error, `resposta do assistente`);
        return { role: 'assistant', text: err.message };
    }
};

export const generateHolidayContentIdeas = async (
    apiKey: string,
    companyDescription: string,
    holidayName: string,
    holidayDate: string,
    model: string
): Promise<string[]> => {
    const openai = getClient(apiKey);
    
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
        const response = await openai.chat.completions.create({
            model: model,
            messages: [{role: 'user', content: prompt}],
            response_format: { type: "json_object" },
        });
        const content = response.choices[0].message.content;
        // OpenAI can return the JSON object directly, or a JSON object with a key containing the array.
        // Let's try to be robust.
        const parsed = parseJsonResponse(content);
        if (Array.isArray(parsed)) {
            return parsed;
        }
        if (typeof parsed === 'object' && parsed !== null) {
            const key = Object.keys(parsed)[0];
            if (key && Array.isArray(parsed[key])) {
                return parsed[key];
            }
        }
        throw new Error("A resposta da IA não retornou um array de strings no formato esperado.");
    } catch (error) {
        throw handleApiError(error, `geração de ideias para ${holidayName}`);
    }
};