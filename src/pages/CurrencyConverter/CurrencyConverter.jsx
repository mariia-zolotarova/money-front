import "./currencyConverter.scss"
import useFetch from "react-fetch-hook";
import React, {useState} from 'react';
import {Table, InputNumber, Dropdown, Space, Button} from 'antd';
import {DownOutlined, SmileOutlined} from '@ant-design/icons';
import {gql, useQuery} from "@apollo/client";
import {Select} from 'antd';
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
    const [inputFrom, setInputFrom] = useState(0);
    const [inputTo, setInputTo] = useState(0);
    const [selectFrom, setSelectFrom] = useState("UAH");
    const [selectTo, setSelectTo] = useState("USD");
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

    console.log(data?.data)

    const newConvert = [...new Set(data.data.map(x => x.pair.split('_')).flat())];

    const itemsFrom = newConvert.map(itemFrom => ({
        value: itemFrom,
        label: itemFrom,
    }));

    const itemsTo = newConvert.map(itemTo => ({
        value: itemTo,
        label: itemTo,
    }));

    const onChangeFrom = (value) => {
        console.log('changed', value);
        setInputFrom(value);

        if (selectTo !== 'USD') {
            const rateUSD = data?.data.find(x => x.pair === `${selectFrom}_USD`).rate
            const rateTo = data?.data.find(x => x.pair === `${selectTo}_USD`).rate
            setInputTo(Math.round(((rateTo * value / rateUSD * value)) * 100) / 100)
        } else {
            const rate = data?.data.find(x => x.pair === `${selectFrom}_${selectTo}`).rate
            setInputTo(Math.round((1 / rate * value) * 100) / 100)
        }
    };

    const onChangeTo = (value) => {
        console.log('changed', value);
        setInputTo(value);
        const rate = data?.data.find(x => x.pair === `${selectTo}_${selectFrom}`).rate
        setInputFrom(Math.round((1 / rate * value) * 100) / 100)
    };

    const onSelectFrom = (currency) => {
        console.log(currency);
        setSelectFrom(currency);
    };

    const onSelectTo = (currency) => {
        console.log(currency);
        setSelectTo(currency);
    };


    return (
        <div className="container converter__container">
            <div className="converter__balance">
                <h2 className="converter__balance-title">BALANCE:</h2>
                <h2 className="converter__balance-sum">{Math.round(balance).toLocaleString()} ₴</h2>
            </div>

            <div className="converter__currency">

                <div className="converter__currency-from">
                    <InputNumber className="converter__input-from"
                                 placeholder="Input a number"
                                 maxLength={16}
                                 onChange={onChangeFrom}
                                 value={inputFrom}
                    />

                    <Select
                        showSearch
                        style={{width: 200}}
                        placeholder="Search to Select"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input.toUpperCase())}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={itemsFrom}
                        onSelect={onSelectFrom}
                        value={selectFrom}
                    />
                </div>


                <div className="converter__currency-to">
                    <InputNumber className="converter__input-to"
                                 placeholder="Input a number"
                                 maxLength={16}
                                 onChange={onChangeTo}
                                 value={inputTo}
                    />
                    <Select
                        showSearch
                        style={{width: 200}}
                        placeholder="Search to Select"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input.toUpperCase())}
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={itemsTo}
                        onSelect={onSelectTo}
                        value={selectTo}
                    />
                </div>

            </div>
            <div className="converter__table">
                <Table className="history__table" dataSource={data?.data} columns={columnsCurrency} rowKey={'id'}/>
            </div>
        </div>
    );

}