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

  const extrasTotal = values.extra_payments.reduce((sum, p) => sum + (p.value || 0), 0);

  const save = async (overrides: Partial<ClientInput> = {}) => {
    setError('');
    if (!values.name.trim()) return setError('Coloque o nome do cliente.');
    if (values.extra_payments.some((p) => !p.description.trim())) {
      return setError('Descreva cada pagamento à parte (ou remova as linhas vazias).');
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
          <div className="input">
            <span>Total com extras</span>
            <p className="value-total">
              {money.format((values.value ?? 0) + extrasTotal)}
              {values.value_type === 'mensal' && <small> + mensalidade</small>}
            </p>
          </div>

          <div className="input input--full">
            <span>Pagamentos à parte</span>
            <p className="input__hint">Ajustes, alterações ou materiais extras cobrados depois do valor combinado.</p>
            {values.extra_payments.length > 0 && (
              <ul className="payments">
                {values.extra_payments.map((payment, index) => (
                  <li key={index}>
                    <input
                      value={payment.description}
                      onChange={(e) => setPayment(index, { description: e.target.value })}
                      placeholder="Ex.: Ajuste no logotipo"
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
                      aria-label="Data"
                    />
                    <button
                      type="button"
                      className="payments__remove"
                      aria-label="Remover pagamento"
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
                ))}
              </ul>
            )}
            <button
              type="button"
              className="add-btn"
              onClick={() =>
                set('extra_payments', [...values.extra_payments, { description: '', value: 0, date: localToday() }])
              }
            >
              + Adicionar pagamento
            </button>
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
