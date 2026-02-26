import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CustomerDetail } from './pages/CustomerDetail';
import { CustomerList } from './pages/CustomerList';
import { Dashboard } from './pages/Dashboard';
// import { EngagementLogs } from './pages/EngagementLogs';
import { PerformanceAppraisal } from './pages/PerformanceAppraisal';
import { LifecycleManagement } from './pages/LifecycleManagement';
import { TieringStrategy } from './pages/TieringStrategy';
import { PlaceholderPage } from './pages/Placeholder';
import { SystemSettings } from './pages/SystemSettings';
import { CustomerPortal } from './pages/CustomerPortal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/portal-preview/:id" element={<CustomerPortal />} />
        
        <Route path="*" element={
          <Layout>
            <Routes>
              {/* Level 1: Cockpit */}
              <Route path="/" element={<Dashboard />} />
          
          {/* Level 2: Resource Hub */}
          <Route path="/customer-profile" element={<CustomerList />} />
          <Route path="/customer-profile/:id" element={<CustomerDetail />} />
          <Route path="/resources/assets" element={<PlaceholderPage />} />
          <Route path="/resources/leads" element={<PlaceholderPage />} />
          
          {/* Level 3: Relations (Moved to SupplierDetail) */}
          {/* <Route path="/relations/logs" element={<EngagementLogs />} /> */}
          {/* <Route path="/relations/contracts" element={<PlaceholderPage />} /> */}
          {/* <Route path="/relations/ops-dna" element={<PlaceholderPage />} /> */}
          
          {/* Level 4: Performance */}
          <Route path="/performance/lifecycle" element={<LifecycleManagement />} />
          <Route path="/performance/appraisal" element={<PerformanceAppraisal />} />
          <Route path="/performance/tiering" element={<TieringStrategy />} />
          
          {/* Level 5: Win-Win Portal */}
          <Route path="/portal/broadcast" element={<PlaceholderPage />} />
          <Route path="/portal/empowerment" element={<PlaceholderPage />} />
          <Route path="/portal/tickets" element={<PlaceholderPage />} />
          
          {/* Level 6: Settings */}
          <Route path="/settings" element={<SystemSettings />} />

          {/* Level 7: Support */}
          <Route path="/support/odc-audit" element={<PlaceholderPage title="ODC 审计 (ODC Audit)" />} />

          {/* Fallback */}
          <Route path="*" element={<div className="text-center py-20 text-slate-400">404: Page Not Found</div>} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
