import { useState, type FormEvent } from 'react';
import { deleteTeamMember, saveTeamMember, uploadTeamPhoto, type TeamMemberWithPhoto } from '../lib/api';
import {
  contractLabels,
  specialties,
  statusLabels,
  type Client,
  type ContractType,
  type TeamInput,
} from '../lib/types';
import Modal from './Modal';
import ChipPicker from './ChipPicker';

interface TeamFormProps {
  member: TeamMemberWithPhoto | null;
  clients: Client[];
  onClose: () => void;
  onSaved: () => void;
}

const empty: TeamInput = {
  name: '',
  phone: '',
  photo_path: null,
  areas: [],
  contract_type: 'freelancer',
  agreed_value: null,
  client_ids: [],
  notes: '',
};

const valueLabels: Record<ContractType, string> = {
  fixo: 'Valor mensal acordado',
  freelancer: 'Valor por projeto',
  avulso: 'Valor total (pagamento único)',
};

// Projetos em andamento aparecem primeiro na lista de vínculo.
const statusOrder = { ativo: 0, proposta: 1, lead: 2, pausado: 3, concluido: 4 };

export default function TeamForm({ member, clients, onClose, onSaved }: TeamFormProps) {
  const [values, setValues] = useState<TeamInput>(
    member ? (({ id: _id, created_at: _createdAt, photo_url: _photoUrl, ...rest }) => rest)(member) : empty,
  );
  const [photoUrl, setPhotoUrl] = useState(member?.photo_url ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof TeamInput>(key: K, value: TeamInput[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const sortedClients = [...clients].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status] || a.name.localeCompare(b.name),
  );

  const toggleClient = (id: number) =>
    set(
      'client_ids',
      values.client_ids.includes(id) ? values.client_ids.filter((c) => c !== id) : [...values.client_ids, id],
    );

  const handlePhoto = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const { path, url } = await uploadTeamPhoto(file);
      set('photo_path', path);
      setPhotoUrl(url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!values.name.trim()) return setError('Coloque o nome.');
    setSaving(true);
    try {
      await saveTeamMember({ ...values, name: values.name.trim() }, member?.id);
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!member || !window.confirm(`Excluir ${member.name} da equipe? Isso não pode ser desfeito.`)) return;
    try {
      await deleteTeamMember(member);
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Modal
      title={member ? 'Editar' : 'Cadastrar'}
      highlight={member ? 'Funcionário' : 'Novo Funcionário'}
      onClose={onClose}
    >
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form__grid form__grid--person">
          <div className="input input--photo">
            <span>Foto</span>
            <label className={`upload upload--round${photoUrl ? ' upload--filled' : ''}`}>
              {photoUrl ? <img src={photoUrl} alt="" /> : <span>{uploading ? 'Enviando…' : 'Adicionar foto'}</span>}
              <input type="file" accept="image/*" onChange={(e) => handlePhoto(e.target.files?.[0])} />
            </label>
            {photoUrl && (
              <button
                type="button"
                className="text-btn input__hint"
                onClick={() => {
                  set('photo_path', null);
                  setPhotoUrl(null);
                }}
              >
                Remover foto
              </button>
            )}
          </div>

          <label className="input">
            <span>
              Nome <b>*</b>
            </span>
            <input
              value={values.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ex.: Ana Souza"
              maxLength={120}
              required
            />
          </label>
          <label className="input">
            <span>Telefone / WhatsApp</span>
            <input
              value={values.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="(53) 99999-9999"
              maxLength={30}
            />
          </label>

          <label className="input">
            <span>Tipo de contrato</span>
            <select
              value={values.contract_type}
              onChange={(e) => set('contract_type', e.target.value as ContractType)}
            >
              {(Object.entries(contractLabels) as [ContractType, string][]).map(([type, label]) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="input">
            <span>{valueLabels[values.contract_type]}</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={values.agreed_value ?? ''}
              onChange={(e) => set('agreed_value', e.target.value === '' ? null : Number(e.target.value))}
              placeholder="R$ 0,00"
            />
          </label>

          <fieldset className="input input--full">
            <legend>Áreas em que trabalha</legend>
            <ChipPicker options={specialties} selected={values.areas} onChange={(a) => set('areas', a)} />
          </fieldset>

          <fieldset className="input input--full">
            <legend>Projetos em que está trabalhando</legend>
            {sortedClients.length === 0 ? (
              <p className="input__hint">Cadastre clientes na aba Clientes para vincular aqui.</p>
            ) : (
              <div className="chips">
                {sortedClients.map((client) => {
                  const active = values.client_ids.includes(client.id);
                  return (
                    <button
                      key={client.id}
                      type="button"
                      className={`chip${active ? ' chip--active' : ''}`}
                      aria-pressed={active}
                      onClick={() => toggleClient(client.id)}
                      title={statusLabels[client.status]}
                    >
                      {client.company || client.name}
                      {client.status === 'ativo' && <span className="chip__dot" aria-label="em andamento" />}
                    </button>
                  );
                })}
              </div>
            )}
          </fieldset>

          <label className="input input--full">
            <span>Observações</span>
            <textarea
              value={values.notes}
              onChange={(e) => set('notes', e.target.value)}
              maxLength={5000}
              placeholder="Combinados, prazos de pagamento, portfólio…"
            />
          </label>
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="form__footer">
          {member && (
            <button type="button" className="text-btn text-btn--danger" onClick={handleDelete}>
              Excluir
            </button>
          )}
          <button type="submit" className="btn btn--red" disabled={saving || uploading}>
            {saving ? 'Salvando…' : member ? 'Salvar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
