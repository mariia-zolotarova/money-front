import './home.scss';
import Expenses from './components/Expenses';
import Income from './components/Income';
import React, { useState } from 'react';
import {DatePicker, Row, Tabs} from 'antd';
import {gql, useQuery,  useMutation } from "@apollo/client";

const { RangePicker } = DatePicker;

const UPDATE_BALANCE_MUTATION = gql`
  mutation updateBalance($id: ID!, $data: BalanceInput!) {
    updateBalance(id: $id, data: $data) {
      data {
        id
        attributes {
          balance
        }
      }
    }
  }
`;

const CREATE_INCOME_MUTATION= gql`
    mutation createIncome($data: IncomeInput!){
      createIncome(data: $data){
        data{
          id
          attributes{
            balance
            person_Id
          }
        }
      }
    }
`;

const CREATE_EXPENSE_MUTATION= gql`
    mutation createExpense($data: ExpenseInput!){
        createExpense(data: $data){
            data{
                id
                attributes{
                    category_Id
                    person_Id
                    currency
                    amount
                    publishedAt
                }
            }
        }
    }
`;

const FETCH_BALANCE_QUERY = gql`
    query GetBalance($id: ID!) {
    balance(id: $id) {
      data {
        id
        attributes {
          balance
        }
      }
    }
  }
`;

const GET_INCOMES = gql`
    query getIncomes($pagination: PaginationArg, $filters: IncomeFiltersInput){
        incomes(pagination: $pagination, filters: $filters){
            data{
                id
                attributes{
                    balance
                    publishedAt
                }
            }
        }}
`;

const GET_EXPENSES = gql`
    query getExpenses($pagination: PaginationArg, $filters: ExpenseFiltersInput){
        expenses(pagination: $pagination, filters: $filters){
            data{
                id
                attributes{
                    category_Id
                    person_Id
                    currency
                    amount
                    publishedAt
                }
            }
        }}
`;

const getInitialStartDate = ()=>{
    const date = new Date()
    date.setUTCDate(1)
    date.setUTCHours(0, 0, 0);
    return date;
}

const getInitialEndDate = ()=>{
    const date = new Date()
    date.setUTCHours(23, 59, 59);
    return date;
}

export default function Home() {
    const [balance, setBalance] = useState(0);
    const [updateBalance] = useMutation(UPDATE_BALANCE_MUTATION);
    const [createIncome] = useMutation(CREATE_INCOME_MUTATION);
    const [createExpense] = useMutation(CREATE_EXPENSE_MUTATION);
    const [isBalanceSet, setIsBalanceSet] =  useState(false);
    const [startDateFilter, setStartDateFilter] =  useState(getInitialStartDate());
    const [endDateFilter, setEndDateFilter] =  useState(getInitialEndDate());

    const { loading: incomesLoading, error:incomesError, data : incomesData, refetch: refetchIncomeHistory} = useQuery(GET_INCOMES, {
        variables: {
            pagination: {
                pageSize: 1000
            },
            filters:{
                publishedAt:{
                    between:[
                        startDateFilter,
                        endDateFilter
                    ]
                }
            }
        }
    });

    const { loading: expensesLoading, error:expensesError, data : expensesData, refetch: refetchExpenseHistory} = useQuery(GET_EXPENSES, {
        variables: {
            pagination: {
                pageSize: 1000
            },
            filters:{
                publishedAt:{
                    between:[
                        startDateFilter,
                        endDateFilter
                    ]
                }
            }
        }
    });

    const { data: balanceData, loading: balanceLoading, error:balanceError, refetch: refetchBalance } = useQuery(FETCH_BALANCE_QUERY, {
        variables: { id: 1 } // Assume you know the user's ID
    });

    if(!balanceLoading && !balanceError && balanceData && !isBalanceSet){
        setBalance(balanceData.balance.data?.attributes?.balance ?? 0)
        setIsBalanceSet(true);
    }

    if (balanceError || incomesError || expensesError) return <p>Error :(</p>;

    const incomes = incomesData?.incomes?.data
    const expenses = expensesData?.expenses?.data

    console.log(expenses)


   const onChange = (key) => {
      console.log(key);
   };

    const addIncome = async (amount) => {
        const newBalance = balance + amount;
        setBalance(newBalance);
        await updateBalance({
            variables: {
                id: 1,
                data: {balance: newBalance}
            }
        });
        await refetchBalance();
    };

    const createIncomes = async (amount)=>{
        await createIncome(
            {
                variables: {
                data: {
                    balance: amount,
                    person_Id: 1,
                    publishedAt: new Date().toISOString()
                }
            }}

        )
        await refetchIncomeHistory();
    }

    const createExpenses = async (amount, categoryId)=>{
        await createExpense(
            {
                variables: {
                    data: {
                        category_Id: categoryId,
                        amount: amount,
                        person_Id: 1,
                        currency: "UAH",
                        publishedAt: new Date().toISOString()
                    }
                }}
        )
        await refetchExpenseHistory();
    }

    const addExpense = async (amount) => {
        const newBalance = balance - amount;
        setBalance(newBalance);
        await updateBalance({
            variables: {
                id: 1,
                data: { balance: newBalance }
            }
        });
        await refetchBalance();
    };

   const items = [
      {
         key: '1',
         label: 'EXPENSES',
          children: (balanceLoading || incomesLoading || expensesLoading) ? <p>Loading...</p> : <Expenses addExpense={addExpense} expenses={expenses} createExpenses={createExpenses}></Expenses>,
      },
      {
         key: '2',
         label: 'INCOME',
          children: (balanceLoading || incomesLoading || expensesLoading) ? <p>Loading...</p> : <Income addIncome={addIncome} incomes={incomes} createIncomes={createIncomes}></Income>,
      },
   ]
    const size= 'middle';


   const onChangeRange = (startDay, endDay)=>{
       console.log(startDay)
       const startDate = new Date(startDay[0])
       const endDate = new Date(endDay[1])
       startDate.setUTCDate(new Date(startDay[0]).getDate())
       endDate.setUTCDate(new Date(endDay[1]).getDate())
       startDate.setUTCHours(0, 0, 0);
       endDate.setUTCHours(23, 59, 59);
       setStartDateFilter(startDate) // start of the day
       setEndDateFilter(endDate) // end of the day
       console.log(startDate);
       console.log(endDate);
   }

    return (
        <div className="container">
            <div className="balance balance__container">
                <h2 className="balance__title">BALANCE</h2>
                <h2 className="balance balance__sum">{Math.round(balance).toLocaleString()} ₴</h2>
            </div>
            <Row className="date__row" size={12}>
                {/*<DatePicker size={size} onChange={onChangeDay} />*/}
                <RangePicker size={size} onChange={onChangeRange}/>
            </Row>
           <div className="tabs tabs__container">
              <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
           </div>
        </div>
    )
}







