export const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const shortDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });

/** Link do WhatsApp: adiciona o 55 do Brasil quando o número vem só com DDD. */
export function whatsappLink(value: string) {
  const digits = value.replace(/\D/g, '');
  return `https://wa.me/${digits.length > 11 ? digits : `55${digits}`}`;
}
