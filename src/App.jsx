import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import StampsPage from './pages/StampsPage';
import MarketplacePage from './pages/MarketplacePage';
import CommunityPage from './pages/CommunityPage';
import CollectionPage from './pages/CollectionPage';
import PdaPage from './pages/PdaPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WishlistPage from './pages/WishlistPage';
import MarketplaceListingDetailPage from './pages/MarketplaceListingDetailPage';
import CollectorDashboardPage from './pages/CollectorDashboardPage';
import CollectionGapAnalyzerPage from './pages/CollectionGapAnalyzerPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="stamps" element={<StampsPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="marketplace/listing/:id" element={<MarketplaceListingDetailPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="collection" element={<CollectionPage />} />
          <Route path="collection/gap-analyzer" element={<CollectionGapAnalyzerPage />} />
          <Route path="gap-analyzer" element={<CollectionGapAnalyzerPage />} />
          <Route path="dashboard" element={<CollectorDashboardPage />} />
          <Route path="pda" element={<PdaPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
