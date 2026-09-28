import { useState, type FormEvent } from 'react';
import { deletePanelUser, savePanelUser, type TeamMemberWithPhoto } from '../lib/api';
import { areaLabels, areas, type Area, type PanelUser, type PanelUserInput, type Role } from '../lib/types';
import Modal from './Modal';

interface UserFormProps {
  user: PanelUser | null;
  /** O próprio login: não pode se bloquear, se excluir nem deixar de ser admin */
  isMe: boolean;
  team: TeamMemberWithPhoto[];
  onClose: () => void;
  onSaved: () => void;
}

const roleOptions: { value: Role; title: string; text: string }[] = [
  { value: 'equipe', title: 'Equipe', text: 'Vê só as áreas que você marcar.' },
  { value: 'admin', title: 'Administrador', text: 'Vê tudo e pode criar outros logins.' },
];

/** Senha provisória fácil de ditar: sem letras parecidas (l, 1, O, 0). */
function generatePassword() {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint32Array(12));
  return Array.from(bytes, (n) => chars[n % chars.length]).join('');
}

export default function UserForm({ user, isMe, team, onClose, onSaved }: UserFormProps) {
  const [values, setValues] = useState<PanelUserInput>(
    user
      ? {
          email: user.email,
          password: '',
          name: user.name,
          role: user.role,
          permissions: user.permissions,
          team_id: user.team_id,
          active: user.active,
        }
      : { email: '', password: '', name: '', role: 'equipe', permissions: ['portfolio'], team_id: null, active: true },
  );
  const [showPassword, setShowPassword] = useState(!user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);

  const set = <K extends keyof PanelUserInput>(key: K, value: PanelUserInput[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const toggleArea = (area: Area) =>
    set(
      'permissions',
      values.permissions.includes(area) ? values.permissions.filter((a) => a !== area) : [...values.permissions, area],
    );

  // Ao vincular um funcionário sem nome preenchido, usa o nome dele.
  const pickMember = (id: number | null) => {
    set('team_id', id);
    const member = team.find((m) => m.id === id);
    if (member && !values.name.trim()) set('name', member.name);
  };

  const linked = team.find((m) => m.id === values.team_id);

  const save = async (overrides: Partial<PanelUserInput> = {}) => {
    setError('');
    const next = { ...values, ...overrides, email: values.email.trim().toLowerCase(), name: values.name.trim() };
    if (!user && !/^\S+@\S+\.\S+$/.test(next.email)) return setError('Coloque um e-mail válido.');
    if ((!user || next.password) && next.password.length < 8) {
      return setError('A senha precisa ter pelo menos 8 caracteres.');
    }
    if (next.role === 'equipe' && next.permissions.length === 0) {
      return setError('Marque pelo menos uma área que essa pessoa pode ver.');
    }
    setSaving(true);
    try {
      await savePanelUser(next, user?.user_id);
      if (!user) {
        // Mostra os dados para você mandar para a pessoa.
        setCreated({ email: next.email, password: next.password });
        setSaving(false);
      } else {
        onSaved();
      }
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
    if (!user || !window.confirm(`Excluir o login ${user.email}? A pessoa não vai mais conseguir entrar.`)) return;
    try {
      await deletePanelUser(user.user_id);
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (created) {
    const message = `Seu acesso ao painel da WAW:\n${window.location.origin}/admin\nE-mail: ${created.email}\nSenha provisória: ${created.password}\n\nDepois de entrar, troque a senha em "Minha senha".`;
    return (
      <Modal title="Login" highlight="criado" onClose={onSaved} size="small">
        <p className="form__message">Mande estes dados para a pessoa. A senha não aparece de novo depois de fechar.</p>
        <pre className="credentials">{message}</pre>
        <div className="form__footer">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => navigator.clipboard?.writeText(message)}
          >
            Copiar mensagem
          </button>
          <button type="button" className="btn btn--red" onClick={onSaved}>
            Concluir
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={user ? 'Editar' : 'Criar'} highlight={user ? 'Login' : 'Novo Login'} onClose={onClose}>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form__grid">
          <label className="input">
            <span>Nome</span>
            <input
              value={values.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ex.: Ana Souza"
              maxLength={120}
            />
          </label>
          <label className="input">
            <span>
              E-mail {!user && <b>*</b>}
            </span>
            <input
              type="email"
              value={values.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="pessoa@email.com"
              disabled={!!user}
              autoComplete="off"
            />
          </label>
          <label className="input">
            <span>Vincular a um funcionário</span>
            <span className="linked-member">
              {linked && (
                <span className="person__photo person__photo--sm" aria-hidden="true">
                  {linked.photo_url ? <img src={linked.photo_url} alt="" /> : linked.name.charAt(0).toUpperCase()}
                </span>
              )}
              <select
                value={values.team_id ?? ''}
                onChange={(e) => pickMember(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Nenhum</option>
                {team.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </span>
          </label>

          <div className="input input--full">
            <span>{user ? 'Senha' : <>Senha provisória <b>*</b></>}</span>
            {showPassword ? (
              <div className="value-field">
                <input
                  type="text"
                  value={values.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder={user ? 'Nova senha (deixe vazio para manter)' : 'Pelo menos 8 caracteres'}
                  autoComplete="new-password"
                  spellCheck={false}
                />
                <button type="button" className="add-btn add-btn--inline" onClick={() => set('password', generatePassword())}>
                  Gerar senha
                </button>
              </div>
            ) : (
              <button type="button" className="add-btn" onClick={() => setShowPassword(true)}>
                Definir uma nova senha
              </button>
            )}
          </div>

          <fieldset className="input input--full">
            <legend>Tipo de acesso</legend>
            <div className="role-options">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`role-option${values.role === option.value ? ' role-option--active' : ''}`}
                  aria-pressed={values.role === option.value}
                  disabled={isMe && option.value !== 'admin'}
                  onClick={() => set('role', option.value)}
                >
                  <strong>{option.title}</strong>
                  <small>{option.text}</small>
                </button>
              ))}
            </div>
          </fieldset>

          {values.role === 'equipe' && (
            <fieldset className="input input--full">
              <legend>Áreas que pode ver e editar</legend>
              <div className="chips">
                {areas.map((area) => {
                  const active = values.permissions.includes(area);
                  return (
                    <button
                      key={area}
                      type="button"
                      className={`chip${active ? ' chip--active' : ''}`}
                      aria-pressed={active}
                      onClick={() => toggleArea(area)}
                    >
                      {areaLabels[area]}
                    </button>
                  );
                })}
              </div>
              <p className="input__hint">
                Atenção: “Clientes” e “Funcionários” mostram valores e pagamentos. A página Acessos é só de administradores.
              </p>
            </fieldset>
          )}
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="form__footer">
          {user && !isMe && (
            <>
              <button type="button" className="text-btn text-btn--danger" onClick={handleDelete}>
                Excluir login
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                disabled={saving}
                onClick={() => save({ active: !values.active })}
              >
                {values.active ? 'Bloquear' : 'Desbloquear'}
              </button>
            </>
          )}
          <button type="submit" className="btn btn--red" disabled={saving}>
            {saving ? 'Salvando…' : user ? 'Salvar' : 'Criar login'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
