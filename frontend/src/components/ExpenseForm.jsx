import { useState } from 'react';

function ExpenseForm({ onAddExpense }) {
    const [type, setType] = useState('WITHDRAWAL');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description || !amount || !transactionDate) return alert('모든 필드를 입력해주세요!');

        onAddExpense({
            type: type,
            amount: parseFloat(amount),
            description: description,
            transactionCurrency: currency,
            transactionDate: `${transactionDate}T00:00:00`
        });

        setDescription('');
        setAmount('');
    };

    return (
        <form onSubmit={handleSubmit} className="expense-form">
            <div className="type-toggle">
                <button type="button" className={type === 'WITHDRAWAL' ? 'active expense-btn' : ''} onClick={() => setType('WITHDRAWAL')}>지출</button>
                <button type="button" className={type === 'DEPOSIT' ? 'active income-btn' : ''} onClick={() => setType('DEPOSIT')}>수입/입금</button>
            </div>

            <div className="input-group">
                <input
                    type="date"
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    required
                />
                <input type="text" placeholder="항목 (예: 식비, 월급)" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="number" placeholder="금액" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="USD">USD ($)</option>
                    <option value="SGD">SGD ($)</option>
                    <option value="KRW">KRW (₩)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="HKD">HKD ($)</option>
                </select>
                <button type="submit">추가</button>
            </div>
        </form>
    );
}

export default ExpenseForm;