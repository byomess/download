import { ReactElement, useEffect, useState } from 'react'

import { MOCK_DATA, Transaction, getTransactions, simulatePromise } from './api';



function Pagination({ totalPages, currentPage, setCurrentPage }) {
  return (
    <div>
      {new Array(totalPages).map((value, index) => {})}
    </div>
  );
}

interface TransactionComponentProps extends ReactElement {
  transaction: Transaction;
}

function TransactionComponent({ transaction }: TransactionComponentProps) {
  const formatedDate = new Date(transaction.date).toDateString()


  return (
    <div>
      <span>{transaction.description}</span>
      <span>{formatedDate}</span>
      <span>$ {transaction.amount}</span>
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

const SIZE_PAGE = 5;

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
        sizePage: SIZE_PAGE,
      }

      try {
        const res = await getTransactions(payload);
        setTransactions(res.items);
        setTotalPages(res.totalPages);

      } catch (error) {
        alert('Error on fetching transactions')
      }
    })()
  }, []);

  return (
    <div>
      Transactions
      {transactions?.map(txn => (
          <TransactionComponent index={txn.id} transaction={txn} />
      ))}
      <DateFilterComponent dateFrom={dateFromValue} dateTo={dateToValue} setDateFrom={setDateFromValue} setDateTo={setDateToValue} />
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
    </div>
  )
}

export default App
