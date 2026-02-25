import { useState } from 'react';

function ExpenseForm({ onAddExpense }) {
    const [type, setType] = useState('expense');
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('SGD');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !amount) return alert('모든 필드를 입력해주세요!');

        onAddExpense({
            id: Date.now(),
            type,
            title,
            amount: parseFloat(amount),
            currency,
            date
        });

        setTitle('');
        setAmount('');
    };

    return (
        <form onSubmit={handleSubmit} className="expense-form">
            <div className="type-toggle">
                <button
                    type="button"
                    className={type === 'expense' ? 'active expense-btn' : ''}
                    onClick={() => setType('expense')}
                >지출</button>
                <button
                    type="button"
                    className={type === 'income' ? 'active income-btn' : ''}
                    onClick={() => setType('income')}
                >입금</button>
            </div>

            <div className="input-group">
                <input type="text" placeholder="항목 (예: 용돈, 커피)" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input type="number" placeholder="금액" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="SGD">SGD ($)</option>
                    <option value="KRW">KRW (₩)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                </select>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <button type="submit">추가</button>
            </div>
        </form>
    );
}

export default ExpenseForm;