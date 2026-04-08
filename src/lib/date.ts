const STOCKHOLM_TIMEZONE = 'Europe/Stockholm';

export function getStockholmDateString(date = new Date()): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: STOCKHOLM_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

export function formatSwedishDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: STOCKHOLM_TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(utcDate);
}

export function secondsUntilNextStockholmMidnight(now = new Date()): number {
  const stockholmNowString = now.toLocaleString('sv-SE', { timeZone: STOCKHOLM_TIMEZONE });
  const stockholmNow = new Date(stockholmNowString.replace(' ', 'T'));

  const nextMidnight = new Date(stockholmNow);
  nextMidnight.setHours(24, 0, 0, 0);

  return Math.max(60, Math.floor((nextMidnight.getTime() - stockholmNow.getTime()) / 1000));
}
