import { NavLink } from "react-router-dom";
import { SITE_NAME } from "../lib/pageMeta.js";

const LINKS = [
  { to: "/about", label: "About M" },
  { to: "/restaurants", label: "Restaurant" },
  { to: "/gifts", label: "Gift" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav className="site-footer-nav" aria-label="サイト内リンク">
        {LINKS.map((link, index) => (
          <span key={link.to} className="site-footer-item">
            {index > 0 ? (
              <span className="site-footer-sep" aria-hidden="true">
                ｜
              </span>
            ) : null}
            <NavLink
              to={link.to}
              className={({ isActive }) => (isActive ? "site-footer-link is-active" : "site-footer-link")}
            >
              {link.label}
            </NavLink>
          </span>
        ))}
      </nav>
      <p className="site-footer-copy">© 2026 {SITE_NAME}. All Rights Reserved.</p>
    </footer>
  );
}
