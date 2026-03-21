import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();

    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [newWalletName, setNewWalletName] = useState('');
    const [newWalletCurrency, setNewWalletCurrency] = useState('USD');

    useEffect(() => {
        fetchWallets();
    }, []);

    const fetchWallets = async () => {
        try {
            const response = await fetch('/api/wallets');
            if (response.ok) {
                const data = await response.json();
                setWallets(data);
            } else {
                console.error('지갑 목록을 불러오지 못했습니다.');
            }
        } catch (error) {
            console.error('서버 통신 에러:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWallet = async (e) => {
        e.preventDefault();
        if (!newWalletName) return alert('통장 이름을 입력해주세요!');

        try {
            const response = await fetch('/api/wallets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newWalletName,
                    currency: newWalletCurrency
                })
            });

            if (response.ok) {
                setShowModal(false);
                setNewWalletName('');
                setNewWalletCurrency('USD');
                fetchWallets();
            } else {
                alert('통장 생성에 실패했습니다.');
            }
        } catch (error) {
            console.error('생성 중 서버 에러:', error);
        }
    };

    if (loading) return <div className="app-container" style={{textAlign: 'center', marginTop: '4rem', color: 'var(--gray-500)'}}>데이터를 불러오는 중입니다...</div>;

    return (
        <>
            <div className="dashboard-header">
                <h2>내 통장 목록</h2>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    새 통장 추가
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>새 통장 만들기</h3>
                        <form onSubmit={handleCreateWallet}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="통장 이름 (예: 미국 여행 경비)"
                                    value={newWalletName}
                                    onChange={(e) => setNewWalletName(e.target.value)}
                                    autoFocus
                                />
                                <select
                                    className="input-field"
                                    value={newWalletCurrency}
                                    onChange={(e) => setNewWalletCurrency(e.target.value)}
                                >
                                    <option value="USD">기준 통화: USD ($)</option>
                                    <option value="KRW">기준 통화: KRW (₩)</option>
                                    <option value="SGD">기준 통화: SGD ($)</option>
                                    <option value="EUR">기준 통화: EUR (€)</option>
                                    <option value="HKD">기준 통화: HKD ($)</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>취소</button>
                                <button type="submit" className="btn-primary">만들기</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {wallets.length === 0 ? (
                <div className="empty-state">
                    <svg width="64" height="64" style={{margin: '0 auto 1rem', color: 'var(--gray-400)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                    <h4>아직 만들어진 통장이 없습니다.</h4>
                    <p>우측 상단의 버튼을 눌러 첫 통장을 추가해 보세요!</p>
                    <button className="btn-primary" onClick={() => setShowModal(true)}>
                        첫 통장 만들기
                    </button>
                </div>
            ) : (
                <div className="wallets-grid">
                    {wallets.map((wallet) => (
                        <div key={wallet.id} className="wallet-card" onClick={() => navigate(`/wallet/${wallet.id}`)}>
                            <div className="wallet-info">
                                <h3>{wallet.name || `통장 #${wallet.id}`}</h3>
                                <span className="wallet-currency-badge">{wallet.currency}</span>
                            </div>
                            <div className="wallet-balance">
                                <span className="amount">
                                    {wallet.balance ? wallet.balance.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 0}
                                </span>
                                <span className="currency">{wallet.currency}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default Dashboard;