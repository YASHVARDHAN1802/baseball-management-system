// src/components/Sidebar.jsx
// Sidebar navigation with active state

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const navItems = [
  { path: '/dashboard',   label: 'Dashboard',    icon: '📊' },
  { path: '/teams',       label: 'Teams',         icon: '🏟️' },
  { path: '/players',     label: 'Players',       icon: '⚾' },
  { path: '/games',       label: 'Games',         icon: '📅' },
  { path: '/statistics',  label: 'Statistics',    icon: '📈' },
  { path: '/injuries',    label: 'Injuries',      icon: '🩹' },
  { path: '/contracts',   label: 'Contracts',     icon: '📄' },
  { path: '/stadiums',    label: 'Stadiums',      icon: '🏛️' },
  { path: '/leaderboard', label: 'Leaderboard',   icon: '🏆' },
];

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--color-bg-sidebar)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: isOpen ? 0 : '-100%',
      height: '100vh',
      zIndex: 200,
      transition: 'left 0.3s ease',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 40, height: 40,
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, boxShadow: 'var(--shadow-glow)',
        }}>⚾</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.05em', lineHeight: 1 }}>BASEBALL</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--color-primary)', letterSpacing: '0.1em' }}>MANAGEMENT</div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 8,
              marginBottom: 2,
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
              background: isActive ? 'rgba(232,69,26,0.12)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
              transition: 'all 0.2s',
            })}
          >
            <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      {user && (
        <div style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700,
          }}>
            {user.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1 }}>{user.username}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{user.role}</div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;