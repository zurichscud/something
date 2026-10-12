import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SubNav from './components/SubNav';
import Feed from './components/Feed';
import Sidebar from './components/Sidebar';
import ArticleDetail from './components/ArticleDetail';

function HomePage() {
  return (
    <>
      <SubNav />
      <main className="main-layout">
        <Feed />
        <Sidebar />
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
