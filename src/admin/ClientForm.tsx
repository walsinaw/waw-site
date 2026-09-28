import { useState, type FormEvent } from 'react';
import { deleteClient, saveClient } from '../lib/api';
import {
  clientStatuses,
  specialties,
  statusLabels,
  type Client,
  type ClientInput,
  type ExtraPayment,
} from '../lib/types';
import Modal from './Modal';
import ChipPicker from './ChipPicker';
import { formatDocument, localToday, money } from './format';
import { monthLabel } from './payments';
import { chargeState, monthDue, sameLabel } from './charges';

const stateLabels = { pago: 'Pago', atrasado: 'Atrasado', aberto: 'Em aberto' };

interface ClientFormProps {
  client: Client | null;
  onClose: () => void;
  onSaved: () => void;
}

const empty: ClientInput = {
  name: '',
  company: '',
  city: '',
  whatsapp: '',
  email: '',
  instagram: '',
  document: '',
  services: [],
  status: 'lead',
  value: null,
  value_type: 'fixo',
  extra_payments: [],
  due_day: null,
  start_date: null,
  notes: '',
  source: 'manual',
};

export default function ClientForm({ client, onClose, onSaved }: ClientFormProps) {
  const [values, setValues] = useState<ClientInput>(
    client ? (({ id: _id, created_at: _createdAt, ...rest }) => rest)(client) : empty,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof ClientInput>(key: K, value: ClientInput[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const setPayment = (index: number, patch: Partial<ExtraPayment>) =>
    set(
      'extra_payments',
      values.extra_payments.map((payment, i) => (i === index ? { ...payment, ...patch } : payment)),
    );

  const addCharge = (charge: ExtraPayment) => set('extra_payments', [...values.extra_payments, charge]);
  const received = values.extra_payments.filter((p) => p.paid_on).reduce((sum, p) => sum + (p.value || 0), 0);
  const owed = values.extra_payments.filter((p) => !p.paid_on).reduce((sum, p) => sum + (p.value || 0), 0);
  const month = monthLabel();
  const hasCharge = (description: string) => values.extra_payments.some((p) => sameLabel(p.description, description));

  const save = async (overrides: Partial<ClientInput> = {}) => {
    setError('');
    if (!values.name.trim()) return setError('Coloque o nome do cliente.');
    if (values.extra_payments.some((p) => !p.description.trim())) {
      return setError('Descreva cada cobrança (ou remova as linhas vazias).');
    }
    if (values.due_day != null && (values.due_day < 1 || values.due_day > 31)) {
      return setError('O dia do vencimento precisa ser entre 1 e 31.');
    }
    setSaving(true);
    try {
      await saveClient({ ...values, name: values.name.trim(), ...overrides }, client?.id);
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    save();
  };

  const handleDelete = async () => {
    if (!client || !window.confirm(`Excluir ${client.name}? Isso não pode ser desfeito.`)) return;
    try {
      await deleteClient(client.id);
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Modal title={client ? 'Editar' : 'Cadastrar'} highlight={client ? 'Cliente' : 'Novo Cliente'} onClose={onClose}>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form__grid">
          <label className="input">
            <span>
              Nome <b>*</b>
            </span>
            <input
              value={values.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ex.: João Silva"
              maxLength={120}
              required
            />
          </label>
          <label className="input">
            <span>Empresa</span>
            <input
              value={values.company}
              onChange={(e) => set('company', e.target.value)}
              placeholder="Ex.: Hamburgueria Burguer"
              maxLength={120}
            />
          </label>
          <label className="input">
            <span>Cidade</span>
            <input
              value={values.city}
              onChange={(e) => set('city', e.target.value)}
              placeholder="Ex.: Pelotas"
              maxLength={80}
            />
          </label>

          <label className="input">
            <span>WhatsApp</span>
            <input
              value={values.whatsapp}
              onChange={(e) => set('whatsapp', e.target.value)}
              placeholder="(53) 99999-9999"
              maxLength={30}
            />
          </label>
          <label className="input">
            <span>E-mail</span>
            <input
              type="email"
              value={values.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="contato@empresa.com"
            />
          </label>
          <label className="input">
            <span>Instagram</span>
            <input
              value={values.instagram}
              onChange={(e) => set('instagram', e.target.value)}
              placeholder="@empresa"
              maxLength={80}
            />
          </label>

          <label className="input">
            <span>CPF ou CNPJ do responsável</span>
            <input
              value={values.document}
              onChange={(e) => set('document', formatDocument(e.target.value))}
              placeholder="000.000.000-00"
              inputMode="numeric"
            />
          </label>
          <label className="input">
            <span>Status</span>
            <select value={values.status} onChange={(e) => set('status', e.target.value as ClientInput['status'])}>
              {clientStatuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="input">
            <span>Data de início</span>
            <input
              type="date"
              value={values.start_date ?? ''}
              onChange={(e) => set('start_date', e.target.value || null)}
            />
          </label>

          <div className="input input--wide">
            <span>Valor do projeto</span>
            <div className="value-field">
              <input
                type="number"
                min="0"
                step="0.01"
                value={values.value ?? ''}
                onChange={(e) => set('value', e.target.value === '' ? null : Number(e.target.value))}
                placeholder="R$ 0,00"
                aria-label="Valor do projeto"
              />
              <div className="segmented" role="radiogroup" aria-label="Tipo de pagamento">
                {(
                  [
                    ['fixo', 'Pagamento fixo'],
                    ['mensal', 'Valor mensal'],
                  ] as const
                ).map(([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    role="radio"
                    aria-checked={values.value_type === type}
                    className={values.value_type === type ? 'is-active' : ''}
                    onClick={() => set('value_type', type)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {values.value_type === 'mensal' ? (
            <label className="input">
              <span>Dia do vencimento</span>
              <input
                type="number"
                min="1"
                max="31"
                value={values.due_day ?? ''}
                onChange={(e) => set('due_day', e.target.value === '' ? null : Math.round(Number(e.target.value)))}
                placeholder="Ex.: 10"
              />
            </label>
          ) : (
            <div className="input">
              <span>Recebido</span>
              <p className="value-total">
                {money.format(received)}
                {owed > 0 && <small>falta {money.format(owed)}</small>}
              </p>
            </div>
          )}

          <div className="input input--full">
            <span>Cobranças</span>
            <p className="input__hint">
              Coloque a data limite de cada cobrança. Quando o cliente pagar, preencha “Pago em”.
            </p>
            {values.extra_payments.length > 0 && (
              <ul className="charges">
                <li className="charges__head" aria-hidden="true">
                  <span>Descrição</span>
                  <span>Valor</span>
                  <span>Vence em</span>
                  <span>Pago em</span>
                  <span />
                </li>
                {values.extra_payments.map((payment, index) => {
                  const state = chargeState(payment);
                  return (
                    <li key={index} className={`charges__row charges__row--${state}`}>
                      <input
                        value={payment.description}
                        onChange={(e) => setPayment(index, { description: e.target.value })}
                        placeholder="Ex.: Entrada 50%"
                        aria-label="Descrição"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={payment.value || ''}
                        onChange={(e) => setPayment(index, { value: Number(e.target.value) })}
                        placeholder="R$ 0,00"
                        aria-label="Valor"
                      />
                      <input
                        type="date"
                        value={payment.date ?? ''}
                        onChange={(e) => setPayment(index, { date: e.target.value || null })}
                        aria-label="Vence em"
                      />
                      {payment.paid_on ? (
                        <input
                          type="date"
                          value={payment.paid_on}
                          onChange={(e) => setPayment(index, { paid_on: e.target.value || null })}
                          aria-label="Pago em"
                        />
                      ) : (
                        <button
                          type="button"
                          className={`charges__pay charges__pay--${state}`}
                          onClick={() => setPayment(index, { paid_on: localToday() })}
                          title="Marca como pago hoje. Dá para mudar a data depois."
                        >
                          <span>{stateLabels[state]}</span>
                          Pago hoje
                        </button>
                      )}
                      <button
                        type="button"
                        className="payments__remove"
                        aria-label="Remover cobrança"
                        onClick={() =>
                          set(
                            'extra_payments',
                            values.extra_payments.filter((_, i) => i !== index),
                          )
                        }
                      >
                        ✕
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="charges__actions">
              {values.value_type === 'fixo' && values.value != null && !hasCharge('Valor do projeto') && (
                <button
                  type="button"
                  className="add-btn"
                  onClick={() =>
                    addCharge({ description: 'Valor do projeto', value: values.value ?? 0, date: null, paid_on: null })
                  }
                >
                  + Cobrar valor do projeto
                </button>
              )}
              {values.value_type === 'mensal' && values.value != null && !hasCharge(month) && (
                <button
                  type="button"
                  className="add-btn"
                  onClick={() =>
                    addCharge({
                      description: month,
                      value: values.value ?? 0,
                      date: values.due_day ? monthDue(values.due_day) : null,
                      paid_on: null,
                    })
                  }
                >
                  + Mensalidade de {month.split('/')[0].toLowerCase()}
                </button>
              )}
              <button
                type="button"
                className="add-btn"
                onClick={() => addCharge({ description: '', value: 0, date: null, paid_on: null })}
              >
                + Nova cobrança
              </button>
            </div>
          </div>

          <fieldset className="input input--full">
            <legend>Serviços</legend>
            <ChipPicker options={specialties} selected={values.services} onChange={(s) => set('services', s)} />
          </fieldset>

          <label className="input input--full">
            <span>Anotações</span>
            <textarea
              value={values.notes}
              onChange={(e) => set('notes', e.target.value)}
              maxLength={5000}
              placeholder="Briefing, combinados, próximos passos…"
            />
          </label>
        </div>

        {client?.source === 'site' && (
          <p className="input__hint">
            Veio pelo formulário do site em {new Date(client.created_at).toLocaleString('pt-BR')}.
          </p>
        )}

        {error && <p className="admin-error">{error}</p>}

        <div className="form__footer">
          {client && (
            <>
              <button type="button" className="text-btn text-btn--danger" onClick={handleDelete}>
                Excluir
              </button>
              {client.status !== 'pausado' && (
                <button
                  type="button"
                  className="btn btn--ghost"
                  disabled={saving}
                  onClick={() => save({ status: 'pausado' })}
                >
                  Pausar
                </button>
              )}
            </>
          )}
          <button type="submit" className="btn btn--red" disabled={saving}>
            {saving ? 'Salvando…' : client ? 'Salvar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
