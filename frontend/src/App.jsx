import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import WalletDetail from './pages/WalletDetail';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <header>
                    <h1>GlobaLog 🌍</h1>
                    <p>Your Borderless Expense Tracker</p>
                </header>

                <main>
                    {}
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