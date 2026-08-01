export interface BibleBook {
  name: string;
  testament: 'AT' | 'NT';
  category: string;
}

export const BIBLE_BOOKS: BibleBook[] = [
  // Antigo Testamento - Pentateuco
  { name: 'Gênesis', testament: 'AT', category: 'Pentateuco' },
  { name: 'Êxodo', testament: 'AT', category: 'Pentateuco' },
  { name: 'Levítico', testament: 'AT', category: 'Pentateuco' },
  { name: 'Números', testament: 'AT', category: 'Pentateuco' },
  { name: 'Deuteronômio', testament: 'AT', category: 'Pentateuco' },

  // Históricos
  { name: 'Josué', testament: 'AT', category: 'Históricos' },
  { name: 'Juízes', testament: 'AT', category: 'Históricos' },
  { name: 'Rute', testament: 'AT', category: 'Históricos' },
  { name: '1 Samuel', testament: 'AT', category: 'Históricos' },
  { name: '2 Samuel', testament: 'AT', category: 'Históricos' },
  { name: '1 Reis', testament: 'AT', category: 'Históricos' },
  { name: '2 Reis', testament: 'AT', category: 'Históricos' },
  { name: '1 Crônicas', testament: 'AT', category: 'Históricos' },
  { name: '2 Crônicas', testament: 'AT', category: 'Históricos' },
  { name: 'Esdras', testament: 'AT', category: 'Históricos' },
  { name: 'Neemias', testament: 'AT', category: 'Históricos' },
  { name: 'Ester', testament: 'AT', category: 'Históricos' },

  // Poéticos e Sabedoria
  { name: 'Jó', testament: 'AT', category: 'Poéticos' },
  { name: 'Salmos', testament: 'AT', category: 'Poéticos' },
  { name: 'Provérbios', testament: 'AT', category: 'Poéticos' },
  { name: 'Eclesiastes', testament: 'AT', category: 'Poéticos' },
  { name: 'Cânticos', testament: 'AT', category: 'Poéticos' },

  // Profetas Maiores
  { name: 'Isaías', testament: 'AT', category: 'Profetas Maiores' },
  { name: 'Jeremias', testament: 'AT', category: 'Profetas Maiores' },
  { name: 'Lamentações', testament: 'AT', category: 'Profetas Maiores' },
  { name: 'Ezequiel', testament: 'AT', category: 'Profetas Maiores' },
  { name: 'Daniel', testament: 'AT', category: 'Profetas Maiores' },

  // Profetas Menores
  { name: 'Oséias', testament: 'AT', category: 'Profetas Menores' },
  { name: 'Joel', testament: 'AT', category: 'Profetas Menores' },
  { name: 'Amós', testament: 'AT', category: 'Profetas Menores' },
  { name: 'Obadias', testament: 'AT', category: 'Profetas Menores' },
  { name: 'Jonas', testament: 'AT', category: 'Profetas Menores' },
  { name: 'Miquéias', testament: 'AT', category: 'Profetas Menores' },
  { name: 'Naum', testament: 'AT', category: 'Profetas Menores' },
  { name: 'Habacuque', testament: 'AT', category: 'Profetas Menores' },
  { name: 'Sofonias', testament: 'AT', category: 'Profetas Menores' },
  { name: 'Ageu', testament: 'AT', category: 'Profetas Menores' },
  { name: 'Zacarias', testament: 'AT', category: 'Profetas Menores' },
  { name: 'Malaquias', testament: 'AT', category: 'Profetas Menores' },

  // Novo Testamento - Evangelhos
  { name: 'Mateus', testament: 'NT', category: 'Evangelhos' },
  { name: 'Marcos', testament: 'NT', category: 'Evangelhos' },
  { name: 'Lucas', testament: 'NT', category: 'Evangelhos' },
  { name: 'João', testament: 'NT', category: 'Evangelhos' },

  // Histórico
  { name: 'Atos', testament: 'NT', category: 'Histórico NT' },

  // Cartas Paulinas
  { name: 'Romanos', testament: 'NT', category: 'Cartas Paulinas' },
  { name: '1 Coríntios', testament: 'NT', category: 'Cartas Paulinas' },
  { name: '2 Coríntios', testament: 'NT', category: 'Cartas Paulinas' },
  { name: 'Gálatas', testament: 'NT', category: 'Cartas Paulinas' },
  { name: 'Efésios', testament: 'NT', category: 'Cartas Paulinas' },
  { name: 'Filipenses', testament: 'NT', category: 'Cartas Paulinas' },
  { name: 'Colossenses', testament: 'NT', category: 'Cartas Paulinas' },
  { name: '1 Tessalonicenses', testament: 'NT', category: 'Cartas Paulinas' },
  { name: '2 Tessalonicenses', testament: 'NT', category: 'Cartas Paulinas' },
  { name: '1 Timóteo', testament: 'NT', category: 'Cartas Paulinas' },
  { name: '2 Timóteo', testament: 'NT', category: 'Cartas Paulinas' },
  { name: 'Tito', testament: 'NT', category: 'Cartas Paulinas' },
  { name: 'Filemom', testament: 'NT', category: 'Cartas Paulinas' },

  // Cartas Gerais
  { name: 'Hebreus', testament: 'NT', category: 'Cartas Gerais' },
  { name: 'Tiago', testament: 'NT', category: 'Cartas Gerais' },
  { name: '1 Pedro', testament: 'NT', category: 'Cartas Gerais' },
  { name: '2 Pedro', testament: 'NT', category: 'Cartas Gerais' },
  { name: '1 João', testament: 'NT', category: 'Cartas Gerais' },
  { name: '2 João', testament: 'NT', category: 'Cartas Gerais' },
  { name: '3 João', testament: 'NT', category: 'Cartas Gerais' },
  { name: 'Judas', testament: 'NT', category: 'Cartas Gerais' },

  // Profético
  { name: 'Apocalipse', testament: 'NT', category: 'Profético' },
];
