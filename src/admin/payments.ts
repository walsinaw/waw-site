import type { TeamMember, TeamPayment } from '../lib/types';
import { localToday } from './format';

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

/** "Setembro/2026" — referência padrão do pagamento mensal. */
export const monthLabel = (date = new Date()) => `${months[date.getMonth()]}/${date.getFullYear()}`;

const thisMonth = () => localToday().slice(0, 7);
export const shortDay = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', timeZone: 'UTC' });

/** Resumo para o card: se o fixo já recebeu o mês atual, e quanto foi pago no total. */
export function paymentSummary(member: TeamMember, payments: TeamPayment[]) {
  const mine = payments.filter((p) => p.member_id === member.id);
  return {
    total: mine.reduce((sum, p) => sum + p.amount, 0),
    thisMonth: mine.filter((p) => p.paid_on.startsWith(thisMonth())).reduce((sum, p) => sum + p.amount, 0),
    currentMonthPaid: mine.some((p) => p.reference.toLowerCase() === monthLabel().toLowerCase()),
    last: mine[0] ?? null,
  };
}
