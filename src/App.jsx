import {useState, useEffect} from "react";
import "./App.css";

function App() {
  //支出一覧
  const [expenses,setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  //入力フォーム
  const [title,setTitle] = useState('');
  const [amount,setAmount] = useState('');
  const [date, setDate] = useState("");

  //ダークモード
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  //追加処理
  const addExpense = () => {
    if (!title||!amount||!date) return;

    const newExpense = {
      id:Date.now(),
      title:title,
      amount:Number(amount),
      date:date
    };

    setExpenses([...expenses,newExpense]);
    setTitle('');
    setAmount('');
    setDate('');
  };

  //削除処理
  const deleteExpense = (id) => {
    const newExpenses = expenses.filter((expense) => {
      return expense.id !== id;
   });

   setExpenses(newExpenses);
  };

  useEffect(() => {
    localStorage.setItem("expenses",JSON.stringify(expenses));
  },[expenses])

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const grouped = expenses.reduce((acc, expense) => {
    const month = expense.date.slice(0, 7);

    if (!acc[month]) {
      acc[month] = [];
    }

    acc[month].push(expense);

    return acc;
  }, {});

  //合計
  const total = expenses.reduce((sum,expense) => {
    return sum+expense.amount
  },0)

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <h1>家計簿アプリ</h1>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ ライト" : "🌙 ダーク"}
      </button>
      <div className="form">
        <input
          type='text'
          placeholder='項目'
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />
        <input
          type='number'
          placeholder='金額'
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={addExpense}>追加</button>
      </div>
      <h2>合計 {total} 円</h2>
      {Object.entries(grouped).map(([month, items]) => {
        const monthTotal = items.reduce((sum, expense) => {
          return sum + expense.amount;
        }, 0);
        return (
          <div key={month}>
          <h3>{month} {monthTotal}円</h3>
          <ul>
            {items.map((expense) => (
              <li key={expense.id}>
                {expense.date} {expense.title} {expense.amount}円
                <button onClick={() => deleteExpense(expense.id)}>
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>
        );      
      })}
    </div>
  );
}

export default App;