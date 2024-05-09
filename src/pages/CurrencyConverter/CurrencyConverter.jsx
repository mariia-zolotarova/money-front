import "./currencyConverter.scss"
import useFetch from "react-fetch-hook";
import React from 'react';
import {Table, InputNumber, Dropdown, Space } from 'antd';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import {gql, useQuery} from "@apollo/client";

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

    const dropItem = data?data?.rate:null;
    const items = [
        {
            key: 'item',
            label:(dropItem) => {
                return <h4>{dropItem}</h4>
            }
        },
    ];

    return (


        <div className="container converter__container">
            <div className="converter__heading">
                <div className="converter__balance">
                    <h2 className="converter__balance-title">BALANCE</h2>
                    <h2 className="converter__balance-sum">{Math.round(balance).toLocaleString()} ₴</h2>
                </div>

                <Dropdown
                    menu={{
                        items,
                    }}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            Hover me <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>

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