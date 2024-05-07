import './header.scss'
import React from 'react';
import {Header} from "antd/es/layout/layout";
import {Button, Menu} from "antd";
import {Link} from 'react-router-dom';
import { Dropdown } from 'antd';
import {UserOutlined, UserAddOutlined, SettingOutlined } from '@ant-design/icons';
import {gql, useQuery} from "@apollo/client";

const GET_PEOPLE = gql`
    query getPerson($pagination: PaginationArg, $filters: PersonFiltersInput){
        people(pagination: $pagination, filters: $filters){
            meta {
                pagination {
                    pageSize
                }
            }
            data{
                id
                attributes{
                    name
                    email
                    password
                    createdAt
                }
            }
        }}
`;



const items = [
    {
        key: "home",
        label:<Link to="/">Home 🏡</Link>
    },
    {
        key: "charts",
        label: <Link to="/charts">Charts 📈</Link>,
    },
    {
        key: "categories",
        label:  <Link to="/categories">Categories 📱</Link>,
    },
    {
        key: "history",
        label:  <Link to="/history">History 🗒️</Link>,
    }]




const App = () => {
    const {loading, error, data} = useQuery(GET_PEOPLE, {
        variables: {
            pagination: {
                pageSize: 1000
            },
            filters:{
                id:{
                    eq:1
                }
            }
        },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const people = data?.people?.data || []

    const logOut = () => {
        localStorage.clear();
    };

    const users = people.map(person => ({
        key: person.id,
        label: (
            <div className="user__column">
                <div className="user__row">
                    <p>{person.attributes.name}</p>
                </div>
                <p>{person.attributes.email}</p>
                <div className="user__row">
                    <Button type="primary" className="user__row-button" onClick={logOut}>
                        <Link to="/authorization">Log Out</Link>
                    </Button>
                </div>
            </div>
        ),
    }));

    return (
        <Header className="header__container"
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',

            }}
        >

            <div className="demo-logo"/>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                items={items}
                style={{
                    flex: 1,
                    minWidth: 0,

                }}
            />

            <div>
            <Dropdown
                menu={{
                    items: users,
                }}
                placement="topRight"
            >
                {/*<Button>topRight</Button>*/}
                <UserOutlined style={{ fontSize: '20px', color: '#FFF', cursor:'pointer' }}/>
            </Dropdown>
            </div>
        </Header>

    );
};
export default App;