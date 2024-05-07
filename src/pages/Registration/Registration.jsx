import './registration.scss'
import React, {useState} from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {gql, useMutation} from "@apollo/client";

const CREATE_PERSON_MUTATION= gql`
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

const onFinish = (values) => {
    console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

export default function Registration(){
    const [createPerson] = useMutation(CREATE_PERSON_MUTATION);
    const [inputNameValue, setNameInputValue] = useState();
    const [inputEmailValue, setEmailInputValue] = useState();
    const [inputPasswordValue, setPasswordInputValue] = useState();

    const createPeople = async ()=>{
        await createPerson(
            {
                variables: {
                    data: {
                        name: inputNameValue,
                        email: inputEmailValue,
                        password: inputPasswordValue,
                        publishedAt: new Date().toISOString()
                    }
                }}
        )
    }

    return(
        <div className="container registration__container">
            <Form
                className="registration__form"
                name="basic"
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={createPeople}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    // label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" value={inputNameValue} onChange={(e) => setNameInputValue(e.target.value)}/>
                </Form.Item>

                <Form.Item
                    name="email"
                    // label="E-mail"
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
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="E-mail" value={inputEmailValue} onChange={(e) => setEmailInputValue(e.target.value)}/>
                </Form.Item>

                <Form.Item
                    // label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>}  type="password" placeholder="Password" value={inputPasswordValue} onChange={(e) => setPasswordInputValue(e.target.value)}/>


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
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

