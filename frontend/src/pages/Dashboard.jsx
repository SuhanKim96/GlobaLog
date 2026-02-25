import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();

    return (
        <>
            <div className="dashboard-header">
                <h2>내 통장 목록</h2>
                <button className="add-wallet-btn">+ 새 통장 추가</button>
            </div>

            <div className="wallet-card" onClick={() => navigate('/wallet/1')}>
                <div className="wallet-info">
                    <h3>✈️ 홍콩/한국 여행</h3>
                    <p>기준 통화: KRW (₩)</p>
                </div>
                <div className="wallet-balance">
                    <span className="amount">1,250,000</span>
                    <span className="currency">KRW</span>
                </div>
            </div>

            <div className="wallet-card" onClick={() => navigate('/wallet/2')}>
                <div className="wallet-info">
                    <h3>🇸🇬 싱가포르 생활비</h3>
                    <p>기준 통화: SGD ($)</p>
                </div>
                <div className="wallet-balance">
                    <span className="amount">450.50</span>
                    <span className="currency">SGD</span>
                </div>
            </div>
        </>
    );
}

export default Dashboard;