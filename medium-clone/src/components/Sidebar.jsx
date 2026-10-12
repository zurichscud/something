import React from 'react';
import {
  staffPicks,
  recommendedTopics,
  whoToFollow,
  footerLinks,
} from '../data/mockData';
import { ChevronRightIcon } from './Icons';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      {/* Staff Picks */}
      <div className="sidebar-section">
        <h3 className="sidebar-section__title">Staff Picks</h3>
        {staffPicks.map((pick) => (
          <div key={pick.id} className="staff-pick">
            <div className="staff-pick__meta">
              <div
                className="staff-pick__avatar"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 600,
                  color: '#fff',
                  background: getAvatarColor(pick.author),
                }}
              >
                {pick.avatar}
              </div>
              <span className="staff-pick__author">{pick.author}</span>
            </div>
            <h4 className="staff-pick__title">{pick.title}</h4>
          </div>
        ))}
        <a href="/staff-picks" className="sidebar__see-more">
          See the full list
          <ChevronRightIcon size={14} />
        </a>
      </div>

      {/* Recommended Topics */}
      <div className="sidebar-section">
        <h3 className="sidebar-section__title">Recommended topics</h3>
        <div className="recommended-topics">
          {recommendedTopics.map((topic) => (
            <a
              key={topic}
              href={`/topic/${topic.toLowerCase().replace(/\s+/g, '-')}`}
              className="recommended-topic"
            >
              {topic}
            </a>
          ))}
        </div>
        <a href="/topics" className="sidebar__see-more">
          See more topics
          <ChevronRightIcon size={14} />
        </a>
      </div>

      {/* Who to Follow */}
      <div className="sidebar-section">
        <h3 className="sidebar-section__title">Who to follow</h3>
        {whoToFollow.map((user) => (
          <div key={user.id} className="follow-card">
            <div
              className="follow-card__avatar"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 600,
                color: '#fff',
                background: getAvatarColor(user.name),
              }}
            >
              {user.avatar}
            </div>
            <div className="follow-card__info">
              <div className="follow-card__name">{user.name}</div>
              <div className="follow-card__desc">{user.desc}</div>
            </div>
            <button className="follow-card__btn">Follow</button>
          </div>
        ))}
        <a href="/people" className="sidebar__see-more">
          See more suggestions
          <ChevronRightIcon size={14} />
        </a>
      </div>

      {/* Reading List */}
      <div className="sidebar-section">
        <h3 className="sidebar-section__title">Reading list</h3>
        <p className="reading-list__hint">
          Click the <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginTop: -2 }}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg> on any story to easily add it to your reading list or a custom list that you can share.
        </p>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer__links">
          {footerLinks.map((link) => (
            <a
              key={link}
              href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="sidebar-footer__link"
            >
              {link}
            </a>
          ))}
        </div>
        <div className="sidebar-footer__copyright">
          © 2024 Medium Clone
        </div>
      </div>
    </aside>
  );
};

function getAvatarColor(name) {
  const colors = [
    '#1a8917', '#e63946', '#457b9d', '#6d597a',
    '#b56576', '#355070', '#e56b6f', '#0077b6',
    '#588157', '#bc6c25', '#606c38', '#2a9d8f',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default Sidebar;
