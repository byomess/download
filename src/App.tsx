import { ReactElement, useEffect, useState } from 'react'

import { MOCK_DATA, Transaction, getTransactions } from './api';

const PAGE_SIZE = 1;

function Pagination({ totalPages, currentPage, setCurrentPage }) {
  return (
    <div>
      {Array.from({ length: totalPages }, (_, index) => (
        <button 
          key={index} 
          onClick={() => setCurrentPage(index + 1)}
          style={{ fontWeight: currentPage === index + 1 ? 'bold' : 'normal' }}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}

type TransactionComponentProps = {
  transaction: Transaction;
};

function TransactionComponent({ transaction }: TransactionComponentProps) {
  const formatedDate = new Date(transaction.date).toDateString()

  return (
    <div>
      <div>{transaction.description}</div>
      <div>{formatedDate}</div>
      <div>$ {transaction.amount}</div>
      <br />
    </div>
  );
}

function dateObjToValue(date: Date) {
  return date.toISOString().split('T')[0]
}

function DateFilterComponent({ dateFrom, dateTo, setDateFrom, setDateTo }) {
  return (
    <div>
      <input type="date" onChange={e => setDateFrom(new Date(e.target.value))} value={dateObjToValue(dateFrom)} />
      <input type="date" onChange={e => setDateTo(new Date(e.target.value))} value={dateObjToValue(dateTo)} />
    </div>
  )
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [dateFromValue, setDateFromValue] = useState<Date>(new Date());
  const [dateToValue, setDateToValue] = useState<Date>(new Date());

  useEffect(() => {
    (async () => {
      const payload = {
        endDate: new Date(),
        currentPage,
        sizePage: PAGE_SIZE,
      }

      try {
        const res = await getTransactions(payload);
        setTransactions(res.items);
        setTotalPages(res.totalPages);

      } catch (error: unknown) {
        alert('Error on fetching transactions')
      }
    })()
  }, []);

  return (
    <div>
      Transactions
      {transactions?.map(txn => (
          <TransactionComponent key={txn.id} transaction={txn} />
      ))}
      <DateFilterComponent dateFrom={dateFromValue} dateTo={dateToValue} setDateFrom={setDateFromValue} setDateTo={setDateToValue} />
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
    </div>
  )
}

export default App
