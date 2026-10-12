import React, { useState } from 'react';
import ArticleCard from './ArticleCard';
import { articles } from '../data/mockData';

const Feed = () => {
  const [activeTab, setActiveTab] = useState('for-you');

  return (
    <div className="main-content">
      <div className="feed-tabs">
        <button
          className={`feed-tab ${activeTab === 'for-you' ? 'feed-tab--active' : ''}`}
          onClick={() => setActiveTab('for-you')}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: 6, verticalAlign: 'middle', marginTop: -2 }}
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          For you
        </button>
        <button
          className={`feed-tab ${activeTab === 'following' ? 'feed-tab--active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          Following
        </button>
      </div>

      <div className="feed-articles">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
