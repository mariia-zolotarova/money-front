import "./currencyConverter.scss"
import useFetch from "react-fetch-hook";
import React from 'react';
import { Table} from 'antd';

export default function CurrencyConverter(){
    const {isLoading, error, data} = useFetch('https://www.binance.com/bapi/asset/v1/public/asset-service/product/currency')
    console.log(data);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const columnsCurrency = [
        {
            title: 'Pair',
            dataIndex: ['pair'],
            key: 'pair',
            render: (pair) => {
                return <h4>{pair}</h4>
            }
        }, {
            title: 'Rate',
            dataIndex: ['rate'],
            key: 'rate',
            render: (rate) => {
                return <h4>{rate} ₴</h4>
            }
        },
        // {
        //     title: 'Symbol',
        //     dataIndex: ['symbol'],
        //     key: 'symbol',
        //     render: (symbol) => {
        //         return <div>{symbol}</div>
        //     }
        // },

    ];

    return (
        <div className="container converter__container">
        <div className="converter__table">
            <Table className="history__table" dataSource={data?.data} columns={columnsCurrency} rowKey={'id'}/>
        </div></div>
    );

}