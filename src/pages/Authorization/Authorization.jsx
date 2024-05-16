import './authorization.scss'
import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Form, Input, Space} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {gql, useLazyQuery} from "@apollo/client";
import {Link, useNavigate} from "react-router-dom";

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

export default function Authorization() {
    const navigate = useNavigate();

    const [isAuthFailed, setIsAuthFailed] = useState();
    const [getPerson, {loading}] = useLazyQuery(GET_PEOPLE);

    const onFinish = async (values) => {
        const {data} = await getPerson({
            variables: {
                pagination: {
                    pageSize: 1000
                },
                filters: {
                    and: [
                        {
                            email: {
                                eq: values.email
                            }
                        },
                        {
                            password: {
                                eq: values.password
                            }
                        }
                    ]
                }
            }
        })
        // createPerson();
        console.log("success", data)

        if (data?.people?.data?.length > 0) {
            localStorage.setItem('existPerson', JSON.stringify(data.people.data[0]));
            navigate('/');
        } else {
            setIsAuthFailed(true);
        }
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
                initialValues={{
                    remember: true,
                }}
                onFieldsChange={(changedFields) => isAuthFailed && setIsAuthFailed(false)}
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
                    <Input className="authorization__input" prefix={<UserOutlined className="site-form-item-icon"/>}
                           placeholder="E-mail"
                    />
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
                    <Input.Password className="authorization__input"
                                    prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="password"
                                    placeholder="Password"
                    />
                </Form.Item>

                {
                    isAuthFailed && <div className="authorization__error">❗️Invalid email and password</div>
                }

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Submit
                        </Button>
                </Form.Item>

                <Form.Item>
                    <div className="authorization__register">
                    <p>Don't have an account yet?</p>
                        <Button type="link" htmlType="button" loading={loading}>
                            <Link to="/registration">Create one.</Link>
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    )
}