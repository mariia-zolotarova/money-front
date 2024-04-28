import {Button} from "antd";
import React, {useState} from "react";
import ModalExpenses from "./ModalExpenses";
import {Table} from 'antd';
import ChartExpense from "../../Charts/ChartExpence";
import {gql, useQuery} from "@apollo/client";

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

export default function Expenses({addExpense, createExpenses, expenses}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    let groupedExpenses = [];

    const {loading, error, data} = useQuery(GET_CATEGORIES, {
        variables: {
            pagination: {
                pageSize: 20
            }
        }
    });

    if (loading) return <p>Loading...</p>;  // Display a loading message
    if (error) return <p>Error: {error.message}</p>;

    const categories = data?.categories?.data;

    const getCategoryName = (categoryId, categories) => {
        const category = categories.find(cat => cat.id == categoryId);
        return category?.attributes?.title ?? 'Unknown';
    };

    expenses?.forEach((expense) => {
        // const category = expense.attributes.category_Id;
        const category_Id = expense.attributes.category_Id; // change category to category_Id
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

    const columns = [
        {
            title: 'Sum',
            dataIndex: ['amount'],
            key: 'amount',
            render: (amount) => {
                return <h4>{amount.toFixed(2)} ₴</h4>
            },
            sorter: (a, b) => a.amount - b.amount
        },
        {
            title: 'Category',
            dataIndex: ['categoryName'],
            key: 'categoryName',
            render: (categoryName) => {
                return <h4>{categoryName} </h4>
            },
            filters: categories.map(category => ({
                key: category.id,
                text: category.attributes.title,
                value: category.id
            })), // Use category names for filters
            onFilter: (value, record) => record.category === value,
        },
    ];

    // console.log("Categories:", categories);
    // console.log("Expenses:", expenses);
    // console.log("Grouped Expenses:", groupedExpenses);


    return (
        <div className="expenses__container">
            <Button  className="expenses__button"  type="primary" onClick={() => setIsModalOpen(true)}>Expense💸</Button>
            <div className="expenses__row">
                <ChartExpense className="expenses__row-chart" expenses={groupedExpenses} paddingTop={100}/>
                <Table className="expenses__table" dataSource={groupedExpenses} columns={columns} rowKey={'category'}/>
            </div>
            <ModalExpenses isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} onAddExpense={addExpense}
                           onCreateExpense={createExpenses}/>
        </div>
    )
}