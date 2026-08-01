export function getCurrentDateBR(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentTimeBR(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatDateBR(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
}

export function getDayOfWeekBR(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return '';
  
  const date = new Date(year, month - 1, day);
  const days = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];
  return days[date.getDay()] || '';
}

export function formatFullHistoryDate(dateString: string): string {
  const brDate = formatDateBR(dateString);
  const dayOfWeek = getDayOfWeekBR(dateString);
  if (!dayOfWeek) return brDate;
  return `${brDate} (${dayOfWeek})`;
}

export function getCurrentFullDateFormattedBR(): string {
  const today = getCurrentDateBR();
  const dateBR = formatDateBR(today);
  const dayOfWeek = getDayOfWeekBR(today);
  
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const [year, month, day] = today.split('-').map(Number);
  const monthName = months[month - 1] || '';
  
  return `${day} de ${monthName} de ${year} • ${dayOfWeek}`;
}
