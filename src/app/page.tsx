import { AuthProvider } from "../components/oauth/AuthContext";
import HomeContent from "./HomeContent";

export default function Home() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
}
