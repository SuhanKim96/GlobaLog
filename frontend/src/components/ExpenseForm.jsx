import { useState } from 'react';

function ExpenseForm({ onAddExpense }) {
    const [type, setType] = useState('WITHDRAWAL');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description || !amount || !transactionDate) {
            setError('모든 필드를 입력해주세요.');
            return;
        }
        if (Number(amount) <= 0) {
            setError('금액은 0보다 커야 합니다.');
            return;
        }
        setError('');

        onAddExpense({
            type,
            amount: parseFloat(amount),
            description,
            transactionCurrency: currency,
            transactionDate: `${transactionDate}T00:00:00`
        });

        setDescription('');
        setAmount('');
    };

    return (
        <div className="expense-form-card">
            <form onSubmit={handleSubmit}>
                <div className="type-toggle">
                    <button
                        type="button"
                        className={type === 'WITHDRAWAL' ? 'active expense-btn' : ''}
                        onClick={() => setType('WITHDRAWAL')}
                    >
                        지출 (Expense)
                    </button>
                    <button
                        type="button"
                        className={type === 'DEPOSIT' ? 'active income-btn' : ''}
                        onClick={() => setType('DEPOSIT')}
                    >
                        수입 (Income)
                    </button>
                </div>

                {error && <p className="form-error">{error}</p>}

                <div className="form-grid">
                    <div className="input-wrapper">
                        <label>날짜</label>
                        <input
                            type="date"
                            className="input-field"
                            value={transactionDate}
                            onChange={(e) => setTransactionDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-wrapper">
                        <label>내역</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="예: 스타벅스, 월급"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="input-wrapper">
                        <label>금액</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="0.00"
                            min="0"
                            step="any"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="input-wrapper">
                        <label>통화</label>
                        <select
                            className="input-field"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <option value="USD">USD ($)</option>
                            <option value="SGD">SGD ($)</option>
                            <option value="KRW">KRW (₩)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="HKD">HKD ($)</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary" style={{ height: '3rem', padding: '0 2rem' }}>
                        추가
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ExpenseForm;
