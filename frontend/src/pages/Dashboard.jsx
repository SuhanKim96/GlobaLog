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

    if (loading) return <div className="app-container">데이터를 불러오는 중입니다...</div>;

    return (
        <>
            <div className="dashboard-header">
                <h2>내 통장 목록</h2>
                <button className="add-wallet-btn" onClick={() => setShowModal(true)}>
                    + 새 통장 추가
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>새 통장 만들기</h3>
                        <form onSubmit={handleCreateWallet}>
                            <div className="input-group" style={{ flexDirection: 'column' }}>
                                <input
                                    type="text"
                                    placeholder="통장 이름"
                                    value={newWalletName}
                                    onChange={(e) => setNewWalletName(e.target.value)}
                                    style={{ marginBottom: '10px' }}
                                />
                                <select
                                    value={newWalletCurrency}
                                    onChange={(e) => setNewWalletCurrency(e.target.value)}
                                    style={{ marginBottom: '20px' }}
                                >
                                    <option value="USD">기준 통화: USD ($)</option>
                                    <option value="KRW">기준 통화: KRW (₩)</option>
                                    <option value="SGD">기준 통화: SGD ($)</option>
                                    <option value="EUR">기준 통화: EUR (€)</option>
                                    <option value="HKD">기준 통화: HKD ($)</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>취소</button>
                                <button type="submit" className="submit-btn">만들기</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {wallets.length === 0 ? (
                <div className="empty-state">
                    <p>아직 만들어진 통장이 없습니다.</p>
                    <p>오른쪽 위 버튼을 눌러 첫 통장을 추가해 보세요!</p>
                </div>
            ) : (
                wallets.map((wallet) => (
                    <div key={wallet.id} className="wallet-card" onClick={() => navigate(`/wallet/${wallet.id}`)}>
                        <div className="wallet-info">
                            <h3>{wallet.name || `통장 #${wallet.id}`}</h3>
                            <p>기준 통화: {wallet.currency}</p>
                        </div>
                        <div className="wallet-balance">
              <span className="amount">
                {wallet.balance ? wallet.balance.toLocaleString() : 0}
              </span>
                            <span className="currency">{wallet.currency}</span>
                        </div>
                    </div>
                ))
            )}
        </>
    );
}

export default Dashboard;