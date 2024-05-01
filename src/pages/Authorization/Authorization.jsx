import './authorization.scss'
import React, {useState} from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {gql, useLazyQuery, useQuery} from "@apollo/client";
import { useNavigate } from "react-router-dom";


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



export default function Authorization(){

    const [inputEmailValue, setInputEmailValue] = useState();
    const [inputPasswordValue, setInputPasswordValue] = useState();
    const navigate = useNavigate();


    const [getPerson, {loading, error, data}] = useLazyQuery(GET_PEOPLE);

    // if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const people = data?.people?.data
    console.log(people)

    const onFinish = async (values) => {
        await getPerson({
            variables: {
                pagination: {
                    pageSize: 1000
                },
                filters: {
                    and: [
                        {
                            email: {
                                eq: inputEmailValue
                            }
                        },
                        {
                            password: {
                                eq: inputPasswordValue
                            }
                        }
                    ]
                }
            }
        })
        // createPerson();
        console.log('Success:', values);

        navigate('/');
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="container authorization__container">
            {loading && <div>loading</div>}
            <Form
                className="authorization__form"
                name="basic"
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >

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
                    <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="E-mail" value={inputEmailValue} onChange={(e) => setInputEmailValue(e.target.value)}/>
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
                    <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="password"
                                    placeholder="Password"
                                    value={inputPasswordValue}
                                    onChange={(e) => setInputPasswordValue(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}