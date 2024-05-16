import {Button} from "antd";
import React, {useState} from "react";
import ModalIncome from "./ModalIncome";
import {Table} from 'antd';

import ChartIncome from '../../Charts/ChartIncome';
export default function Income({ addIncome, createIncomes, incomes }){
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = [
        {
            title: 'Sum',
            dataIndex: ['attributes', 'balance'],
            key: 'attributes.balance',
            render: (balance) => {
                return <h4>{balance} ₴</h4>
            },
            sorter: (a, b) => a.attributes.balance - b.attributes.balance
        },
        {
            title: 'Date',
            dataIndex: ['attributes','publishedAt'],
            key: 'publishedAt',
            render: (publishedAt) => {
                return <div>{publishedAt.replace(/T.*/, '')}</div>
            },
        },
    ];

    return(
        <div className="income__container">
            <Button className="income__button" type="primary" onClick={() => setIsModalOpen(true)}>Add💰</Button>
            <div className="income__row">
            <ChartIncome className="income__xychart" incomes={incomes}/>
            <Table className="income__table" dataSource={incomes} columns={columns} rowKey={'id'} />;</div>
            <ModalIncome isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} onAddIncome={addIncome} onCreateIncome={createIncomes}/>
        </div>
    )
}

