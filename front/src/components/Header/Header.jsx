import './header.scss'
import React from 'react';
import {Header} from "antd/es/layout/layout";
import {Menu, theme} from "antd";
import { UserOutlined } from '@ant-design/icons';
import {Link, Route, Routes} from 'react-router-dom';
import { Avatar } from 'antd';

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
    // const {
    //     token: { colorBgContainer, borderRadiusLG },
    // } = theme.useToken();
    return (
        <Header
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

            <Link to="/person">
                <Avatar icon={<UserOutlined/>}></Avatar>
            </Link>
        </Header>

    );
};
export default App;