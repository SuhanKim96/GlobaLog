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

    const handleDeleteWallet = async () => {
        if (!window.confirm("정말로 이 통장과 모든 거래 내역을 삭제하시겠습니까?")) return;
        
        try {
            const response = await fetch(`/api/wallets/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert("통장이 삭제되었습니다.");
                navigate('/');
            } else {
                alert("삭제에 실패했습니다.");
            }
        } catch (error) {
            console.error("삭제 중 서버 통신 에러:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    if (loading) return <div className="app-container" style={{textAlign: 'center', marginTop: '4rem', color: 'var(--gray-500)'}}>데이터를 불러오는 중입니다...</div>;
    if (!walletInfo) return <div className="app-container" style={{textAlign: 'center', marginTop: '4rem', color: 'var(--danger-500)'}}>지갑 정보를 찾을 수 없습니다.</div>;

    return (
        <div className="wallet-detail-container">
            <div className="top-actions">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    목록으로 돌아가기
                </button>
                <button className="btn-danger" onClick={handleDeleteWallet}>
                    통장 삭제
                </button>
            </div>

            <div className="wallet-header">
                <div>
                    <h2>{walletInfo.name || `통장 #${walletInfo.id}`}</h2>
                    <span className="currency-badge">기준 통화: {walletInfo.currency}</span>
                </div>
                <div className="balance-box">
                    <p className="balance-label">현재 잔액</p>
                    <h3>{walletInfo.balance ? walletInfo.balance.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 0} <span style={{fontSize:'1.5rem', opacity:0.8}}>{walletInfo.currency}</span></h3>
                    {Number(walletInfo.averageExchangeRate) > 0 && (
                        <div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)'}}>
                            <p className="krw-total">
                                ₩ {Math.round(walletInfo.balance / walletInfo.averageExchangeRate).toLocaleString()} 원
                            </p>
                            <p className="krw-converted">
                                적용 환율: {Number(walletInfo.averageExchangeRate) < 1
                                ? `1 ${walletInfo.currency} = ${(1 / walletInfo.averageExchangeRate).toLocaleString(undefined, { maximumFractionDigits: 2 })} ₩`
                                : walletInfo.averageExchangeRate}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <hr className="divider" />

            <section>
                <h3 className="section-title">새 거래 기록</h3>
                <ExpenseForm onAddExpense={handleAddExpense} />
            </section>

            <section>
                <h3 className="section-title">최근 거래 내역</h3>
                <ul className="transaction-list">
                    {transactions.length === 0 ? (
                        <li className="empty-state" style={{padding: '2rem'}}>
                            <svg width="48" height="48" style={{margin: '0 auto 1rem', color: 'var(--gray-300)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            <p style={{margin: 0}}>아직 거래 내역이 없습니다.</p>
                        </li>
                    ) : (
                        transactions.map((tx) => (
                            <li key={tx.id} className="transaction-item">
                                <div className="tx-info">
                                    <div className={`tx-icon ${tx.type === 'DEPOSIT' ? 'income' : 'expense'}`}>
                                        {tx.type === 'DEPOSIT' ? (
                                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                                        ) : (
                                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                        )}
                                    </div>
                                    <div className="tx-details">
                                        <span className="tx-desc">
                                            {tx.description || (tx.type === 'DEPOSIT' ? '입금' : '지출')}
                                        </span>
                                        <span className="tx-date">
                                            {tx.transactionDate ? tx.transactionDate.split('T')[0] : ''}
                                        </span>
                                    </div>
                                </div>
                                <div className={`tx-amount ${tx.type === 'DEPOSIT' ? 'income' : 'expense'}`}>
                                    {tx.type === 'DEPOSIT' ? '+' : '-'} {tx.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {tx.currency}
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