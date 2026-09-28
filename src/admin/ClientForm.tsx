import { useState, type FormEvent } from 'react';
import { deleteClient, saveClient } from '../lib/api';
import { clientStatuses, statusLabels, type Client, type ClientInput } from '../lib/types';
import Drawer from './Drawer';

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await saveClient({ ...values, name: values.name.trim() }, client?.id);
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!client || !window.confirm(`Apagar ${client.name}? Isso não pode ser desfeito.`)) return;
    try {
      await deleteClient(client.id);
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Drawer title={client ? client.name : 'Novo cliente'} onClose={onClose}>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-grid">
          <label className="admin-field">
            <span>Nome *</span>
            <input value={values.name} onChange={(e) => set('name', e.target.value)} required maxLength={120} />
          </label>
          <label className="admin-field">
            <span>Empresa</span>
            <input value={values.company} onChange={(e) => set('company', e.target.value)} maxLength={120} />
          </label>
          <label className="admin-field">
            <span>WhatsApp</span>
            <input value={values.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} maxLength={30} />
          </label>
          <label className="admin-field">
            <span>E-mail</span>
            <input type="email" value={values.email} onChange={(e) => set('email', e.target.value)} />
          </label>
          <label className="admin-field">
            <span>Cidade</span>
            <input value={values.city} onChange={(e) => set('city', e.target.value)} maxLength={80} />
          </label>
          <label className="admin-field">
            <span>Instagram</span>
            <input value={values.instagram} onChange={(e) => set('instagram', e.target.value)} maxLength={80} />
          </label>
        </div>

        <fieldset className="admin-field">
          <legend>Serviços</legend>
          <div className="admin-chips">
            {serviceOptions.map((service) => {
              const active = values.services.some((s) => s.toLowerCase() === service.toLowerCase());
              return (
                <button
                  key={service}
                  type="button"
                  className={active ? 'is-active' : ''}
                  aria-pressed={active}
                  onClick={() => toggleService(service)}
                >
                  {service}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="admin-grid">
          <label className="admin-field">
            <span>Status</span>
            <select value={values.status} onChange={(e) => set('status', e.target.value as ClientInput['status'])}>
              {clientStatuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Valor do projeto (R$)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={values.value ?? ''}
              onChange={(e) => set('value', e.target.value === '' ? null : Number(e.target.value))}
            />
          </label>
          <label className="admin-field">
            <span>Início</span>
            <input
              type="date"
              value={values.start_date ?? ''}
              onChange={(e) => set('start_date', e.target.value || null)}
            />
          </label>
        </div>

        <label className="admin-field">
          <span>Anotações</span>
          <textarea
            rows={6}
            value={values.notes}
            onChange={(e) => set('notes', e.target.value)}
            maxLength={5000}
            placeholder="Briefing, combinados, próximos passos…"
          />
        </label>

        {client?.source === 'site' && (
          <p className="admin-muted">Veio pelo formulário do site em {new Date(client.created_at).toLocaleString('pt-BR')}.</p>
        )}

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-form__footer">
          {client && (
            <button type="button" className="admin-link admin-link--danger" onClick={handleDelete}>
              Apagar cliente
            </button>
          )}
          <button type="button" className="admin-button" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="admin-button admin-button--primary" disabled={saving}>
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </Drawer>
  );
}
