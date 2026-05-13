import AppRouter from "./App/routers/AppRouter.jsx";
import { useAutoLogout } from "./modules/admin/features/auth/hooks/useAuth.js";

function App() {
  useAutoLogout();
  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
