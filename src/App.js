import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Box, Toolbar } from '@mui/material';
import theme from './theme/theme';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import PatientSearch from './pages/PatientSearch';
import PatientRecord from './pages/PatientRecord';
import MPIMerge from './pages/MPIMerge';
import Scheduling from './pages/Scheduling';
import ComplianceAudit from './pages/ComplianceAudit';
import NotFound from './pages/NotFound';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Toolbar />
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar open={sidebarOpen} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
            }}
          >
            <Box sx={{ flex: 1, p: 3 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/search" element={<PatientSearch />} />
                <Route path="/patient/:id" element={<PatientRecord />} />
                <Route path="/merge" element={<MPIMerge />} />
                <Route path="/scheduling" element={<Scheduling />} />
                <Route path="/compliance" element={<ComplianceAudit />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;