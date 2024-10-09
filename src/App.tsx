import { BrowserRouter } from "react-router-dom";
import RouterSetup from "./components/routes/RouterSetup";
import { AuthProvider } from "./contexts";

function App() {
  return (
    <div className="font-nsk">
      <BrowserRouter>
        <AuthProvider>
          <RouterSetup />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
