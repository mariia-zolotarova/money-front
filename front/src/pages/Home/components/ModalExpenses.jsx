import {Button, Modal} from 'antd';
import React, { useState } from 'react';
import {InputNumber, Select} from 'antd';
import {gql, useQuery} from "@apollo/client";


const { Option } = Select;

const GET_CATEGORIES = gql`
  query getCategories($pagination: PaginationArg){
  categories(pagination: $pagination){
    meta {
      pagination {
        pageSize
      }
    }
    data{
      id
      attributes{
        title
        img{
          data{
            attributes{
              url
            }
          }
        }
        createdAt
      }
    }
  }}
`;
export default function ModalExpenses({setIsModalOpen, isModalOpen, onAddExpense, onCreateExpense}){
    const [inputValue, setInputValue] = useState();
    const [selectedCategoryId, setSelectedCategoryId]=useState(null);
    const { loading, error, data } = useQuery(GET_CATEGORIES, {
        variables: {
            pagination: {
                pageSize: 20
            }
        }
    });

    if (loading) return <p>Loading...</p>;  // Display a loading message
    if (error) return <p>Error: {error.message}</p>;

    const categories = data?.categories?.data;

    const handleOk = () => {
        onAddExpense(inputValue);
        onCreateExpense(inputValue, selectedCategoryId);
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const selectCategory = (categoryId) => {
        setSelectedCategoryId(categoryId);
    };

    const selectAfter = (
        <Select
            defaultValue="UAH"
            style={{
                width: 60,
            }}
        >
            <Option value="UAH">₴</Option>
        </Select>
    );

    return (
        <>
            <Modal title="Add money" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <InputNumber  min={0.01} precision={2} addonAfter={selectAfter} value={inputValue} onChange={setInputValue}/>
                <div className="expenses expenses__container">
                    <h1 className="expenses__title">Categories</h1>
                    <div className="expenses__cards">
                        {categories.map((category) => (
                            <div  className={`expenses__card ${selectedCategoryId === category.id ? 'expenses__card-selected' : ''}`}
                                  key={category.id}
                                  onClick={() => selectCategory(category.id)}>
                                <div className="expenses__img-container">
                                    <img className="category__img"
                                         src={category.attributes.img?.data?.attributes?.url ? `http://localhost:1337${category.attributes.img?.data?.attributes?.url}` : "./images/more.png"}
                                         alt=""/></div>
                                <h3 className="expenses__name">{category.attributes.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
}