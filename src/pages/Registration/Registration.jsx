import './registration.scss'
import React, {useState} from 'react';
import {Button, Checkbox, Form, Input} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {gql, useMutation} from "@apollo/client";
import {Link} from "react-router-dom";

const CREATE_PERSON_MUTATION = gql`
    mutation createPerson($data: PersonInput!) {
        createPerson(data: $data) {
            data {
                id
                attributes {
                    name
                    email
                    password
                    publishedAt
                }
            }
        }
    }
`;

// const CREATE_BALANCE_MUTATION = gql`
//     mutation createBalance($data: BalanceInput!) {
//         createBalance(data: $data) {
//             data {
//                 id
//                 attributes{
//                     balance
//                     person_Id
//                     publishedAt
//                 }
//             }
//         }
//     }`;

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

export default function Registration() {
    const [createPerson] = useMutation(CREATE_PERSON_MUTATION);
    // const [createBalance] = useMutation(CREATE_BALANCE_MUTATION);
    const [inputNameValue, setNameInputValue] = useState();
    const [inputEmailValue, setEmailInputValue] = useState();
    const [inputPasswordValue, setPasswordInputValue] = useState();

    const createPeople = async () => {
        await createPerson(
            {
                variables: {
                    data: {
                        name: inputNameValue,
                        email: inputEmailValue,
                        password: inputPasswordValue,
                        publishedAt: new Date().toISOString()
                    }
                }
            }
        )
    }

    // const createBalances = async()=>{
    //     await createBalance(
    //         {
    //             variables:{
    //                 data:{
    //                     balance: 0,
    //                     personId: 111
    //                 }
    //             }
    //         }
    //     )
    // }

    // const onFinish = () => {
    //     createPeople();
    //     createBalances();
    // };

    return (
        <div className="container registration__container">
            <Form
                className="registration__form"
                name="basic"
                initialValues={{
                    remember: true,
                }}
                onFinish={createPeople}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input className="registration__input" prefix={<UserOutlined className="site-form-item-icon"/>}
                           placeholder="Username" value={inputNameValue}
                           onChange={(e) => setNameInputValue(e.target.value)}/>
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input className="registration__input" prefix={<UserOutlined className="site-form-item-icon"/>}
                           placeholder="E-mail" value={inputEmailValue}
                           onChange={(e) => setEmailInputValue(e.target.value)}/>
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password className="registration__input"
                                    prefix={<LockOutlined className="site-form-item-icon"/>} type="password"
                                    placeholder="Password" value={inputPasswordValue}
                                    onChange={(e) => setPasswordInputValue(e.target.value)}/>

                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>

                <Form.Item>
                    <div className="authorization__register">
                        <Button type="link" htmlType="button">
                            <Link to="/authorization">Already have an account?</Link>
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    )
}

