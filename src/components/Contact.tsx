import { useState, type FormEvent } from 'react';
import { contact, services, type ServiceId } from '../data/content';
import whatsappIcon from '../assets/whatsapp.svg';
import instagramIcon from '../assets/instagram.svg';
import { createLead } from '../lib/api';
import Arrow from './Arrow';
import './Contact.css';

interface ContactProps {
  selectedServices: ServiceId[];
  onChangeServices: (services: ServiceId[]) => void;
}

interface FormValues {
  name: string;
  company: string;
  city: string;
  whatsapp: string;
  message: string;
}

type RequiredField = 'name' | 'company' | 'city' | 'whatsapp';

const emptyForm: FormValues = { name: '', company: '', city: '', whatsapp: '', message: '' };

const fields: { key: RequiredField; label: string; placeholder: string; type?: string; autoComplete: string }[] = [
  { key: 'name', label: 'Seu nome', placeholder: 'Ex: João Silva', autoComplete: 'name' },
  { key: 'company', label: 'Nome da Empresa', placeholder: 'Ex: Hamburgueria Burguer', autoComplete: 'organization' },
  { key: 'city', label: 'Cidade', placeholder: 'Ex: Pelotas', autoComplete: 'address-level2' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: 'Ex: DDD 99999-9999', type: 'tel', autoComplete: 'tel-national' },
];

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function Contact({ selectedServices, onChangeServices }: ContactProps) {
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<RequiredField, boolean>>>({});
  const [sent, setSent] = useState(false);

  const update = (key: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: key === 'whatsapp' ? formatPhone(value) : value }));
    if (key in errors) setErrors((current) => ({ ...current, [key]: false }));
  };

  const toggleService = (id: ServiceId) =>
    onChangeServices(
      selectedServices.includes(id) ? selectedServices.filter((s) => s !== id) : [...selectedServices, id],
    );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const nextErrors: Partial<Record<RequiredField, boolean>> = {};
    for (const field of fields) {
      if (!values[field.key].trim()) nextErrors[field.key] = true;
    }
    if (values.whatsapp && values.whatsapp.replace(/\D/g, '').length < 10) nextErrors.whatsapp = true;
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    const serviceNames = services
      .filter((s) => selectedServices.includes(s.id))
      .map((s) => s.label)
      .join(', ');

    const lines = [
      'Olá, WAW! Quero um UAU pra minha marca.',
      '',
      `*Nome:* ${values.name}`,
      `*Empresa:* ${values.company}`,
      `*Cidade:* ${values.city}`,
      `*WhatsApp:* ${values.whatsapp}`,
    ];
    if (serviceNames) lines.push(`*Serviços:* ${serviceNames}`);
    if (values.message.trim()) lines.push(`*Projeto:* ${values.message.trim()}`);

    const url = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
    // Abre o WhatsApp na hora (antes de qualquer espera, para o navegador não bloquear a janela)
    window.open(url, '_blank', 'noopener');
    // ...e registra o lead no painel /admin → Clientes.
    createLead({
      name: values.name.trim(),
      company: values.company.trim(),
      city: values.city.trim(),
      whatsapp: values.whatsapp,
      services: services.filter((s) => selectedServices.includes(s.id)).map((s) => s.label),
      notes: values.message.trim(),
    }).catch((error) => console.error('Não foi possível salvar o lead', error));

    setSent(true);
  };

  return (
    <section className="section contact" id="contato">
      <div className="container contact__layout">
        <div className="contact__copy">
          <h2>
            <span className="figma-title__label">WAW Studio</span>
            <span className="figma-title__line">ENTRE EM CONTATO</span>
          </h2>
          <p className="contact__lead">Precisa que sua empresa tenha um UAU? Vem conversar com a gente!</p>
          <p className="contact__text">
            Conta um pouco do seu projeto que a gente responde pelo WhatsApp, sem enrolação.
          </p>

          <div className="contact__channels">
            <a
              className="contact__channel"
              href={`https://wa.me/${contact.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              <img src={whatsappIcon} alt="" className="contact__icon" />
              <span>
                <span className="contact__channel-label">WhatsApp</span>
                <span className="contact__channel-value">{contact.whatsappDisplay}</span>
              </span>
            </a>
            <a className="contact__channel" href={contact.instagramUrl} target="_blank" rel="noreferrer">
              <img src={instagramIcon} alt="" className="contact__icon" />
              <span>
                <span className="contact__channel-label">Instagram</span>
                <span className="contact__channel-value">{contact.instagramHandle}</span>
              </span>
            </a>
          </div>
        </div>

        <form className="contact__form" onSubmit={handleSubmit} noValidate>
          <div className="contact__grid">
            {fields.map((field) => (
              <label key={field.key} className="field">
                <span className="field__label">
                  {field.label} <span className="field__required">*</span>
                </span>
                <input
                  className={`field__input${errors[field.key] ? ' field__input--error' : ''}`}
                  type={field.type ?? 'text'}
                  name={field.key}
                  autoComplete={field.autoComplete}
                  inputMode={field.type === 'tel' ? 'tel' : undefined}
                  placeholder={field.placeholder}
                  value={values[field.key]}
                  onChange={(event) => update(field.key, event.target.value)}
                  aria-invalid={errors[field.key] || undefined}
                  required
                />
              </label>
            ))}

            <fieldset className="field field--wide">
              <legend className="field__label">
                O que você precisa? <small className="field__note">pode marcar mais de uma opção</small>
              </legend>
              <div className="field__options">
                {services.map((service) => {
                  const active = selectedServices.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      className={`option${active ? ' option--active' : ''}`}
                      aria-pressed={active}
                      onClick={() => toggleService(service.id)}
                    >
                      <span className="option__check" aria-hidden="true" />
                      <span className="option__label">{service.label}</span>
                      <span className="option__title">{service.title}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label className="field field--wide">
              <span className="field__label">Conte sobre o seu projeto</span>
              <textarea
                className="field__input field__textarea"
                name="message"
                placeholder="Ex: Quero renovar a identidade da minha marca e lançar um site novo."
                value={values.message}
                onChange={(event) => update('message', event.target.value)}
              />
            </label>
          </div>

          <div className="contact__submit">
            <button type="submit" className="pill pill--red contact__submit-button">
              Enviar pelo WhatsApp
              <Arrow variant="small" direction="right" className="pill__arrow" />
            </button>
            <p className="contact__note" role="status">
              {sent
                ? 'Abrimos o WhatsApp com a sua mensagem. É só enviar!'
                : 'Sua mensagem já vai pronta no WhatsApp.'}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
