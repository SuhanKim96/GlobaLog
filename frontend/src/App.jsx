import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import WalletDetail from './pages/WalletDetail';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <nav className="navbar">
                <Link to="/" className="navbar-brand">
                    <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                    </svg>
                    GlobaLog
                </Link>
                <span className="navbar-tagline">Borderless Expense Tracker</span>
            </nav>
            <div className="app-container">
                <main>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/wallet/:id" element={<WalletDetail />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;