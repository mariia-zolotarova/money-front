import "./person.scss"

import React from 'react';
import {EditOutlined, EllipsisOutlined, SettingOutlined} from '@ant-design/icons';
import {Avatar, Card} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {gql, useQuery} from "@apollo/client";


const GET_PEOPLE = gql`
    query getPerson($pagination: PaginationArg){
        people(pagination: $pagination){
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

const {Meta} = Card;
export default function Person() {
    const {loading, error, data} = useQuery(GET_PEOPLE, {
        variables: {
            pagination: {
                pageSize: 1000
            }
        }
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const people = data?.people?.data


    return (
        <div>
            {people.map(person => (

                <Card
                    key={person.id}
                    style={{width: 400}}
                    cover={
                        <img
                            alt="example"
                            src="https://cdn-icons-png.flaticon.com/512/6475/6475938.png"
                        />
                    }
                    actions={[
                        <SettingOutlined key="setting"/>,
                        <EditOutlined key="edit"/>,
                        <EllipsisOutlined key="ellipsis"/>,
                    ]}
                >
                    <Meta
                        avatar={<Avatar icon={<UserOutlined/>}/>}
                        title={person.attributes.name}
                        description={person.attributes.email}
                    />
                </Card>))
            }
        </div>
    );
};

