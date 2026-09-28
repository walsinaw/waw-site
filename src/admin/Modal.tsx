import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  /** Primeira parte do título, em branco (ex.: "Cadastrar") */
  title: string;
  /** Parte destacada em vermelho (ex.: "Novo Projeto") */
  highlight: string;
  onClose: () => void;
  children: ReactNode;
}

// Janela centralizada usada nos cadastros e edições do painel.
export default function Modal({ title, highlight, onClose, children }: ModalProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`${title} ${highlight}`}>
      <button type="button" className="modal__backdrop" aria-label="Fechar" onClick={onClose} />
      <div className="modal__panel">
        <div className="modal__head">
          <h2 className="modal__title">
            {title} <em>{highlight}</em>
          </h2>
          <button type="button" className="modal__close" aria-label="Fechar" onClick={onClose}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
