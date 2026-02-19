import { app } from "./firebase";

export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>CruxLog</h1>
      <p>Firebase projectId: {app.options.projectId}</p>
    </div>
  );
}
