import React from 'react';
import { Link } from 'react-router-dom';
import { BookmarkIcon, MoreIcon, ResponseIcon } from './Icons';

const ArticleCard = ({ article }) => {
  return (
    <Link to={`/article/${article.id}`} className="article-card-link">
      <article className="article-card">
        <div className="article-card__body">
          <div className="article-card__meta">
            <div
              className="article-card__avatar"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 600,
                color: '#fff',
                background: getAvatarColor(article.author),
              }}
            >
              {article.avatar}
            </div>
            <span className="article-card__author">{article.author}</span>
            <span className="article-card__dot">·</span>
            <span className="article-card__date">{article.date}</span>
          </div>

          <h2 className="article-card__title">{article.title}</h2>
          <p className="article-card__subtitle">{article.subtitle}</p>

          <div className="article-card__footer">
            <div className="article-card__tags">
              {article.isMember && (
                <span className="article-card__tag--member">★ Member-only</span>
              )}
              <span className="article-card__tag">{article.tag}</span>
              <span style={{ fontSize: '13px', color: '#6b6b6b' }}>
                {article.readTime}
              </span>
            </div>

            <div className="article-card__actions" onClick={(e) => e.preventDefault()}>
              <button className="article-card__action" title="Save">
                <BookmarkIcon size={16} />
              </button>
              <button className="article-card__action" title="Listen">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
              <button className="article-card__action" title="More">
                <MoreIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {article.hasImage && (
          <img
            src={article.imageUrl}
            alt=""
            className="article-card__image"
            loading="lazy"
          />
        )}
      </article>
    </Link>
  );
};

// Generate consistent colors for avatars
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

export default ArticleCard;
