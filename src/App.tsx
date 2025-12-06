import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts";
import { LoadingProvider, useLoading } from "./contexts/LoadingContext";
import { ActivityProvider } from "./contexts/ActivityContext";
import RouterSetup from "./components/routes/RouterSetup";
import RouterTransition from "./components/routes/RouterTransition";
import { ErrorBoundary } from "./components/routes/ErrorBoundary";

function AppInner() {
  const { stop } = useLoading();

  return (
    <>
      <RouterTransition />
      <ErrorBoundary onError={() => stop()}>
        <RouterSetup />
      </ErrorBoundary>
    </>
  );
}

function App() {
  return (
    <div className="font-nsk">
      <BrowserRouter>
        <AuthProvider>
          <LoadingProvider>
            <ActivityProvider>
              <AppInner />
            </ActivityProvider>
          </LoadingProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
