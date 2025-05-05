import { useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts";
import { LoadingProvider, useLoading } from "./contexts/LoadingContext";
import RouterSetup from "./components/routes/RouterSetup";
import RouterTransition from "./components/routes/RouterTransition";
import { ErrorBoundary } from "./components/routes/ErrorBoundary";

function App() {
  const { stop } = useLoading();

  return (
    <div className="font-nsk">
      <BrowserRouter>
        <AuthProvider>
          <LoadingProvider>
            <RouterTransition />
            <ErrorBoundary onError={() => stop()}>
              <RouterSetup />
            </ErrorBoundary>
          </LoadingProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
