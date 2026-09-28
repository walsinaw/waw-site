import { useState, type FormEvent } from 'react';
import { deleteProject, saveProject, uploadCover } from '../lib/api';
import { joinCategories, specialties, splitCategories, type LinkType, type Project, type ProjectInput } from '../lib/types';
import Modal from './Modal';
import ChipPicker from './ChipPicker';

interface ProjectFormProps {
  project: Project | null;
  nextPosition: number;
  onClose: () => void;
  onSaved: () => void;
}

const linkOptions: { value: LinkType; label: string }[] = [
  { value: 'behance', label: 'Behance' },
  { value: 'site', label: 'Site do cliente' },
  { value: 'instagram', label: 'Instagram do cliente' },
  { value: 'none', label: 'Sem link' },
];

const linkFields: Record<LinkType, { label: string; placeholder: string }> = {
  behance: { label: 'Link do Behance', placeholder: 'https://www.behance.net/gallery/…' },
  site: { label: 'Endereço do site', placeholder: 'https://site-do-cliente.com.br' },
  instagram: { label: 'Instagram do cliente', placeholder: '@cliente ou https://instagram.com/cliente' },
  none: { label: 'Link', placeholder: 'Sem link: o card não leva para lugar nenhum' },
};

/** Aceita "@perfil", "perfil", "instagram.com/perfil" ou o link completo. */
function normalizeLink(type: LinkType, value: string) {
  if (type === 'instagram' && !/instagram\.com/i.test(value)) {
    return `https://www.instagram.com/${value.replace(/^@/, '').replace(/\/+$/, '')}/`;
  }
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

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

  const save = async (overrides: Partial<ProjectInput> = {}) => {
    setError('');
    if (!values.title.trim()) return setError('Dê um nome para o projeto.');

    let linkUrl = values.link_url?.trim() || null;
    if (values.link_type !== 'none') {
      if (!linkUrl) return setError('Coloque o link do projeto (ou escolha “Sem link”).');
      linkUrl = normalizeLink(values.link_type, linkUrl);
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
          ...overrides,
        },
        project?.id,
      );
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
    if (!project || !window.confirm(`Excluir o projeto "${project.title}"? Isso não pode ser desfeito.`)) return;
    try {
      await deleteProject(project.id);
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Modal title={project ? 'Editar' : 'Cadastrar'} highlight={project ? 'Projeto' : 'Novo Projeto'} onClose={onClose}>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form__grid">
          <label className="input">
            <span>
              Nome do projeto <b>*</b>
            </span>
            <input
              value={values.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Ex.: Dandala Sousa"
              maxLength={120}
              required
            />
          </label>

          <label className="input">
            <span>Mostrar na home</span>
            <select value={values.featured ? 'sim' : 'nao'} onChange={(e) => set('featured', e.target.value === 'sim')}>
              <option value="sim">Sim</option>
              <option value="nao">Não (só em /portfolio)</option>
            </select>
          </label>

          <label className="input">
            <span>Ao clicar, abre</span>
            <select value={values.link_type} onChange={(e) => set('link_type', e.target.value as LinkType)}>
              {linkOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="input input--full">
            <span>{linkFields[values.link_type].label}</span>
            <input
              value={values.link_type === 'none' ? '' : values.link_url ?? ''}
              onChange={(e) => set('link_url', e.target.value)}
              placeholder={linkFields[values.link_type].placeholder}
              disabled={values.link_type === 'none'}
            />
          </label>

          <fieldset className="input input--full">
            <legend>Especialidades</legend>
            <ChipPicker
              options={specialties}
              selected={splitCategories(values.categories)}
              onChange={(selected) => set('categories', joinCategories(selected))}
            />
          </fieldset>

          <div className="input">
            <span>Capa</span>
            <label className={`upload${values.cover_url ? ' upload--filled' : ''}`}>
              {values.cover_url ? (
                <img src={values.cover_url} alt="" />
              ) : (
                <span>{uploading ? 'Ajustando e enviando…' : 'Clique para escolher a imagem'}</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>
            <small className="input__hint">
              Qualquer tamanho: ajustamos sozinhos ao formato do card.{' '}
              {values.cover_url && (
                <button type="button" className="text-btn" onClick={() => set('cover_url', null)}>
                  Remover
                </button>
              )}
            </small>
          </div>

          <label className="input input--wide">
            <span>Descrição</span>
            <textarea
              value={values.description}
              onChange={(e) => set('description', e.target.value)}
              maxLength={220}
              placeholder="Uma frase sobre o desafio e a solução."
            />
          </label>
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="form__footer">
          {project && (
            <>
              <button type="button" className="text-btn text-btn--danger" onClick={handleDelete}>
                Excluir
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                disabled={saving || uploading}
                onClick={() => save({ published: !project.published })}
              >
                {project.published ? 'Desativar' : 'Reativar'}
              </button>
            </>
          )}
          <button type="submit" className="btn btn--red" disabled={saving || uploading}>
            {saving ? 'Salvando…' : project ? 'Salvar' : 'Publicar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
