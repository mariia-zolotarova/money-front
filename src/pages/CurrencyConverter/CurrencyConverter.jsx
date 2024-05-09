import "./currencyConverter.scss"
import useFetch from "react-fetch-hook";
import React from 'react';
import {Table, InputNumber, Dropdown, Space, Button} from 'antd';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import {gql, useQuery} from "@apollo/client";
import { Select } from 'antd';
import {Link} from "react-router-dom";

const FETCH_BALANCE_QUERY = gql`
    query GetBalances($filters: BalanceFiltersInput) {
        balances(filters: $filters) {
            data {
                id
                attributes {
                    balance
                }
            }
        }
    }
`;


export default function CurrencyConverter() {
    let person = {}, personId = -1

    if (localStorage.length > 0) {
        person = JSON.parse(localStorage.getItem("existPerson"));
        personId = Number(person.id)
    }

    const {
        data: balanceData,
        loading: balanceLoading,
        error: balanceError,
        refetch: refetchBalance
    } = useQuery(FETCH_BALANCE_QUERY, {
        variables: {
            filters: {
                person_Id: {
                    eq: personId
                }
            }
        }
    });

    const balance = balanceData?.balances?.data[0]?.attributes?.balance;

    const {
        isLoading,
        error,
        data
    } = useFetch('https://www.binance.com/bapi/asset/v1/public/asset-service/product/currency')

    if (isLoading || balanceLoading) return <div>Loading...</div>;

    if (balanceError || error) return <p>Error :(</p>;

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
                return <h4>{rate}</h4>
            }
        },
    ];

    const onChange = (value) => {
        console.log('changed', value);
    };

    console.log(data)
    const newConvert = [...new Set(data.data.map(x => x.pair.split('_')).flat())];

    const itemsFrom = newConvert.map(itemFrom => ({
        value: itemFrom,
        label: itemFrom,
    }));

    const itemsTo = newConvert.map(itemTo => ({
        value: itemTo,
        label: itemTo,
    }));


    return (


        <div className="container converter__container">
            <div className="converter__heading">
                <div className="converter__balance">
                    <h2 className="converter__balance-title">BALANCE</h2>
                    <h2 className="converter__balance-sum">{Math.round(balance).toLocaleString()} ₴</h2>
                </div>

                <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').includes(input.toUpperCase())}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={itemsFrom}
                />

                <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input, option) => (option?.label ?? '').includes(input.toUpperCase())}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={itemsTo}
                />

                <InputNumber className="converter__input"
                             placeholder="Input a number"
                             maxLength={16}
                             onChange={onChange}
                />
            </div>
            <div className="converter__table">
                <Table className="history__table" dataSource={data?.data} columns={columnsCurrency} rowKey={'id'}/>
            </div>
        </div>
    );

}