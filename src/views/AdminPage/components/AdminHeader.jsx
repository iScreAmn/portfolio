"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { HiArrowNarrowRight } from 'react-icons/hi';
import { logo } from '../../../assets/images';
import adminData from '../../../data/adminData';
import '../../../components/nav/NavPanel.css';
import './AdminHeader.css';

const { nav } = adminData;
const PANEL_ID = 'admin-nav-panel';

const revealDelay = (index) => `${40 + index * 45}ms`;

const isActiveHref = (pathname, href) => {
  if (!href.startsWith('/admin')) return false;
  return href === '/admin' ? pathname === href : pathname.startsWith(href);
};

const AdminHeader = ({ onLogout }) => {
  const pathname = usePathname() || '';
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  const closeAndRefocus = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeAndRefocus();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, closeAndRefocus]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const LogoutIcon = nav.logout.icon;

  return (
    <header className="admin-header">
      <Link href="/admin" className="admin-header__logo" aria-label={nav.logoAria}>
        <Image src={logo} alt={nav.logoAlt} sizes="44px" priority />
      </Link>

      <div className="nav-menu-root admin-nav-root" ref={rootRef}>
        <button
          ref={triggerRef}
          type="button"
          className="burger"
          data-open={isOpen}
          aria-expanded={isOpen}
          aria-controls={PANEL_ID}
          aria-haspopup="true"
          aria-label={isOpen ? nav.close : nav.open}
          title={isOpen ? nav.close : nav.open}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="burger-line burger-line--top" aria-hidden />
          <span className="burger-line burger-line--mid" aria-hidden />
          <span className="burger-line burger-line--bot" aria-hidden />
        </button>

        <div id={PANEL_ID} className={`nav-panel ${isOpen ? 'is-open' : ''}`}>
          <div className="nav-panel__glow" aria-hidden />

          <nav className="nav-panel__body" aria-label={nav.panelLabel}>
            <p className="nav-panel__title">{nav.sectionsTitle}</p>

            <ul className="nav-panel__list">
              {nav.items.map((item, index) => {
                const Icon = item.icon;
                const active = isActiveHref(pathname, item.href);

                return (
                  <li
                    key={item.href}
                    className={`nav-reveal ${isOpen ? 'is-shown' : ''}`}
                    style={{ transitionDelay: isOpen ? revealDelay(index) : '0ms' }}
                  >
                    <Link
                      href={item.href}
                      className={`nav-item ${active ? 'is-active' : ''}`}
                      aria-current={active ? 'page' : undefined}
                      onClick={closeAndRefocus}
                    >
                      <Icon className="nav-item__icon" aria-hidden />
                      <span className="nav-item__text">
                        <span className="nav-item__label">{item.label}</span>
                        <span className="nav-item__hint">{item.hint}</span>
                      </span>
                      <HiArrowNarrowRight className="nav-item__arrow" aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div
            className={`nav-reveal nav-rule ${isOpen ? 'is-shown' : ''}`}
            style={{ transitionDelay: isOpen ? revealDelay(nav.items.length) : '0ms' }}
            aria-hidden
          />

          <div className="nav-panel__body">
            <p className="nav-panel__title">{nav.accountTitle}</p>

            <ul className="nav-panel__list">
              {nav.account.map((item, index) => {
                const Icon = item.icon;
                const active = isActiveHref(pathname, item.href);

                return (
                  <li
                    key={item.href}
                    className={`nav-reveal ${isOpen ? 'is-shown' : ''}`}
                    style={{
                      transitionDelay: isOpen
                        ? revealDelay(nav.items.length + 1 + index)
                        : '0ms',
                    }}
                  >
                    <Link
                      href={item.href}
                      className={`nav-item ${active ? 'is-active' : ''}`}
                      aria-current={active ? 'page' : undefined}
                      onClick={closeAndRefocus}
                    >
                      <Icon className="nav-item__icon" aria-hidden />
                      <span className="nav-item__text">
                        <span className="nav-item__label">{item.label}</span>
                        <span className="nav-item__hint">{item.hint}</span>
                      </span>
                      <HiArrowNarrowRight className="nav-item__arrow" aria-hidden />
                    </Link>
                  </li>
                );
              })}

              <li
                className={`nav-reveal ${isOpen ? 'is-shown' : ''}`}
                style={{
                  transitionDelay: isOpen
                    ? revealDelay(nav.items.length + 1 + nav.account.length)
                    : '0ms',
                }}
              >
                <button
                  type="button"
                  className="nav-item admin-nav-logout"
                  onClick={() => {
                    setIsOpen(false);
                    onLogout?.();
                  }}
                >
                  <LogoutIcon className="nav-item__icon" aria-hidden />
                  <span className="nav-item__text">
                    <span className="nav-item__label">{nav.logout.label}</span>
                    <span className="nav-item__hint">{nav.logout.hint}</span>
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
