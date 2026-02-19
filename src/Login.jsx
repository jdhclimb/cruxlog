import { useState } from "react";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const loginGoogle = async () => {
    setErr("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      setErr(e.message);
    }
  };

  const loginAnonymous = async () => {
    setErr("");
    try {
      await signInAnonymously(auth);
    } catch (e) {
      setErr(e.message);
    }
  };

  const loginEmail = async () => {
    setErr("");
    try {
      await signInWithEmailAndPassword(auth, email, pw);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 420, display: "grid", gap: 12 }}>
      <h2>CruxLog</h2>

      <button onClick={loginGoogle} style={{ padding: 10, fontSize: 16 }}>
        Google 로그인
      </button>

      <button onClick={loginAnonymous} style={{ padding: 10, fontSize: 16 }}>
        로그인 없이 시작(익명)
      </button>

      <hr />

      <div style={{ display: "grid", gap: 8 }}>
        <input
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, fontSize: 16 }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          style={{ padding: 10, fontSize: 16 }}
        />
        <button onClick={loginEmail} style={{ padding: 10, fontSize: 16 }}>
          이메일/비번 로그인
        </button>
      </div>

      {err && <p style={{ color: "crimson" }}>{err}</p>}
    </div>
  );
}
