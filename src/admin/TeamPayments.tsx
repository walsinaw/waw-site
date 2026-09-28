import { useState } from 'react';
import { addTeamPayment, deleteTeamPayment } from '../lib/api';
import type { Client, TeamMember, TeamPayment } from '../lib/types';
import { localToday, money } from './format';
import { monthLabel, paymentSummary, shortDay } from './payments';

interface TeamPaymentsProps {
  member: TeamMember;
  payments: TeamPayment[];
  clients: Client[];
  onChange: () => void;
}

// Registro de pagamentos de um funcionário (fica salvo na hora, separado do "Salvar" do formulário).
export default function TeamPayments({ member, payments, clients, onChange }: TeamPaymentsProps) {
  const monthly = member.contract_type === 'fixo';
  const mine = payments.filter((p) => p.member_id === member.id);
  const summary = paymentSummary(member, payments);

  const blank = () => ({
    amount: member.agreed_value ? String(member.agreed_value) : '',
    paid_on: localToday(),
    reference: monthly ? monthLabel() : '',
    client_id: '',
  });
  const [draft, setDraft] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Os projetos do funcionário aparecem primeiro na lista.
  const sortedClients = [...clients].sort(
    (a, b) =>
      Number(member.client_ids.includes(b.id)) - Number(member.client_ids.includes(a.id)) ||
      (a.company || a.name).localeCompare(b.company || b.name),
  );
  const clientName = (id: number | null) => {
    const client = clients.find((c) => c.id === id);
    return client ? client.company || client.name : null;
  };

  const register = async () => {
    setError('');
    const amount = Number(draft.amount);
    if (!amount || amount <= 0) return setError('Coloque o valor pago.');
    if (!draft.paid_on) return setError('Coloque a data do pagamento.');
    if (!monthly && !draft.client_id && !draft.reference.trim()) {
      return setError('Escolha o projeto ou descreva o que foi pago.');
    }
    setSaving(true);
    try {
      await addTeamPayment({
        member_id: member.id,
        amount,
        paid_on: draft.paid_on,
        reference: draft.reference.trim(),
        client_id: draft.client_id ? Number(draft.client_id) : null,
        notes: '',
      });
      setDraft(blank());
      onChange();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (payment: TeamPayment) => {
    if (!window.confirm(`Apagar o pagamento de ${money.format(payment.amount)}?`)) return;
    try {
      await deleteTeamPayment(payment.id);
      onChange();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="input input--full team-pay">
      <span>Pagamentos</span>

      <div className="team-pay__summary">
        {monthly && (
          <span className={`team-pay__status${summary.currentMonthPaid ? ' is-paid' : ''}`}>
            {monthLabel()}: {summary.currentMonthPaid ? 'pago' : 'pendente'}
          </span>
        )}
        <span>
          Pago este mês <strong>{money.format(summary.thisMonth)}</strong>
        </span>
        <span>
          Total pago <strong>{money.format(summary.total)}</strong>
        </span>
      </div>

      <div className={`team-pay__form${monthly ? '' : ' team-pay__form--project'}`}>
        <input
          type="number"
          min="0"
          step="0.01"
          value={draft.amount}
          onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
          placeholder="R$ 0,00"
          aria-label="Valor pago"
        />
        <input
          type="date"
          value={draft.paid_on}
          onChange={(e) => setDraft({ ...draft, paid_on: e.target.value })}
          aria-label="Data do pagamento"
        />
        {!monthly && (
          <select
            value={draft.client_id}
            onChange={(e) => setDraft({ ...draft, client_id: e.target.value })}
            aria-label="Projeto"
          >
            <option value="">Projeto (opcional)</option>
            {sortedClients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.company || client.name}
              </option>
            ))}
          </select>
        )}
        <input
          value={draft.reference}
          onChange={(e) => setDraft({ ...draft, reference: e.target.value })}
          placeholder={monthly ? 'Mês de referência' : 'O que foi pago (ex.: entrega do logo)'}
          aria-label="Referência"
          maxLength={120}
        />
        <button type="button" className="btn btn--red btn--sm" onClick={register} disabled={saving}>
          {saving ? 'Salvando…' : 'Registrar'}
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {mine.length === 0 ? (
        <p className="input__hint">Nenhum pagamento registrado ainda.</p>
      ) : (
        <ul className="team-pay__list">
          {mine.map((payment) => (
            <li key={payment.id}>
              <span className="team-pay__date">{shortDay.format(new Date(payment.paid_on))}</span>
              <span className="team-pay__ref">
                {[payment.reference, clientName(payment.client_id)].filter(Boolean).join(' · ') || '—'}
              </span>
              <strong>{money.format(payment.amount)}</strong>
              <button type="button" className="payments__remove" aria-label="Apagar pagamento" onClick={() => remove(payment)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
