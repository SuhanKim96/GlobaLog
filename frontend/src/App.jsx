import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import WalletDetail from './pages/WalletDetail';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <header>
                    <h1>
                        <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                        </svg>
                        GlobaLog
                    </h1>
                    <p>Your Borderless Expense Tracker</p>
                </header>

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