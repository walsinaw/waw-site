import { useState, type FormEvent } from 'react';
import { changeMyPassword } from '../lib/api';
import Modal from './Modal';

// Qualquer pessoa logada troca a própria senha (ex.: a senha provisória que recebeu).
export default function PasswordForm({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (password.length < 8) return setError('A senha precisa ter pelo menos 8 caracteres.');
    if (password !== confirm) return setError('As duas senhas não são iguais.');
    setSaving(true);
    try {
      await changeMyPassword(password);
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Trocar" highlight="minha senha" onClose={onClose} size="small">
      {done ? (
        <>
          <p className="form__message">Pronto! A partir de agora, entre com a senha nova.</p>
          <div className="form__footer">
            <button type="button" className="btn btn--red" onClick={onClose}>
              Fechar
            </button>
          </div>
        </>
      ) : (
        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form__grid form__grid--single">
            <label className="input">
              <span>Nova senha</span>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Pelo menos 8 caracteres"
              />
            </label>
            <label className="input">
              <span>Repita a nova senha</span>
              <input
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </label>
          </div>
          {error && <p className="admin-error">{error}</p>}
          <div className="form__footer">
            <button type="submit" className="btn btn--red" disabled={saving}>
              {saving ? 'Salvando…' : 'Trocar senha'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
