import { Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "./store/useStore";
import { Toaster } from "react-hot-toast";
import VerificationScreen from "./screens/VerificationScreen";
import VerificationResultsScreen from "./screens/VerificationResultsScreen";
import ConsentFormScreen from "./screens/ConsentFormScreen";
import ConsentLetterScreen from "./screens/ConsentLetterScreen";
import HomeScreen from "./screens/HomeScreen";
import VerificationLoginScreen from "./screens/VerificationLoginScreen";
import SignatureScreen from "./screens/SignatureScreen"; // Added SignatureScreen import

function App() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  // Protected route component for verification portal
  const VerificationProtectedRoute = ({
    children,
  }: {
    children: JSX.Element;
  }) => {
    // For now, we'll use the same authentication state
    // In a real app, you might have separate authentication for each portal
    return isAuthenticated ? (
      children
    ) : (
      <Navigate to="/verification-login" replace />
    );
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route
          path="/verification-login"
          element={<VerificationLoginScreen />}
        />
        <Route
          path="/verification"
          element={
            <VerificationProtectedRoute>
              <VerificationScreen />
            </VerificationProtectedRoute>
          }
        />
        <Route
          path="/consent-form"
          element={
            <VerificationProtectedRoute>
              <ConsentFormScreen />
            </VerificationProtectedRoute>
          }
        />
        <Route
          path="/consent-letter"
          element={
            <VerificationProtectedRoute>
              <ConsentLetterScreen />
            </VerificationProtectedRoute>
          }
        />
        // Added route for signature screen
        <Route
          path="/signature"
          element={
            <VerificationProtectedRoute>
              <SignatureScreen />
            </VerificationProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;