import {Modal } from 'antd';
import React, { useState } from 'react';
import {Input} from 'antd';

export default function ModalNewCategory({setIsModalOpen, isModalOpen, newCategories}){

    const [inputValue, setInputValue] = useState();
    const [isInputEmpty, setIsInputEmpty] = useState();

    const handleOk = () => {
        if(inputValue){
        newCategories(inputValue);
        setIsModalOpen(false);
        setInputValue("");
        }
        else{
            setIsInputEmpty(true)
        }
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onInputChange = (event)=>{
        setIsInputEmpty(false);
        setInputValue(event.target.value);
    }

    return(
        <>
            <Modal title="Add category" open={isModalOpen}  onCancel={handleCancel} onOk={handleOk}>
                <Input value={inputValue} placeholder="Category Name" onChange={onInputChange} />
                {
                    isInputEmpty && <div className="authorization__error">❗️Enter Category Name</div>
                }
            </Modal>
        </>
    )
}