import './charts.scss'
import ChartIncome from "./ChartIncome";
import React from "react";
import ChartExpense from "./ChartExpence";
import {gql, useQuery} from "@apollo/client";
import {Navigate} from "react-router-dom";

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

export default function Charts({incomes, expenses}) {
    let groupedExpenses = [];
    let person={}, personId=-1

    if(localStorage.length>0){
        person =  JSON.parse(localStorage.getItem("existPerson"));
        personId = Number(person.id)
    }

    const {loading: incomesLoading, error: incomesError, data: incomesData} = useQuery(GET_INCOMES, {
        variables: {
            pagination: {
                pageSize: 1000
            },
            filters:{
                person_Id:{
                    eq:personId
                }
            }
        }
    });

    const {loading: expensesLoading, error: expensesError, data: expensesData} = useQuery(GET_EXPENSES, {
        variables: {
            pagination: {
                pageSize: 1000
            },
            filters:{
                person_Id:{
                    eq:personId
                }
            }
        }
    });

    const {loading: categoriesLoading, error: categoriesError, data: categoriesData} = useQuery(GET_CATEGORIES, {
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

    const categories = categoriesData?.categories?.data;


    if (incomesLoading) return <p>Loading...</p>;
    if (incomesError) return <p>Error :(</p>;

    if (expensesLoading) return <p>Loading...</p>;
    if (expensesError) return <p>Error :(</p>;

    const income = incomesData?.incomes?.data
    const expense = expensesData?.expenses?.data

    const getCategoryName = (categoryId, categories) => {
        const category = categories.find(cat => cat.id == categoryId);
        return category?.attributes?.title ?? 'Unknown';
    };

    expense?.forEach((expense) => {
        const category_Id = expense.attributes.category_Id;
        const categoryName = getCategoryName(category_Id, categories);
        const amount = parseFloat(expense.attributes.amount);

        let currentExpense = groupedExpenses.find(x => x.category === category_Id);

        if (currentExpense) {
            currentExpense.amount += amount;
        } else {
            currentExpense = {
                category: category_Id,
                categoryName: categoryName,
                amount: amount
            };
            groupedExpenses.push(currentExpense);
        }
    });

    return (
        <div className="container charts__row">
            <div className="charts__column">
                <h2 className="charts__title">Incomes</h2>
                <div className="charts__row-item">
                    <ChartIncome incomes={income}/>
                </div>
            </div>
            <div className="charts__column">
                <h2 className="charts__title">Expenses</h2>
                <div className="charts__row-item">
                    <ChartExpense className="charts__row-item charts__row-expense" expenses={groupedExpenses}/>
                </div>
            </div>
        </div>
    )
}