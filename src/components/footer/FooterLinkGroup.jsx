"use client";

import { Link } from "react-scroll";

const FooterLinkGroup = ({ title, links, isSocial }) => {
  return (
    <div className={isSocial ? "follow-group" : "info-group"}>
      <h3>{title}</h3>
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            {isSocial ? (
              <a href={link.href} target="_blank">
                <link.icon />
              </a>
            ) : (
              <Link to={link.href} smooth={true} duration={100}>
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterLinkGroup;
