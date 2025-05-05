import { BrowserRouter } from "react-router-dom";
import RouterSetup from "./components/routes/RouterSetup";
import { AuthProvider } from "./contexts";
import RouterTransition from "./components/routes/RouterTransition";

function App() {
  return (
    <div className="font-nsk">
      <BrowserRouter>
        <AuthProvider>
          <RouterTransition />
          <RouterSetup />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
