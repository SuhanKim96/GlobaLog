import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';

function WalletDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [walletInfo, setWalletInfo] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const [walletRes, txRes] = await Promise.all([
                    fetch(`/api/wallets/${id}`),
                    fetch(`/api/wallets/${id}/transactions`)
                ]);

                if (walletRes.ok && txRes.ok) {
                    const walletData = await walletRes.json();
                    const txData = await txRes.json();

                    setWalletInfo(walletData);
                    setTransactions(txData);
                } else {
                    console.error('데이터를 불러오는데 실패했습니다.');
                }
            } catch (error) {
                console.error('서버 통신 에러:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWalletData();
    }, [id]);

    const handleAddExpense = async (newTxData) => {
        try {
            const response = await fetch(`/api/wallets/${id}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTxData),
            });

            if (response.ok) {
                const savedTx = await response.json();

                setTransactions((prev) => [savedTx, ...prev]);

                const walletRes = await fetch(`/api/wallets/${id}`);
                if (walletRes.ok) {
                    setWalletInfo(await walletRes.json());
                }
            } else {
                alert('저장에 실패했습니다. 입력값을 확인해주세요.');
            }
        } catch (error) {
            console.error('저장 중 서버 통신 에러:', error);
        }
    };

    if (loading) return <div className="app-container">데이터를 불러오는 중입니다...</div>;
    if (!walletInfo) return <div className="app-container">지갑 정보를 찾을 수 없습니다.</div>;

    return (
        <div className="wallet-detail-container">
            <button className="back-btn" onClick={() => navigate(-1)}>← 목록으로 돌아가기</button>

            <div className="wallet-header">
                <h2>{walletInfo.name || `통장 #${walletInfo.id}`}</h2>
                <div className="balance-box">
                    <p>현재 잔액 ({walletInfo.currency || 'KRW'})</p>
                    <h3>{walletInfo.balance ? walletInfo.balance.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 0} {walletInfo.currency}</h3>
                    {Number(walletInfo.averageExchangeRate) > 0 && (
                        <>
                            <p className="krw-total" style={{ color: '#374151', fontSize: '1rem', fontWeight: 'bold', marginTop: '12px', marginBottom: '4px' }}>
                                총 원화: {Math.round(walletInfo.balance / walletInfo.averageExchangeRate).toLocaleString()} 원
                            </p>
                            <p className="krw-converted" style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0' }}>
                                적용 환율: {Number(walletInfo.averageExchangeRate) < 1
                                ? `1 ${walletInfo.currency} = ${(1 / walletInfo.averageExchangeRate).toLocaleString(undefined, { maximumFractionDigits: 2 })} 원`
                                : walletInfo.averageExchangeRate}
                            </p>
                        </>
                    )}
                </div>
            </div>

            <hr />

            <section className="input-section">
                <h3>새 거래 기록</h3>
                <ExpenseForm onAddExpense={handleAddExpense} />
            </section>

            <section className="list-section">
                <h3>최근 거래 내역</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {transactions.length === 0 ? (
                        <li style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
                            아직 거래 내역이 없습니다.
                        </li>
                    ) : (
                        transactions.map((tx) => (
                            <li
                                key={tx.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px',
                                    marginBottom: '10px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                        {tx.transactionDate ? tx.transactionDate.split('T')[0] : ''}
                    </span>
                                    <span style={{ fontSize: '1rem', color: '#374151', fontWeight: '500' }}>
                        {tx.type === 'DEPOSIT' ? '입금' : '지출'}
                                        {tx.description ? ` - ${tx.description}` : ''}
                    </span>
                                </div>

                                <div style={{
                                    color: tx.type === 'DEPOSIT' ? '#2563eb' : '#ef4444',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                }}>
                                    {tx.type === 'DEPOSIT' ? '+' : '-'}
                                    {tx.amount.toLocaleString()} {tx.currency}
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </section>
        </div>
    );
}

export default WalletDetail;