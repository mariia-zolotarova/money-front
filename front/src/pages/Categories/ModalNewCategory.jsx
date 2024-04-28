import {Modal } from 'antd';
import React, { useState } from 'react';
import {Input, Select} from 'antd';
const { Option } = Select;

export default function ModalNewCategory({setIsModalOpen, isModalOpen, newCategories}){

    const [inputValue, setInputValue] = useState("Category Name");

    const handleOk = () => {
        newCategories(inputValue);
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return(
        <>
            <Modal title="Add category" open={isModalOpen}  onCancel={handleCancel} onOk={handleOk}>
                <Input value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
            </Modal>
        </>
    )
}