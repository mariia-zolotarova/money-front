import {Modal } from 'antd';
import React, { useState } from 'react';
import {InputNumber, Select} from 'antd';

const { Option } = Select;
export default function ModalIncome({setIsModalOpen, isModalOpen, onAddIncome, onCreateIncome}){

    const handleOk = () => {
        onAddIncome(inputValue);
        onCreateIncome(inputValue);
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
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

    const [inputValue, setInputValue] = useState();

    return (
        <>
            <Modal className="income__container" title="Add money" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <InputNumber min={0.01} precision={2} addonAfter={selectAfter} value={inputValue} onChange={setInputValue} />
            </Modal>
        </>
    );
}

