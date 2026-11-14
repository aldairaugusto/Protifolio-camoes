import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="login-wrap">
      <div className="login-card">
        <h1>Painel do portfólio</h1>
        <p>Entre com as suas credenciais para editar o conteúdo do site.</p>
        <LoginForm />
      </div>
    </main>
  );
}
