import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavbarScroll } from '../hooks/useNavbarScroll';
import LanguageSwitcher from './LanguageSwitcher';
import {
  IconClose,
  IconCompass,
  IconHome,
  IconMenu,
  IconProgress,
  IconRoadmap,
  IconTasks,
  IconTest,
} from './Icons';

const NAV_LINK_KEYS = [
  { to: '/home', labelKey: 'nav.home', icon: IconHome, auth: true },
  { to: '/directions', labelKey: 'nav.directions', icon: IconCompass, auth: true },
  { to: '/test', labelKey: 'nav.test', icon: IconTest, auth: true },
  { to: '/tasks', labelKey: 'nav.tasks', icon: IconTasks, auth: true },
  { to: '/roadmap', labelKey: 'nav.roadmap', icon: IconRoadmap, auth: true },
  { to: '/progress', labelKey: 'nav.progress', icon: IconProgress, auth: true },
];

function Navbar() {
  const navigate = useNavigate();
  const { loggedIn, logout, user } = useAuth();
  const { t } = useLanguage();
  const scrolled = useNavbarScroll();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/register');
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const visibleLinks = NAV_LINK_KEYS.filter((link) => loggedIn && link.auth);

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <nav className="navbar-inner">
          <button
            type="button"
            className="navbar-toggle"
            aria-label={menuOpen ? t('nav.close') : t('nav.sections')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
          </button>

          <LanguageSwitcher compact className="navbar-lang" />

          <Link to={loggedIn ? '/home' : '/register'} className="navbar-logo" onClick={closeMenu}>
            {t('app.name')}
          </Link>

          {loggedIn && user?.full_name && (
            <span className="navbar-user">{user.full_name}</span>
          )}
        </nav>
      </header>

      <aside className={`sidebar ${menuOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <strong>{t('nav.sections')}</strong>
          <button type="button" onClick={closeMenu} aria-label={t('nav.close')}>
            <IconClose size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <Icon size={20} />
                {t(link.labelKey)}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {loggedIn ? (
            <button type="button" onClick={handleLogout} className="sidebar-logout">
              {t('nav.logout')}
            </button>
          ) : (
            <>
              <Link to="/login" className="sidebar-link" onClick={closeMenu}>{t('nav.login')}</Link>
              <Link to="/register" className="btn-primary sidebar-register" onClick={closeMenu}>
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      </aside>

      {menuOpen && (
        <button type="button" className="sidebar-backdrop" aria-label={t('nav.close')} onClick={closeMenu} />
      )}
    </>
  );
}

export default Navbar;
