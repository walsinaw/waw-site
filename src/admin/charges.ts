import type { Client, ExtraPayment } from '../lib/types';
import { localToday } from './format';
import { monthLabel } from './payments';

export type ChargeState = 'pago' | 'atrasado' | 'aberto';
export type BillingStatus = 'atrasado' | 'aberto' | 'em-dia' | 'sem';

export interface Charge {
  description: string;
  value: number;
  due: string | null;
  paid_on: string | null;
  state: ChargeState;
  /** Mensalidade do mês atual que ainda não foi lançada na lista */
  virtual?: boolean;
}

export const billingLabels: Record<Exclude<BillingStatus, 'sem'>, string> = {
  atrasado: 'Atrasado',
  aberto: 'A receber',
  'em-dia': 'Em dia',
};

export function chargeState(payment: Pick<ExtraPayment, 'date' | 'paid_on'>, today = localToday()): ChargeState {
  if (payment.paid_on) return 'pago';
  return payment.date && payment.date < today ? 'atrasado' : 'aberto';
}

/** Vencimento da mensalidade no mês atual (dia 31 vira o último dia em meses mais curtos). */
export function monthDue(dueDay: number, today = localToday()) {
  const [year, month] = today.split('-').map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  return `${today.slice(0, 7)}-${String(Math.min(dueDay, lastDay)).padStart(2, '0')}`;
}

export const sameLabel = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Todas as cobranças do cliente, incluindo a mensalidade do mês se ela ainda não foi lançada. */
export function clientCharges(client: Client, today = localToday()): Charge[] {
  const charges: Charge[] = client.extra_payments.map((p) => ({
    description: p.description,
    value: p.value,
    due: p.date,
    paid_on: p.paid_on ?? null,
    state: chargeState(p, today),
  }));

  const month = monthLabel();
  if (
    client.status === 'ativo' &&
    client.value_type === 'mensal' &&
    client.value &&
    client.due_day &&
    !charges.some((c) => sameLabel(c.description, month))
  ) {
    const due = monthDue(client.due_day, today);
    charges.push({
      description: month,
      value: client.value,
      due,
      paid_on: null,
      state: due < today ? 'atrasado' : 'aberto',
      virtual: true,
    });
  }
  return charges;
}

/** "05/09" — datas curtas das cobranças. */
export const dayMonth = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' });

const byDue = (a: Charge, b: Charge) => (a.due ?? '9999').localeCompare(b.due ?? '9999');

/** Resumo para o card e o dashboard: quanto falta, o que venceu e o último pagamento. */
export function billing(client: Client, today = localToday()) {
  const charges = clientCharges(client, today);
  const open = charges.filter((c) => c.state !== 'pago').sort(byDue);
  const overdue = open.filter((c) => c.state === 'atrasado');
  const paid = charges.filter((c) => c.paid_on).sort((a, b) => b.paid_on!.localeCompare(a.paid_on!));
  const status: BillingStatus = overdue.length
    ? 'atrasado'
    : open.length
      ? 'aberto'
      : charges.length
        ? 'em-dia'
        : 'sem';
  return {
    status,
    open,
    overdue,
    owed: open.reduce((sum, c) => sum + (c.value || 0), 0),
    overdueTotal: overdue.reduce((sum, c) => sum + (c.value || 0), 0),
    received: paid.reduce((sum, c) => sum + (c.value || 0), 0),
    lastPaid: paid[0] ?? null,
  };
}
