import { useState, type FormEvent } from 'react';
import { deleteClient, saveClient } from '../lib/api';
import { clientStatuses, statusLabels, type Client, type ClientInput } from '../lib/types';
import Modal from './Modal';

const serviceOptions = ['Design', 'Web', 'Ads', 'Social Media', 'Audiovisual', 'Estratégia'];

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
  services: [],
  status: 'lead',
  value: null,
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

  const toggleService = (service: string) =>
    set(
      'services',
      // Mantém serviços antigos que vieram do site (ex.: "DESIGN") ao marcar/desmarcar.
      values.services.some((s) => s.toLowerCase() === service.toLowerCase())
        ? values.services.filter((s) => s.toLowerCase() !== service.toLowerCase())
        : [...values.services, service],
    );

  const save = async (overrides: Partial<ClientInput> = {}) => {
    setError('');
    if (!values.name.trim()) return setError('Coloque o nome do cliente.');
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
            <span>Valor do projeto</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={values.value ?? ''}
              onChange={(e) => set('value', e.target.value === '' ? null : Number(e.target.value))}
              placeholder="R$ 0,00"
            />
          </label>
          <label className="input">
            <span>Data de início</span>
            <input
              type="date"
              value={values.start_date ?? ''}
              onChange={(e) => set('start_date', e.target.value || null)}
            />
          </label>

          <fieldset className="input input--full">
            <legend>Serviços</legend>
            <div className="chips">
              {serviceOptions.map((service) => {
                const active = values.services.some((s) => s.toLowerCase() === service.toLowerCase());
                return (
                  <button
                    key={service}
                    type="button"
                    className={`chip${active ? ' chip--active' : ''}`}
                    aria-pressed={active}
                    onClick={() => toggleService(service)}
                  >
                    {service}
                  </button>
                );
              })}
            </div>
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
