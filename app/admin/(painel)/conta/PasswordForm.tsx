"use client";

import { useActionState } from "react";
import { changePassword } from "../../actions";

export default function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined);

  return (
    <form action={action} className="form panel-card">
      <label>
        Senha actual
        <input type="password" name="current" autoComplete="current-password" required />
      </label>
      <label>
        Nova senha (mín. 8 caracteres)
        <input type="password" name="next" autoComplete="new-password" minLength={8} required />
      </label>
      <label>
        Confirmar nova senha
        <input type="password" name="confirm" autoComplete="new-password" minLength={8} required />
      </label>

      {state?.error && <p className="form-error" role="alert">{state.error}</p>}
      {state?.ok && <p className="form-ok" role="status">{state.ok}</p>}

      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "A guardar…" : "Alterar senha"}
      </button>
    </form>
  );
}
