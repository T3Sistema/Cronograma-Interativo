import { Holiday } from '../types';

// Helper para formatar data como YYYY-MM-DD
const formatDate = (d: Date): string => {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Algoritmo Computus (Meeus/Jones/Butcher) para encontrar o Domingo de Páscoa
const getEaster = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

// Helper para obter o N-ésimo dia da semana de um mês
// mês é 0-indexado, diaDaSemana é 0=Dom, 1=Seg...
const getNthWeekdayOfMonth = (year: number, month: number, dayOfWeek: number, n: number): Date => {
    const d = new Date(year, month, 1);
    const firstDay = d.getDay();
    let day = (dayOfWeek - firstDay + 7) % 7 + 1;
    day += (n - 1) * 7;
    return new Date(year, month, day);
};


const getNationalHolidays = (year: number): Holiday[] => {
    const holidays: Holiday[] = [];
    const easter = getEaster(year);
    const startOfAutumn = new Date(year, 2, 20);
    const startOfWinter = new Date(year, 5, 21);
    const startOfSpring = new Date(year, 8, 22);
    const startOfSummer = new Date(year, 11, 21);

    // Datas Comemorativas e Feriados Fixos (Expandido)
    holidays.push({ date: `${year}-01-01`, name: 'Confraternização Universal' });
    holidays.push({ date: `${year}-01-04`, name: 'Dia Mundial do Braille' });
    holidays.push({ date: `${year}-01-06`, name: 'Dia de Reis / Dia da Gratidão' });
    holidays.push({ date: `${year}-01-07`, name: 'Dia do Leitor' });
    holidays.push({ date: `${year}-01-15`, name: 'Dia Mundial do Compositor' });
    holidays.push({ date: `${year}-01-30`, name: 'Dia da Saudade' });
    holidays.push({ date: `${year}-02-01`, name: 'Dia do Publicitário' });
    holidays.push({ date: `${year}-02-10`, name: 'Dia da Pizza (BR)' });
    holidays.push({ date: `${year}-02-14`, name: 'Dia de São Valentim' });
    holidays.push({ date: `${year}-02-19`, name: 'Dia do Esportista' });
    holidays.push({ date: `${year}-03-08`, name: 'Dia Internacional da Mulher' });
    holidays.push({ date: `${year}-03-15`, name: 'Dia do Consumidor' });
    holidays.push({ date: formatDate(startOfAutumn), name: 'Início do Outono' });
    holidays.push({ date: `${year}-03-20`, name: 'Dia Internacional da Felicidade' });
    holidays.push({ date: `${year}-03-21`, name: 'Dia Mundial da Poesia' });
    holidays.push({ date: `${year}-03-22`, name: 'Dia Mundial da Água' });
    holidays.push({ date: `${year}-04-01`, name: 'Dia da Mentira' });
    holidays.push({ date: `${year}-04-07`, name: 'Dia Mundial da Saúde / Dia do Jornalista' });
    holidays.push({ date: `${year}-04-13`, name: 'Dia do Beijo' });
    holidays.push({ date: `${year}-04-18`, name: 'Dia Nacional do Livro Infantil' });
    holidays.push({ date: `${year}-04-21`, name: 'Tiradentes' });
    holidays.push({ date: `${year}-04-22`, name: 'Descobrimento do Brasil' });
    holidays.push({ date: `${year}-04-23`, name: 'Dia Mundial do Livro' });
    holidays.push({ date: `${year}-04-28`, name: 'Dia da Educação' });
    holidays.push({ date: `${year}-05-01`, name: 'Dia do Trabalho' });
    holidays.push({ date: `${year}-05-13`, name: 'Dia do Automóvel' });
    holidays.push({ date: `${year}-05-25`, name: 'Dia do Orgulho Geek / Dia da Toalha' });
    holidays.push({ date: `${year}-05-28`, name: 'Dia Mundial do Hambúrguer' });
    holidays.push({ date: `${year}-06-01`, name: 'Dia da Imprensa' });
    holidays.push({ date: `${year}-06-05`, name: 'Dia Mundial do Meio Ambiente' });
    holidays.push({ date: `${year}-06-12`, name: 'Dia dos Namorados' });
    holidays.push({ date: formatDate(startOfWinter), name: 'Início do Inverno' });
    holidays.push({ date: `${year}-06-21`, name: 'Dia do Mídia' });
    holidays.push({ date: `${year}-06-24`, name: 'São João' });
    holidays.push({ date: `${year}-06-28`, name: 'Dia do Orgulho LGBTQIA+' });
    holidays.push({ date: `${year}-07-10`, name: 'Dia da Pizza' });
    holidays.push({ date: `${year}-07-13`, name: 'Dia Mundial do Rock' });
    holidays.push({ date: `${year}-07-15`, name: 'Dia do Homem' });
    holidays.push({ date: `${year}-07-20`, name: 'Dia do Amigo' });
    holidays.push({ date: `${year}-07-25`, name: 'Dia do Motorista / Dia do Escritor' });
    holidays.push({ date: `${year}-07-26`, name: 'Dia dos Avós' });
    holidays.push({ date: `${year}-08-11`, name: 'Dia do Estudante / Dia do Advogado' });
    holidays.push({ date: `${year}-08-15`, name: 'Dia dos Solteiros' });
    holidays.push({ date: `${year}-08-19`, name: 'Dia Mundial da Fotografia' });
    holidays.push({ date: `${year}-09-07`, name: 'Independência do Brasil' });
    holidays.push({ date: `${year}-09-15`, name: 'Dia do Cliente' });
    holidays.push({ date: formatDate(startOfSpring), name: 'Início da Primavera' });
    holidays.push({ date: `${year}-09-21`, name: 'Dia da Árvore' });
    holidays.push({ date: `${year}-09-22`, name: 'Dia Mundial Sem Carro' });
    holidays.push({ date: `${year}-09-27`, name: 'Dia Mundial do Turismo' });
    holidays.push({ date: `${year}-09-30`, name: 'Dia da Secretária' });
    holidays.push({ date: `${year}-10-01`, name: 'Dia do Vendedor' });
    holidays.push({ date: `${year}-10-04`, name: 'Dia Mundial dos Animais' });
    holidays.push({ date: `${year}-10-12`, name: 'Nossa Senhora Aparecida / Dia das Crianças' });
    holidays.push({ date: `${year}-10-15`, name: 'Dia do Professor' });
    holidays.push({ date: `${year}-10-25`, name: 'Dia do Macarrão' });
    holidays.push({ date: `${year}-10-31`, name: 'Dia das Bruxas (Halloween)' });
    holidays.push({ date: `${year}-11-02`, name: 'Finados' });
    holidays.push({ date: `${year}-11-15`, name: 'Proclamação da República' });
    holidays.push({ date: `${year}-11-19`, name: 'Dia da Bandeira' });
    holidays.push({ date: `${year}-11-20`, name: 'Dia da Consciência Negra' }); // Data importante, mesmo sendo feriado local em alguns estados
    holidays.push({ date: formatDate(startOfSummer), name: 'Início do Verão' });
    holidays.push({ date: `${year}-12-24`, name: 'Véspera de Natal' });
    holidays.push({ date: `${year}-12-25`, name: 'Natal' });
    holidays.push({ date: `${year}-12-31`, name: 'Véspera de Ano Novo' });

    // Feriados móveis
    const carnival = new Date(easter);
    carnival.setDate(easter.getDate() - 47);
    holidays.push({ date: formatDate(carnival), name: 'Carnaval' });

    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);
    holidays.push({ date: formatDate(goodFriday), name: 'Sexta-feira Santa' });
    
    const corpusChristi = new Date(easter);
    corpusChristi.setDate(easter.getDate() + 60);
    holidays.push({ date: formatDate(corpusChristi), name: 'Corpus Christi' });

    const mothersDay = getNthWeekdayOfMonth(year, 4, 0, 2); // 2º Domingo de Maio
    holidays.push({ date: formatDate(mothersDay), name: 'Dia das Mães' });

    const fathersDay = getNthWeekdayOfMonth(year, 7, 0, 2); // 2º Domingo de Agosto
    holidays.push({ date: formatDate(fathersDay), name: 'Dia dos Pais' });

    const thanksgiving = getNthWeekdayOfMonth(year, 10, 4, 4); // 4ª Quinta-feira de Novembro
    const blackFriday = new Date(thanksgiving);
    blackFriday.setDate(thanksgiving.getDate() + 1);
    holidays.push({ date: formatDate(blackFriday), name: 'Black Friday' });

    return holidays;
};

const STATE_HOLIDAYS_RULES: Record<string, { month: string; day: string; name: string }[]> = {
  SP: [
    { month: '01', day: '25', name: 'Aniversário de São Paulo' },
    { month: '07', day: '09', name: 'Revolução Constitucionalista de 1932' },
    { month: '11', day: '20', name: 'Dia da Consciência Negra' },
  ],
  RJ: [
    { month: '01', day: '20', name: 'Dia de São Sebastião' },
    { month: '04', day: '23', name: 'Dia de São Jorge' },
    { month: '11', day: '20', name: 'Dia da Consciência Negra' },
  ],
  AL: [
    { month: '06', day: '24', name: 'São João' },
    { month: '06', day: '29', name: 'São Pedro' },
    { month: '09', day: '16', name: 'Emancipação Política de Alagoas' },
    { month: '11', day: '20', name: 'Dia da Consciência Negra (Morte de Zumbi)' },
  ],
  BA: [
    { month: '07', day: '02', name: 'Independência da Bahia' }
  ],
  RS: [
      { month: '09', day: '20', name: 'Revolução Farroupilha (Dia do Gaúcho)'}
  ],
  AM: [
      { month: '09', day: '05', name: 'Elevação do Amazonas à categoria de província' },
      { month: '11', day: '20', name: 'Dia da Consciência Negra' },
  ],
  MG: [
      { month: '04', day: '21', name: 'Data Magna de Minas Gerais (coincide com Tiradentes)'}
  ],
  CE: [
      { month: '03', day: '19', name: 'Dia de São José' },
      { month: '03', day: '25', name: 'Data Magna do Ceará' },
  ],
  DF: [
      { month: '04', day: '21', name: 'Aniversário de Brasília' },
      { month: '11', day: '30', name: 'Dia do Evangélico' },
  ],
  MA: [
      { month: '07', day: '28', name: 'Adesão do Maranhão à Independência' },
  ],
  PR: [
      { month: '12', day: '19', name: 'Emancipação Política do Paraná' },
  ]
};

const getStateHolidays = (year: number, state: string): Holiday[] => {
    const rules = STATE_HOLIDAYS_RULES[state];
    if (!rules) {
        return [];
    }
    return rules.map(rule => ({
        date: `${year}-${rule.month}-${rule.day}`,
        name: rule.name
    }));
};

export const getHolidays = (year: number, state: string): Holiday[] => {
    const national = getNationalHolidays(year);
    const regional = getStateHolidays(year, state);

    // Combina e remove duplicatas (pela data), unindo nomes se necessário
    const allHolidays = new Map<string, Holiday>();
    
    national.forEach(h => allHolidays.set(h.date, { ...h }));
    regional.forEach(h => {
        if (allHolidays.has(h.date)) {
            const existing = allHolidays.get(h.date)!;
            if (!existing.name.toLowerCase().includes(h.name.toLowerCase())) {
               existing.name = `${existing.name} / ${h.name}`;
            }
        } else {
            allHolidays.set(h.date, { ...h });
        }
    });

    const sortedHolidays = Array.from(allHolidays.values()).sort((a, b) => a.date.localeCompare(b.date));
    
    return sortedHolidays;
};
