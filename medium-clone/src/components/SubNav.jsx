import React, { useState } from 'react';
import { subNavItems } from '../data/mockData';
import { ChevronRightIcon } from './Icons';

const SubNav = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <nav className="sub-nav">
      <div className="sub-nav__inner">
        {subNavItems.map((item, index) => (
          <a
            key={item.label}
            href={`#${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            className={`sub-nav__item ${index === activeIndex ? 'sub-nav__item--active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveIndex(index);
            }}
          >
            {item.label}
          </a>
        ))}
        <div className="sub-nav__divider" />
        <a href="/topics" className="sub-nav__item">
          <ChevronRightIcon size={16} />
        </a>
      </div>
    </nav>
  );
};

export default SubNav;
