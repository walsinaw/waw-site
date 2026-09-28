import { useState, type FormEvent } from 'react';
import { signIn } from '../lib/api';
import Logo from '../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin admin--center">
      <form className="admin-card admin-login" onSubmit={handleSubmit}>
        <Logo variant="waw" className="admin-login__logo" />
        <h1 className="admin-login__title">Painel WAW</h1>
        <label className="admin-field">
          <span>E-mail</span>
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="admin-field">
          <span>Senha</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" className="admin-button admin-button--primary" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
