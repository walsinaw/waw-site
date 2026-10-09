export const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const shortDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });

export function formatDocument(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return d
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

export function clientValue(value: number | null, type: 'fixo' | 'mensal') {
  if (value == null) return null;
  return `${money.format(value)}${type === 'mensal' ? '/mês' : ''}`;
}

export function whatsappLink(value: string) {
  const digits = value.replace(/\D/g, '');
  return `https://wa.me/${digits.length > 11 ? digits : `55${digits}`}`;
}

export function localToday() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}
