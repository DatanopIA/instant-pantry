import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PantryDashboard from './pages/PantryDashboard';
import InventoryList from './pages/InventoryList';
import FridgeScanner from './pages/FridgeScanner';
import RecipesPage from './pages/RecipesPage';
import ProfileAnalytics from './pages/ProfileAnalytics';
import PrivacyPolicy from './pages/PrivacyPolicy';
import PremiumSubscription from './pages/PremiumSubscription';
import AccountSettings from './pages/AccountSettings';
import LandingPage from './pages/LandingPage';
import Layout from './components/Layout';

import { useEffect, useState } from 'react';
import { supabase } from './utils/supabase';

function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show a blank/loading state while session is being checked
  if (session === undefined) return null;

  return (
    <Router>
      <Routes>
        {session ? (
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<PantryDashboard />} />
                <Route path="/inventory" element={<InventoryList />} />
                <Route path="/recipes" element={<RecipesPage />} />
                <Route path="/scanner" element={<FridgeScanner />} />
                <Route path="/profile" element={<ProfileAnalytics />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/premium" element={<PremiumSubscription />} />
                <Route path="/settings/account" element={<AccountSettings />} />
                {/* Redirigir cualquier otra ruta al dashboard si está autenticado */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          } />
        ) : (
          <Route path="/*" element={
            <Routes>
              <Route path="*" element={<LandingPage />} />
            </Routes>
          } />
        )}
      </Routes>
    </Router>
  );
}

export default App;
