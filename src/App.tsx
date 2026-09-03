import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CaptchaProvider } from './context/CaptchaContext';
import { PopupProvider } from './context/PopupContext';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { RageQuitModal } from './components/common/RageQuitModal';
import { TopBannerAd } from './components/ads/TopBannerAd';
import { FloatingScamAd } from './components/ads/FloatingScamAd';
import { PopupHell } from './components/ads/PopupHell';
import { CaptchaModal } from './components/captcha/CaptchaModal';
import { LoginForm } from './components/login/LoginForm';
import { FeedView } from './components/feed/FeedView';
import { NetworkView } from './components/network/NetworkView';
import { JobsView } from './components/jobs/JobsView';
import { MessagesView } from './components/messages/MessagesView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { SearchBarModal } from './components/search/SearchBar';
import { useReversedScroll } from './utils/useReversedScroll';

const MainShell: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('feed');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isRageQuitOpen, setIsRageQuitOpen] = useState<boolean>(false);

  // Activates occasional silent 3.5s scroll reversal
  useReversedScroll();

  const renderCurrentView = () => {
    switch (currentTab) {
      case 'feed': return <FeedView />;
      case 'network': return <NetworkView />;
      case 'jobs': return <JobsView />;
      case 'messages': return <MessagesView />;
      case 'notifications': return <NotificationsView />;
      case 'profile': return <ProfileView />;
      case 'settings': return <SettingsView />;
      default: return <FeedView />;
    }
  };

  return (
    <div className="linkedout-master-shell">
      {/* Intrusive Advertisements from the very beginning */}
      <TopBannerAd />
      <FloatingScamAd />
      <PopupHell />
      <ToastContainer />
      <CaptchaModal />
      <SearchBarModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <RageQuitModal isOpen={isRageQuitOpen} onClose={() => setIsRageQuitOpen(false)} />

      {/* Main navigation header when logged in */}
      {isLoggedIn && (
        <Navbar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          onOpenSearch={() => setIsSearchOpen(true)}
          onTriggerRageQuit={() => setIsRageQuitOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main className="main-content-flow">
        {!isLoggedIn ? (
          <LoginForm />
        ) : (
          <div className="authenticated-view-container">
            {renderCurrentView()}
          </div>
        )}
      </main>

      {/* Cursed Footer */}
      <footer className="cursed-footer-bar">
        <div className="footer-links">
          <span>About (Don't bother)</span>
          <span>•</span>
          <span>User Agreement (You have already violated it)</span>
          <span>•</span>
          <span>Privacy Policy (Undefined)</span>
          <span>•</span>
          <span>Cookie Preferences (We like chocolate chip)</span>
          <span>•</span>
          <span>Ad Choices (You have none)</span>
        </div>
        <p className="footer-copyright">
          SUPERGLUEDIN Corporation © 2026. Made with intentional agony for human verification entertainment.
        </p>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <CaptchaProvider>
        <PopupProvider>
          <MainShell />
        </PopupProvider>
      </CaptchaProvider>
    </AuthProvider>
  );
}

export default App;
