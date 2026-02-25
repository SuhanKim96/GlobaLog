import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';

function WalletDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    //Temporary hard coding
    const EXCHANGE_RATE_SGD_TO_KRW = 1129.0;

    const [walletInfo, setWalletInfo] = useState({
        id: id,
        name: id === '1' ? '✈️ 홍콩/한국 여행' : '🇸🇬 싱가포르 생활비',
        baseCurrency: id === '1' ? 'KRW' : 'SGD',
        balance: id === '1' ? 1250000 : 450.50,
    });

    const [transactions, setTransactions] = useState(
        id === '1'
            ? [
                { id: 101, type: 'expense', title: '딤섬', amount: 300, currency: 'HKD', date: '2025-12-25' },
            ]
            : [
                { id: 200, type: 'income', title: '친구의 송금', amount: 100, currency: 'SGD', date: '2026-02-18' },
                { id: 201, type: 'expense', title: 'MRT 교통카드 충전', amount: 20, currency: 'SGD', date: '2026-02-20' },
                { id: 202, type: 'expense', title: '호커센터 점심', amount: 6.5, currency: 'SGD', date: '2026-02-25' }
            ]
    );

    const handleAddExpense = (newTx) => {
        setTransactions([newTx, ...transactions]);

        if (newTx.currency === walletInfo.baseCurrency) {
            setWalletInfo(prev => ({
                ...prev,
                balance: newTx.type === 'income'
                    ? prev.balance + newTx.amount
                    : prev.balance - newTx.amount
            }));
        }
    };

    const convertedToKrw = walletInfo.baseCurrency === 'SGD'
        ? walletInfo.balance * EXCHANGE_RATE_SGD_TO_KRW
        : walletInfo.balance;

    return (
        <div className="wallet-detail-container">
            <button className="back-btn" onClick={() => navigate(-1)}>← 목록으로 돌아가기</button>

            <div className="wallet-header">
                <h2>{walletInfo.name}</h2>
                <div className="balance-box">
                    <p>남은 예산</p>
                    <h3>{walletInfo.balance.toLocaleString()} {walletInfo.baseCurrency}</h3>
                    {walletInfo.baseCurrency !== 'KRW' && (
                        <p className="krw-converted">≈ 약 {Math.round(convertedToKrw).toLocaleString()} 원</p>
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
                {transactions.length === 0 ? (
                    <p>아직 거래 내역이 없습니다.</p>
                ) : (
                    <ul>
                        {transactions.map((tx) => (
                            <li key={tx.id}>
                                <span>{tx.date}</span>
                                <strong>
                                    {tx.type === 'income' ? '입금: ' : ''}{tx.title}
                                </strong>
                                {/* 수입은 파란색(+), 지출은 기본색(-)으로 표시 */}
                                <span style={{ color: tx.type === 'income' ? '#2563eb' : '#111827', fontWeight: 'bold' }}>
                  {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()} {tx.currency}
                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

export default WalletDetail;