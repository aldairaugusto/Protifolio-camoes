"use client";

import { useActionState } from "react";
import { saveProfile } from "../../profile-actions";

type Profile = {
  fullName: string; heroLabel: string; heroText: string; heroBadge: string; heroBadgeSub: string;
  aboutQuote: string; aboutText: string; photoUrl: string | null; cvUrl: string | null;
  email: string; phone1: string; phone2: string | null; whatsapp: string;
  facebook: string | null; linkedin: string | null;
};

export default function ProfileForm({ profile: p }: { profile: Profile }) {
  const [state, action, pending] = useActionState(saveProfile, undefined);

  return (
    <form action={action} className="form profile-form">
      <fieldset>
        <legend>Topo do site</legend>
        <label>Nome completo
          <input name="fullName" defaultValue={p.fullName} maxLength={80} required />
        </label>
        <label>Etiqueta acima do nome
          <input name="heroLabel" defaultValue={p.heroLabel} maxLength={60} required />
        </label>
        <label>Texto de apresentação
          <textarea name="heroText" defaultValue={p.heroText} rows={4} maxLength={500} required />
        </label>
        <div className="form-row">
          <label>Cartão da foto: título
            <input name="heroBadge" defaultValue={p.heroBadge} maxLength={60} required />
          </label>
          <label>Cartão da foto: subtítulo
            <input name="heroBadgeSub" defaultValue={p.heroBadgeSub} maxLength={80} required />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Sobre mim</legend>
        <label>Frase do cartão
          <textarea name="aboutQuote" defaultValue={p.aboutQuote} rows={3} maxLength={300} required />
        </label>
        <label>Texto do perfil
          <textarea name="aboutText" defaultValue={p.aboutText} rows={9} maxLength={3000} required />
          <span className="form-hint">Separe os parágrafos com uma linha em branco.</span>
        </label>
      </fieldset>

      <fieldset>
        <legend>Foto e CV</legend>
        <div className="upload-row">
          {p.photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="thumb" src={p.photoUrl} alt="Foto actual" />
          )}
          <label>Nova foto (JPG, PNG ou WebP, até 4 MB)
            <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" />
            <span className="form-hint">Deixe vazio para manter a foto actual.</span>
          </label>
        </div>
        <div className="upload-row">
          {p.cvUrl && (
            <a className="btn btn-outline" href={p.cvUrl} target="_blank" rel="noopener noreferrer">
              Ver CV actual
            </a>
          )}
          <label>Novo CV (PDF, até 4 MB)
            <input type="file" name="cv" accept="application/pdf" />
            <span className="form-hint">Deixe vazio para manter o CV actual.</span>
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Contactos e redes</legend>
        <div className="form-row">
          <label>Telefone 1
            <input name="phone1" defaultValue={p.phone1} maxLength={30} required />
          </label>
          <label>Telefone 2 (opcional)
            <input name="phone2" defaultValue={p.phone2 ?? ""} maxLength={30} />
          </label>
        </div>
        <div className="form-row">
          <label>E-mail
            <input type="email" name="email" defaultValue={p.email} maxLength={120} required />
          </label>
          <label>WhatsApp
            <input name="whatsapp" defaultValue={p.whatsapp} inputMode="numeric" required />
            <span className="form-hint">Só números, com indicativo. Ex.: 244974959145</span>
          </label>
        </div>
        <label>Facebook (opcional)
          <input type="url" name="facebook" defaultValue={p.facebook ?? ""} placeholder="https://facebook.com/..." />
        </label>
        <label>LinkedIn (opcional)
          <input type="url" name="linkedin" defaultValue={p.linkedin ?? ""} placeholder="https://linkedin.com/in/..." />
        </label>
      </fieldset>

      {state?.error && <p className="form-error" role="alert">{state.error}</p>}
      {state?.ok && <p className="form-ok" role="status">{state.ok}</p>}

      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "A guardar…" : "Guardar alterações"}
      </button>
    </form>
  );
}
