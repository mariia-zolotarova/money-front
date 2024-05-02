import './authorization.scss'
import React, {useState} from 'react';
import {Button, Checkbox, Form, Input} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {gql, useLazyQuery} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import {Alert} from 'antd';


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
            navigate('/');
        }
        else{
            setIsAuthFailed(true);
            // Create new state IsAuthFailed. Set IsAuthFailedSet(true).
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
                // wrapperCol={{
                //     offset: 8,
                //     span: 16,
                // }}
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
                    <Input className="authorization__input" prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="E-mail"
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
                    <Input.Password className="authorization__input" prefix={<LockOutlined className="site-form-item-icon"/>}
                                    type="password"
                                    placeholder="Password"
                    />
                </Form.Item>

                {
                    isAuthFailed && <div className="authorization__error">Error, please check your email and password!</div>
                }

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    // wrapperCol={{
                    //     offset: 8,
                    //     span: 16,
                    // }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item
                    // wrapperCol={{
                    //     offset: 8,
                    //     span: 16,
                    // }}
                >
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}