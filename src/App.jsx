import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, ClipboardList, Utensils, MessageCircle, User, Scan } from 'lucide-react';
import { PantryProvider, usePantry } from './lib/PantryContext';

// Views
import HomeView from './components/views/HomeView';
import InventoryView from './components/views/InventoryView';
import RecipeView from './components/views/RecipeView';
import RecipeDetailView from './components/views/RecipeDetailView';
import AIChatView from './components/views/AIChatView';
import ProfileView from './components/views/ProfileView';
import ScannerView from './components/views/ScannerView';
import AddProductView from './components/views/AddProductView';
import DietView from './components/views/DietView';
import AchievementView from './components/views/AchievementView';
import OnboardingView from './components/views/OnboardingView';
import LandingView from './components/views/LandingView';

function AppContent() {
  const { view, goTo, user, showOnboarding, theme } = usePantry();

  // Primary navigation views
  const navItems = [
    { id: 'home', icon: <Home />, label: 'Inicio' },
    { id: 'inventory', icon: <ClipboardList />, label: 'Despensa' },
    { id: 'scanner', icon: <Scan />, label: 'Escanear', special: true },
    { id: 'recipes', icon: <Utensils />, label: 'Recetas' },
    { id: 'profile', icon: <User />, label: 'Perfil' }
  ];

  if (!user) return <LandingView />;
  if (showOnboarding) return <OnboardingView />;

  const renderView = () => {
    switch (view) {
      case 'home': return <HomeView />;
      case 'inventory': return <InventoryView />;
      case 'recipes': return <RecipeView />;
      case 'recipe-detail': return <RecipeDetailView />;
      case 'chat': return <AIChatView />;
      case 'profile': return <ProfileView />;
      case 'scanner': return <ScannerView />;
      case 'add-product': return <AddProductView />;
      case 'diet-settings': return <DietView />;
      case 'achievements': return <AchievementView />;
      default: return <HomeView />;
    }
  };

  const showNavbar = ['home', 'inventory', 'recipes', 'chat', 'profile', 'diet-settings', 'achievements'].includes(view);

  return (
    <div className="app-container" data-theme={theme}>
      <main className="content-area" style={{ paddingBottom: showNavbar ? '120px' : '0' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* iOS Style Bottom Tab Bar */}
      {showNavbar && (
        <nav className="ios-tab-bar">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`tab-item ${view === item.id ? 'active' : ''} ${item.special ? 'special-scanner-btn' : ''}`}
              onClick={() => goTo(item.id)}
            >
              <div className="icon-wrapper">
                {item.icon}
              </div>
              {!item.special && <span className="label">
                {item.id === 'home' ? 'Inicio' :
                  item.id === 'inventory' ? 'Despensa' :
                    item.id === 'recipes' ? 'Recetas' : 'Perfil'}
              </span>}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

function App() {
  return (
    <PantryProvider>
      <AppContent />
    </PantryProvider>
  );
}

export default App;
