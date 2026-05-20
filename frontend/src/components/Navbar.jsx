import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavbarScroll } from '../hooks/useNavbarScroll';
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

const NAV_LINKS = [
  { to: '/home', label: 'Bosh sahifa', icon: IconHome, auth: true },
  { to: '/directions', label: "Yo'nalishlar", icon: IconCompass, auth: true },
  { to: '/test', label: 'Test', icon: IconTest, auth: true },
  { to: '/tasks', label: 'Vazifalar', icon: IconTasks, auth: true },
  { to: '/roadmap', label: "O'rganish rejasi", icon: IconRoadmap, auth: true },
  { to: '/progress', label: 'Natijalarim', icon: IconProgress, auth: true },
];

function Navbar() {
  const navigate = useNavigate();
  const { loggedIn, logout, user } = useAuth();
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

  const visibleLinks = NAV_LINKS.filter((link) => loggedIn && link.auth);

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <nav className="navbar-inner">
          <button
            type="button"
            className="navbar-toggle"
            aria-label={menuOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
          </button>

          <Link to={loggedIn ? '/home' : '/register'} className="navbar-logo" onClick={closeMenu}>
            IT Navigator
          </Link>

          {loggedIn && user?.full_name && (
            <span className="navbar-user">{user.full_name}</span>
          )}
        </nav>
      </header>

      <aside className={`sidebar ${menuOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <strong>Bo&apos;limlar</strong>
          <button type="button" onClick={closeMenu} aria-label="Yopish">
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
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {loggedIn ? (
            <button type="button" onClick={handleLogout} className="sidebar-logout">
              Chiqish
            </button>
          ) : (
            <>
              <Link to="/login" className="sidebar-link" onClick={closeMenu}>Kirish</Link>
              <Link to="/register" className="btn-primary sidebar-register" onClick={closeMenu}>Ro&apos;yxatdan o&apos;tish</Link>
            </>
          )}
        </div>
      </aside>

      {menuOpen && (
        <button type="button" className="sidebar-backdrop" aria-label="Menyuni yopish" onClick={closeMenu} />
      )}
    </>
  );
}

export default Navbar;
