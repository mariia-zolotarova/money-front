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

    const convertToUsd = (value) => {
        console.log(selectFrom)
        const rate = selectFrom === 'USD' ? 1 : data?.data.find(x => x.pair === `${selectFrom}_USD`).rate
        return (1 / rate) * value;
    }

    const convertFromUsd = (value) => {
        console.log(selectTo)
        const rate = selectTo === 'USD' ? 1 : data?.data.find(x => x.pair === `${selectTo}_USD`).rate
        return (1 / rate) * value;
    }

    const convertFrom = (value, selectTo, selectFrom)=>{
        if (selectFrom === selectTo) {
            setInputTo(value);
        } else if (selectTo !== 'USD') {
            const rateTo = data?.data.find(x => x.pair === `${selectTo}_USD`).rate
            const valueInUsd = convertToUsd(value);
            setInputTo(valueInUsd * rateTo);
        } else {
            setInputTo(Math.round((convertToUsd(value)) * 100) / 100)
        }
        return value;
    }

    const convertTo=(value, selectTo, selectFrom)=>{
        if (selectTo === selectFrom) {
            setInputFrom(value);
        } else if (selectFrom !== 'USD') {
            const rateFrom = data?.data.find(x => x.pair === `${selectFrom}_USD`).rate
            const valueInUsd = convertFromUsd(value);
            setInputFrom(valueInUsd * rateFrom);
        } else {
            setInputFrom(Math.round((convertFromUsd(value)) * 100) / 100)
        }
        return value;
    }

    const onChangeFrom = (value) => {
        console.log('changed', value);
        setInputFrom(value);
        convertFrom(value, selectTo, selectFrom);
    };

    const onChangeTo = (value) => {
        console.log('changed', value);
        setInputTo(value);
        convertTo(value, selectTo, selectFrom);
    };

    const onSelectFrom = (currency) => {
        console.log(currency);
        setSelectFrom(currency);
        convertFrom(inputFrom, selectTo, currency)
    };

    const onSelectTo = (currency) => {
        console.log(currency);
        setSelectTo(currency);
        convertFrom(inputFrom, currency, selectFrom)
    };


    return (
        <div className="container converter__container">
            <div className="converter__balance">
                <h2 className="converter__balance-title">BALANCE:</h2>
                <h2 className="converter__balance-sum">{Math.round(balance).toLocaleString()} ₴</h2>
            </div>

            <div className="converter__currency">

                <div className="converter__currency-from">
                    <InputNumber className="converter__input"
                                 placeholder="Input a number"
                                 maxLength={16}
                                 onChange={onChangeFrom}
                                 value={inputFrom}
                    />

                    <Select
                        className="converter__select"
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
                    <InputNumber className="converter__input"
                                 placeholder="Input a number"
                                 maxLength={16}
                                 onChange={onChangeTo}
                                 value={inputTo}
                    />
                    <Select
                        className="converter__select"
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