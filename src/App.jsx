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

  //ダークモード
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  //追加処理
  const addExpense = () => {
    if (!title||!amount) return;

    const newExpense = {
      id:Date.now(),
      title:title,
      amount:Number(amount)
    };

    setExpenses([...expenses,newExpense]);
    setTitle('');
    setAmount('');
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
        <button onClick={addExpense}>追加</button>
      </div>
      <h2>合計 {total} 円</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.title} {expense.amount}円
            <button onClick={() => deleteExpense(expense.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;