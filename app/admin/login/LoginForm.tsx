"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="form">
      <label>
        E-mail
        <input type="email" name="email" autoComplete="username" required autoFocus />
      </label>
      <label>
        Senha
        <input type="password" name="password" autoComplete="current-password" required />
      </label>

      {state?.error && <p className="form-error" role="alert">{state.error}</p>}

      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "A entrar…" : "Entrar"}
      </button>
    </form>
  );
}
