import React, { useState } from 'react';
import MediumLogo from './MediumLogo';
import { SearchIcon, WriteIcon, NotificationIcon } from './Icons';

const Header = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__left">
          <a href="/" className="header__logo">
            <MediumLogo />
          </a>
          <div className="header__search">
            <span className="header__search-icon">
              <SearchIcon size={18} />
            </span>
            <input
              type="text"
              className="header__search-input"
              placeholder="Search"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        <div className="header__right">
          <a href="/write" className="header__write">
            <WriteIcon size={24} />
            <span>Write</span>
          </a>
          <button className="header__write" aria-label="Notifications">
            <NotificationIcon size={24} />
          </button>
          <a href="/sign-in" className="header__sign-in">
            Sign in
          </a>
          <a href="/get-started" className="header__get-started">
            Get started
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
