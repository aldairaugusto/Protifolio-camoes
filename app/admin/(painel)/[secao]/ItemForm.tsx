"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { saveItem } from "../../section-actions";
import { ICON_SUGGESTIONS, type FieldDef } from "@/lib/sections";

function IconField({ field, defaultValue }: { field: FieldDef; defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  const preview = value.trim().toLowerCase().replace(/\s+/g, "-");
  const cls = preview.startsWith("fa-") ? preview : preview ? `fa-${preview}` : "";

  return (
    <label>
      {field.label}
      <div className="icon-field">
        <span className="icon-preview">{cls && <i className={`fas ${cls}`} />}</span>
        <input
          name={field.name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          list="icon-suggestions"
          placeholder="fa-laptop-code"
          required
        />
      </div>
      <span className="form-hint">
        Escolha da lista ou escreva o nome de um ícone gratuito do Font Awesome (fontawesome.com/icons).
      </span>
      <datalist id="icon-suggestions">
        {ICON_SUGGESTIONS.map((i) => <option key={i} value={i} />)}
      </datalist>
    </label>
  );
}

export default function ItemForm({
  secao,
  fields,
  item,
}: {
  secao: string;
  fields: FieldDef[];
  item?: Record<string, string | number>;
}) {
  const [state, action, pending] = useActionState(saveItem, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // Limpa o formulário depois de adicionar um item novo
  useEffect(() => {
    if (state?.ok && !item) formRef.current?.reset();
  }, [state, item]);

  return (
    <form ref={formRef} action={action} className="form item-form">
      <input type="hidden" name="secao" value={secao} />
      {item && <input type="hidden" name="id" value={item.id} />}

      {fields.map((f) => {
        const value = item ? String(item[f.name] ?? "") : "";
        if (f.type === "icon") return <IconField key={f.name} field={f} defaultValue={value} />;
        return (
          <label key={f.name}>
            {f.label}
            {f.type === "textarea" ? (
              <textarea name={f.name} defaultValue={value} rows={3} maxLength={f.max} required />
            ) : (
              <input
                name={f.name}
                defaultValue={value}
                type={f.type === "number" ? "number" : "text"}
                min={f.type === "number" ? 0 : undefined}
                max={f.type === "number" ? 100 : undefined}
                maxLength={f.max}
                required
              />
            )}
            {f.hint && <span className="form-hint">{f.hint}</span>}
          </label>
        );
      })}

      {state?.error && <p className="form-error" role="alert">{state.error}</p>}
      {state?.ok && <p className="form-ok" role="status">{state.ok}</p>}

      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "A guardar…" : item ? "Guardar alterações" : "Adicionar"}
      </button>
    </form>
  );
}
