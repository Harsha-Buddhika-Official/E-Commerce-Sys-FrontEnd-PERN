import AppRouter from "./App/routers/AppRouter.jsx";
import { useAutoLogout } from "./modules/admin/features/auth/hooks/useAuth.js";
import CartSuccessToast from "./modules/public/components/Notifications/CartSuccessToast.jsx";

function App() {
  useAutoLogout();
  return (
    <>
      <CartSuccessToast />
      <AppRouter />
    </>
  );
}

export default App;
