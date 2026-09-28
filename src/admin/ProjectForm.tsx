import { useState, type FormEvent } from 'react';
import { saveProject, uploadCover } from '../lib/api';
import type { LinkType, Project, ProjectInput } from '../lib/types';
import Drawer from './Drawer';

interface ProjectFormProps {
  project: Project | null;
  nextPosition: number;
  onClose: () => void;
  onSaved: () => void;
}

const linkOptions: { value: LinkType; label: string; hint: string }[] = [
  { value: 'behance', label: 'Behance', hint: 'Abre o case no Behance' },
  { value: 'site', label: 'Site', hint: 'Abre o site que vocês fizeram' },
  { value: 'none', label: 'Sem link', hint: 'Só mostra a imagem' },
];

export default function ProjectForm({ project, nextPosition, onClose, onSaved }: ProjectFormProps) {
  const [values, setValues] = useState<ProjectInput>(
    project
      ? (({ id: _id, created_at: _createdAt, ...rest }) => rest)(project)
      : {
          title: '',
          categories: '',
          description: '',
          cover_url: null,
          link_type: 'behance',
          link_url: '',
          featured: true,
          published: true,
          position: nextPosition,
        },
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      set('cover_url', await uploadCover(file));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    let linkUrl = values.link_url?.trim() || null;
    if (values.link_type !== 'none') {
      if (!linkUrl) return setError('Coloque o link do projeto (ou escolha “Sem link”).');
      if (!/^https?:\/\//i.test(linkUrl)) linkUrl = `https://${linkUrl}`;
    } else {
      linkUrl = null;
    }

    setSaving(true);
    try {
      await saveProject(
        {
          ...values,
          title: values.title.trim(),
          categories: values.categories.trim(),
          description: values.description.trim(),
          link_url: linkUrl,
        },
        project?.id,
      );
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  };

  return (
    <Drawer title={project ? 'Editar projeto' : 'Novo projeto'} onClose={onClose}>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <span>Capa</span>
          <label className="admin-upload">
            {values.cover_url ? (
              <img src={values.cover_url} alt="" />
            ) : (
              <span className="admin-muted">{uploading ? 'Enviando…' : 'Clique para escolher uma imagem (JPG, PNG ou WEBP)'}</span>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
          <small className="admin-muted">Formato ideal: 1566 × 958 px (proporção dos cards do site).</small>
          {values.cover_url && (
            <button type="button" className="admin-link admin-link--danger" onClick={() => set('cover_url', null)}>
              Remover imagem
            </button>
          )}
        </div>

        <label className="admin-field">
          <span>Nome do projeto *</span>
          <input value={values.title} onChange={(e) => set('title', e.target.value)} required maxLength={120} />
        </label>

        <label className="admin-field">
          <span>Especialidades</span>
          <input
            value={values.categories}
            onChange={(e) => set('categories', e.target.value)}
            placeholder="Landing Page · Desenvolvimento Web · UX/UI"
          />
        </label>

        <label className="admin-field">
          <span>Descrição curta</span>
          <textarea
            rows={3}
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
            maxLength={220}
            placeholder="Uma frase sobre o desafio e a solução."
          />
        </label>

        <fieldset className="admin-field">
          <legend>Ao clicar no projeto</legend>
          <div className="admin-segmented">
            {linkOptions.map((option) => (
              <label key={option.value} className={values.link_type === option.value ? 'is-active' : ''}>
                <input
                  type="radio"
                  name="link_type"
                  value={option.value}
                  checked={values.link_type === option.value}
                  onChange={() => set('link_type', option.value)}
                />
                <strong>{option.label}</strong>
                <small>{option.hint}</small>
              </label>
            ))}
          </div>
        </fieldset>

        {values.link_type !== 'none' && (
          <label className="admin-field">
            <span>{values.link_type === 'behance' ? 'Link do Behance' : 'Endereço do site'}</span>
            <input
              value={values.link_url ?? ''}
              onChange={(e) => set('link_url', e.target.value)}
              placeholder={values.link_type === 'behance' ? 'https://www.behance.net/gallery/…' : 'https://…'}
            />
          </label>
        )}

        <div className="admin-row">
          <label className="admin-switch">
            <input type="checkbox" checked={values.published} onChange={(e) => set('published', e.target.checked)} />
            <span>Publicado</span>
          </label>
          <label className="admin-switch">
            <input type="checkbox" checked={values.featured} onChange={(e) => set('featured', e.target.checked)} />
            <span>Mostrar na home</span>
          </label>
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-form__footer">
          <button type="button" className="admin-button" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="admin-button admin-button--primary" disabled={saving || uploading}>
            {saving ? 'Salvando…' : 'Salvar projeto'}
          </button>
        </div>
      </form>
    </Drawer>
  );
}
