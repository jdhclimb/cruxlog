import { useEffect, useState } from "react";
import Login from "./Login";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ADMIN_UID = "Z6vFmSzJGgYp47svM4qFqPCK8Mj2";
const [gymName, setGymName] = useState("");
const [gymRegion, setGymRegion] = useState("");
const [gymAddress, setGymAddress] = useState("");

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [gymName, setGymName] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
  }, []);

  if (!ready) return <div style={{ padding: 24 }}>로딩중...</div>;
  if (!user) return <Login />;

  const isAdmin = user.uid === ADMIN_UID;

  const addGym = async () => {
  if (!gymName || !gymRegion || !gymAddress) {
    alert("암장 이름/지역/주소 다 입력해줘 🙏");
    return;
  }

  try {
    // 1) gyms 문서 생성
    const gymRef = await addDoc(collection(db, "gyms"), {
      name: gymName.trim(),
      region: gymRegion.trim(),
      address: gymAddress.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: user.uid,
    });

    // 2) (선택) 기본 그레이드 세트 자동 생성
    // 너가 원하면 A암장/B암장처럼 프리셋으로 바꾸는 것도 가능!
    const defaultGrades = [
      { rank: 1, colorName: "흰색", colorHex: "#FFFFFF" },
      { rank: 2, colorName: "노랑", colorHex: "#F7D400" },
      { rank: 3, colorName: "연두", colorHex: "#A8E10C" },
      { rank: 4, colorName: "초록", colorHex: "#12B76A" },
      { rank: 5, colorName: "파랑", colorHex: "#2E90FA" },
      { rank: 6, colorName: "빨강", colorHex: "#F04438" },
      { rank: 7, colorName: "회색", colorHex: "#98A2B3" },
      { rank: 8, colorName: "갈색", colorHex: "#8B5E3C" },
      { rank: 9, colorName: "핑크", colorHex: "#F670C7" },
      { rank: 10, colorName: "검정", colorHex: "#101828" },
    ];

    // 서브컬렉션에 넣기
    for (const g of defaultGrades) {
      await addDoc(collection(db, "gyms", gymRef.id, "grade_colors"), {
        ...g,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
      });
    }

    setGymName("");
    setGymRegion("");
    setGymAddress("");
    alert("암장 + 기본 그레이드 세트 등록 완료 🔥");
  } catch (e) {
    console.error(e);
    alert("등록 실패 ❌ (Rules/권한/네트워크 확인)");
  }
};

  return (
    <div style={{ padding: 24 }}>
      <h1>CruxLog</h1>
      <p>
        로그인됨: {user.isAnonymous ? "(익명 사용자)" : user.email}
      </p>

      <button onClick={() => signOut(auth)}>로그아웃</button>

      {isAdmin && (
  <div style={{ marginTop: 30 }}>
    <h2>관리자 전용: 암장 등록</h2>

    <div style={{ display: "grid", gap: 10, maxWidth: 420 }}>
      <input
        placeholder="암장 이름"
        value={gymName}
        onChange={(e) => setGymName(e.target.value)}
        style={{ padding: 10 }}
      />
      <input
        placeholder="지역 (예: 서울/경기/부산)"
        value={gymRegion}
        onChange={(e) => setGymRegion(e.target.value)}
        style={{ padding: 10 }}
      />
      <input
        placeholder="주소"
        value={gymAddress}
        onChange={(e) => setGymAddress(e.target.value)}
        style={{ padding: 10 }}
      />

      <button onClick={addGym} style={{ padding: 10 }}>
        암장 추가
      </button>
    </div>
  </div>
)}

    </div>
  );
}
