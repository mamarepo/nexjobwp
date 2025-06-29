import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import JobSearchPage from './pages/JobSearchPage';
import JobDetailPage from './pages/JobDetailPage';
import ArticlePage from './pages/ArticlePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import BookmarkPage from './pages/BookmarkPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-inter">
        <Routes>
          {/* Admin route without header/footer */}
          <Route path="/admin" element={<AdminPage />} />
          
          {/* Regular routes with header/footer */}
          <Route path="/*" element={
            <>
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/lowongan-kerja" element={<JobSearchPage />} />
                  <Route path="/lowongan-kerja/:slug" element={<JobDetailPage />} />
                  <Route path="/artikel" element={<ArticlePage />} />
                  <Route path="/artikel/:slug" element={<ArticleDetailPage />} />
                  <Route path="/bookmark" element={<BookmarkPage />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;