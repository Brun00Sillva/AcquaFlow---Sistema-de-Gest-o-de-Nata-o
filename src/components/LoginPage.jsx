import { useState } from "react";
import { supabase } from "../lib/supabase";
import { COLORS, FONT } from "../constants";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password,
    });

    setLoading(false);

    if (error) {
      setErr("Usuário ou senha incorretos.");
      return;
    }

    const { data: perfil, error: perfilError } = await supabase
  .from("usuarios")
  .select("papel, nome")
  .eq("id", data.user.id)
  .single();

console.log('UUID do usuário logado:', data.user.id);
console.log('Perfil encontrado:', perfil);
console.log('Erro:', perfilError);

    if (perfilError) {
      setErr("Erro ao buscar perfil do usuário.");
      return;
    }

    onLogin({
      user: data.user.email,
      id: data.user.id,
      name: perfil.nome || data.user.email,
      role: perfil.papel,
    });
  }

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    border: `1px solid ${COLORS.slate200}`,
    borderRadius: 8,
    fontSize: 14,
    color: COLORS.slate900,
    outline: "none",
    background: COLORS.slate50,
    fontFamily: FONT,
    transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
      fontFamily: FONT,
      padding: 20,
    }}>
      <div style={{
        background: "white",
        borderRadius: 12,
        padding: "44px 40px",
        width: "100%",
        maxWidth: 400,
        boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: 12,
            background: COLORS.primary,
            marginBottom: 14,
          }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "white", letterSpacing: "-0.5px" }}>AF</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: COLORS.slate900, letterSpacing: "-0.5px" }}>
            AcquaFlow
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: COLORS.slate500 }}>
            Sistema de Gestão de Natação
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.slate700, marginBottom: 6 }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="seu@email.com"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = COLORS.accent)}
              onBlur={(e) => (e.target.style.borderColor = COLORS.slate200)}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.slate700, marginBottom: 6 }}>
              Senha
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: 70 }}
                onFocus={(e) => (e.target.style.borderColor = COLORS.accent)}
                onBlur={(e) => (e.target.style.borderColor = COLORS.slate200)}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.accent,
                  padding: 0,
                  fontFamily: FONT,
                }}
              >
                {show ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22, cursor: "pointer", fontSize: 13, color: COLORS.slate700 }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ width: 15, height: 15, accentColor: COLORS.accent, cursor: "pointer" }}
            />
            Permanecer conectado
          </label>

          {err && (
            <div style={{
              background: COLORS.dangerSoft,
              border: `1px solid ${COLORS.danger}33`,
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
              color: COLORS.danger,
              marginBottom: 16,
            }}>
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 8,
              border: "none",
              cursor: loading ? "default" : "pointer",
              background: loading ? COLORS.slate400 : COLORS.primary,
              color: "white",
              fontWeight: 600,
              fontSize: 14,
              fontFamily: FONT,
              transition: "background 0.2s",
            }}
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}