import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';

function WalletDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [walletInfo, setWalletInfo] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTxData),
            });

            if (response.ok) {
                const savedTx = await response.json();
                setTransactions((prev) => [savedTx, ...prev]);
                const walletRes = await fetch(`/api/wallets/${id}`);
                if (walletRes.ok) setWalletInfo(await walletRes.json());
            } else {
                alert('저장에 실패했습니다. 입력값을 확인해주세요.');
            }
        } catch (error) {
            console.error('저장 중 서버 통신 에러:', error);
        }
    };

    const handleDeleteWallet = async () => {
        try {
            const response = await fetch(`/api/wallets/${id}`, { method: 'DELETE' });
            if (response.ok) {
                navigate('/');
            } else {
                setShowDeleteModal(false);
                alert('삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('삭제 중 서버 통신 에러:', error);
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
        </div>
    );

    if (!walletInfo) return (
        <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--danger-color)', fontWeight: 600 }}>
            지갑 정보를 찾을 수 없습니다.
        </div>
    );

    return (
        <div className="wallet-detail-container">
            <div className="top-actions">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    대시보드로 돌아가기
                </button>
                <button className="btn-danger" onClick={() => setShowDeleteModal(true)}>
                    통장 삭제
                </button>
            </div>

            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>통장 삭제</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '0.5rem' }}>
                            <strong>{walletInfo.name}</strong> 통장과 모든 거래 내역이 영구적으로 삭제됩니다.
                            이 작업은 되돌릴 수 없습니다.
                        </p>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>취소</button>
                            <button className="btn-danger" onClick={handleDeleteWallet}>삭제 확인</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="hero-balance-section">
                <div className="wallet-meta">
                    <h2>{walletInfo.name || `통장 #${walletInfo.id}`}</h2>
                    <span className="currency-badge">기준 통화: {walletInfo.currency}</span>
                </div>

                <div className="main-balance">
                    <p className="balance-label">Current Balance</p>
                    <h3>
                        {walletInfo.balance
                            ? walletInfo.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })
                            : '0.00'}
                        {' '}
                        <span>{walletInfo.currency}</span>
                    </h3>

                    {Number(walletInfo.averageExchangeRate) > 0 && (
                        <div className="krw-conversion-box">
                            <p className="krw-total">
                                ₩ {Math.round(walletInfo.balance / walletInfo.averageExchangeRate).toLocaleString()}
                            </p>
                            <p className="krw-converted">
                                적용 환율: 1 {walletInfo.currency} ={' '}
                                {(1 / walletInfo.averageExchangeRate).toLocaleString(undefined, { maximumFractionDigits: 2 })} ₩
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <section>
                <h3 className="section-title">새 거래 기록</h3>
                <ExpenseForm onAddExpense={handleAddExpense} />
            </section>

            <section>
                <h3 className="section-title">최근 거래 내역</h3>
                <div className="transaction-card">
                    <ul className="transaction-list">
                        {transactions.length === 0 ? (
                            <li className="empty-state" style={{ border: 'none', padding: '3rem 1rem' }}>
                                <svg width="56" height="56" style={{ margin: '0 auto 1rem', color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <p style={{ margin: 0 }}>아직 거래 내역이 없습니다.</p>
                            </li>
                        ) : (
                            transactions.map((tx) => {
                                const isDeposit = tx.type === 'DEPOSIT';
                                const showRate = tx.exchangeRate && tx.currency && tx.currency !== walletInfo.currency;
                                const convertedAmt = showRate
                                    ? (tx.amount * tx.exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 2 })
                                    : null;

                                return (
                                    <li key={tx.id} className="transaction-item">
                                        <div className="tx-info">
                                            <div className={`tx-icon ${isDeposit ? 'income' : 'expense'}`}>
                                                {isDeposit ? (
                                                    /* Arrow down-left: money received */
                                                    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3l18 18M3 21V8m0 13h13"></path>
                                                    </svg>
                                                ) : (
                                                    /* Arrow up-right: money sent out */
                                                    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 3L3 21M21 3H8m13 0v13"></path>
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="tx-details">
                                                <span className="tx-desc">
                                                    {tx.description || (isDeposit ? '입금' : '지출')}
                                                </span>
                                                <span className="tx-date">
                                                    {tx.transactionDate ? tx.transactionDate.split('T')[0] : ''}
                                                    {tx.currency && tx.currency !== walletInfo.currency && (
                                                        <span className="tx-sub"> · {tx.currency} → {walletInfo.currency}</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="tx-amount-block">
                                            <span className={`tx-amount ${isDeposit ? 'income' : 'expense'}`}>
                                                {isDeposit ? '+' : '−'}{' '}
                                                {tx.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {tx.currency}
                                            </span>
                                            {showRate && (
                                                <span className="tx-converted">
                                                    = {convertedAmt} {walletInfo.currency}
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default WalletDetail;
