import { useEffect, type ReactNode } from 'react';

interface DrawerProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Drawer({ title, onClose, children }: DrawerProps) {
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
    <div className="admin-drawer" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="admin-drawer__backdrop" aria-label="Fechar" onClick={onClose} />
      <div className="admin-drawer__panel">
        <div className="admin-drawer__head">
          <h2>{title}</h2>
          <button type="button" className="admin-link" onClick={onClose}>
            Fechar ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
