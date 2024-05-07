import './history.scss'
import {Button, Table} from "antd";
import {gql, useQuery} from "@apollo/client";
import React from "react";
import {Navigate} from "react-router-dom";

const GET_INCOMES = gql`
    query getIncomes($pagination: PaginationArg){
        incomes(pagination: $pagination){
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
    query getExpenses($pagination: PaginationArg){
        expenses(pagination: $pagination){
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

const GET_CATEGORIES = gql`
    query getCategories($pagination: PaginationArg){
        categories(pagination: $pagination){
            meta {
                pagination {
                    pageSize
                }
            }
            data{
                id
                attributes{
                    title
                    img{
                        data{
                            attributes{
                                url
                            }
                        }
                    }
                    createdAt
                }
            }
        }}
`;

export default function History() {
    const {loading: incomesLoading, error: incomesError, data: incomesData} = useQuery(GET_INCOMES, {
        variables: {
            pagination: {
                pageSize: 1000
            }
        }
    });

    const {loading: expensesLoading, error: expensesError, data: expensesData} = useQuery(GET_EXPENSES, {
        variables: {
            pagination: {
                pageSize: 1000
            }
        }
    });

    const {loading: categoriesLoading, error: categoriesError, data :categoriesData} = useQuery(GET_CATEGORIES, {
        variables: {
            pagination: {
                pageSize: 20
            }
        }
    });

    if (localStorage.length === 0) {
        return <Navigate to="/authorization" replace />
    }

    if (categoriesLoading) return <p>Loading...</p>;  // Display a loading message
    if (categoriesError) return <p>Error: {categoriesError.message}</p>;

    if (incomesLoading) return <p>Loading...</p>;
    if (incomesError) return <p>Error :(</p>;

    if (expensesLoading) return <p>Loading...</p>;
    if (expensesError) return <p>Error :(</p>;

    const categories = categoriesData?.categories?.data;
    const incomes = incomesData?.incomes?.data
    const expenses = expensesData?.expenses?.data

    const getCategoryName = (categoryId, categories) => {
        const category = categories.find(cat => cat.id == categoryId);
        return category?.attributes?.title ?? 'Unknown';
    };

    const columnsExpenses = [
        {
            title: 'Sum',
            dataIndex: ['amount'],
            key: 'amount',
            render: (amount) => {
                return <h4>{amount} ₴</h4>
            },
            sorter: (a, b) => a.amount - b.amount
        },
        // {
        //     title: 'Currency',
        //     dataIndex: ['currency'],
        //     key: 'currency',
        //     render: (currency) => {
        //         return <p>{currency}</p>
        //     },
        // },
        {
            title: 'Category',
            dataIndex: ['categoryName'],
            key: 'categoryName',
            render: (categoryName) => {
                return <h4>{categoryName}</h4>
            },
            filters: categories.map(category => ({
                key: category.attributes.title,
                text: category.attributes.title,
                value: category.attributes.title
            })), // Use category names for filters
            onFilter: (value, record) => record.categoryName === value,
        },
        {
            title: 'Date',
            dataIndex: ['publishedAt'],
            key: 'publishedAt',
            render: (publishedAt) => {
                return <div>{publishedAt?.replace(/T.*/, '')}</div>
            },

        },
    ];

    let joinedExpensesIncomes = [];

    if (expenses && incomes) {
        joinedExpensesIncomes.push(...expenses.map(expense => {
            return {
                id: `expense-${expense.id}`,
                amount: expense.attributes.amount,
                // currency: expense.attributes.currency,
                categoryName: getCategoryName(expense.attributes.category_Id, categories),
                publishedAt: expense.attributes.publishedAt
            }
        }));
        joinedExpensesIncomes.push(...incomes.map(income => {
            return {
                id: `income-${income.id}`,
                amount: income.attributes.balance,
                // currency: 'UAH',
                categoryName: 'Income',
                publishedAt: income.attributes.publishedAt
            }
        }))
        joinedExpensesIncomes = joinedExpensesIncomes.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }
console.log(joinedExpensesIncomes)
    return (<div className="history__row">
        <div className="container history__container">
            <h2 className="history__title">History</h2>
            <Table className="history__table" dataSource={joinedExpensesIncomes} columns={columnsExpenses} rowKey={'id'}
                   rowClassName={(record, index) => {
                if (record.categoryName === 'Income') {
                    return "green";
                }
                else {
                    return "white";
                }
            }}/>

            {/*<Table className="expenses__table" dataSource={joinedExpensesIncomes} columns={columnsExpenses} rowKey={'id'}  rowClassName={(record) => (record.categoryName === 'Income' ? "green" : "red")}/>*/}
        </div>

    </div>);
}