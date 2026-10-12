import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articles } from '../data/mockData';
import { BookmarkIcon, MoreIcon, ResponseIcon } from './Icons';

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

const ArticleDetail = () => {
  const { id } = useParams();
  const article = articles.find(a => a.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="article-not-found">
        <h1>Article not found</h1>
        <Link to="/">← Back to feed</Link>
      </div>
    );
  }

  // Get related articles (same tag, excluding current)
  const relatedArticles = articles
    .filter(a => a.id !== article.id && a.tag === article.tag)
    .slice(0, 3);

  return (
    <div className="article-detail">
      {/* Article Header */}
      <div className="article-detail__header">
        <div className="article-detail__header-inner">
          {/* Author Info */}
          <div className="article-detail__author-section">
            <div className="article-detail__author-info">
              <div
                className="article-detail__avatar"
                style={{ background: getAvatarColor(article.author) }}
              >
                {article.avatar}
              </div>
              <div className="article-detail__author-meta">
                <div className="article-detail__author-name">
                  {article.author}
                </div>
                <div className="article-detail__author-bio">
                  Follow · {article.readTime}
                </div>
              </div>
            </div>
            <div className="article-detail__header-actions">
              <button className="article-detail__follow-btn">Follow</button>
            </div>
          </div>

          {/* Title */}
          <h1 className="article-detail__title">{article.title}</h1>
          <h2 className="article-detail__subtitle">{article.subtitle}</h2>

          {/* Meta */}
          <div className="article-detail__meta">
            <span className="article-detail__date">{article.date}</span>
            <span className="article-detail__dot">·</span>
            <span className="article-detail__responses">
              {article.responses} responses
            </span>
            {article.isMember && (
              <>
                <span className="article-detail__dot">·</span>
                <span className="article-detail__member">★ Member-only</span>
              </>
            )}
          </div>

          {/* Action Bar */}
          <div className="article-detail__action-bar">
            <div className="article-detail__action-left">
              <button className="article-detail__action-btn" title="Clap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M11.34 1.17a1 1 0 0 1 1.32 0l6.5 5.5a1 1 0 0 1-1.32 1.5L12 3.5 6.16 8.17a1 1 0 0 1-1.32-1.5l6.5-5.5z" fill="currentColor"/>
                  <path d="M7.5 10.5a1 1 0 0 1 1.5-1.32L12 12.5l3-3.32a1 1 0 0 1 1.5 1.32l-4.5 5a1 1 0 0 1-1.5 0l-4.5-5z" fill="currentColor"/>
                </svg>
                <span>{Math.floor(Math.random() * 500) + 100}</span>
              </button>
              <button className="article-detail__action-btn" title="Response">
                <ResponseIcon size={20} />
                <span>{article.responses}</span>
              </button>
            </div>
            <div className="article-detail__action-right">
              <button className="article-detail__action-btn" title="Save">
                <BookmarkIcon size={20} />
              </button>
              <button className="article-detail__action-btn" title="Listen">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
              <button className="article-detail__action-btn" title="Share">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </button>
              <button className="article-detail__action-btn" title="More">
                <MoreIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Image */}
      {article.hasImage && (
        <div className="article-detail__image-container">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="article-detail__image"
          />
          <p className="article-detail__image-caption">
            Photo by Unsplash
          </p>
        </div>
      )}

      {/* Article Content */}
      <div className="article-detail__content">
        <div
          className="article-detail__body"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        <div className="article-detail__tags">
          <span className="article-detail__tag">{article.tag}</span>
        </div>

        {/* Bottom Action Bar */}
        <div className="article-detail__bottom-actions">
          <div className="article-detail__bottom-left">
            <button className="article-detail__action-btn" title="Clap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11.34 1.17a1 1 0 0 1 1.32 0l6.5 5.5a1 1 0 0 1-1.32 1.5L12 3.5 6.16 8.17a1 1 0 0 1-1.32-1.5l6.5-5.5z" fill="currentColor"/>
                <path d="M7.5 10.5a1 1 0 0 1 1.5-1.32L12 12.5l3-3.32a1 1 0 0 1 1.5 1.32l-4.5 5a1 1 0 0 1-1.5 0l-4.5-5z" fill="currentColor"/>
              </svg>
            </button>
            <button className="article-detail__action-btn" title="Response">
              <ResponseIcon size={20} />
            </button>
          </div>
          <div className="article-detail__bottom-right">
            <button className="article-detail__action-btn" title="Save">
              <BookmarkIcon size={20} />
            </button>
            <button className="article-detail__action-btn" title="Share">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </button>
            <button className="article-detail__action-btn" title="More">
              <MoreIcon size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Author Card */}
      <div className="article-detail__author-card">
        <div className="article-detail__author-card-inner">
          <div
            className="article-detail__author-card-avatar"
            style={{ background: getAvatarColor(article.author) }}
          >
            {article.avatar}
          </div>
          <div className="article-detail__author-card-info">
            <div className="article-detail__author-card-name">
              Written by {article.author}
            </div>
            <div className="article-detail__author-card-followers">
              {Math.floor(Math.random() * 50) + 5}K Followers
            </div>
          </div>
          <button className="article-detail__follow-btn">Follow</button>
        </div>
        <p className="article-detail__author-card-bio">
          Writing about {article.tag.toLowerCase()}, technology, and the future. Follow for more insights.
        </p>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="article-detail__related">
          <h3 className="article-detail__related-title">More from {article.tag}</h3>
          <div className="article-detail__related-grid">
            {relatedArticles.map(related => (
              <Link
                key={related.id}
                to={`/article/${related.id}`}
                className="article-detail__related-card"
              >
                <div className="article-detail__related-meta">
                  <div
                    className="article-detail__related-avatar"
                    style={{ background: getAvatarColor(related.author) }}
                  >
                    {related.avatar}
                  </div>
                  <span className="article-detail__related-author">
                    {related.author}
                  </span>
                </div>
                <h4 className="article-detail__related-card-title">
                  {related.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back to Feed */}
      <div className="article-detail__back">
        <Link to="/" className="article-detail__back-link">
          ← Back to feed
        </Link>
      </div>
    </div>
  );
};

export default ArticleDetail;
