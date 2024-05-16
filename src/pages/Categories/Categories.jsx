import './categories.scss'
import {gql, useMutation, useQuery} from "@apollo/client";
import React, {useState} from "react";
import ModalNewCategory from "./ModalNewCategory";
import {getBaseUrl} from "../../index";
import {Navigate} from "react-router-dom";

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

const CREATE_CATEGORY_MUTATION = gql`
    mutation createCategory($data: CategoryInput!) {
        createCategory(data: $data) {
            data {
                id
                attributes {
                    title
                    img {
                        data{
                            attributes{
                                url
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default function Categories() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategory] = useMutation(CREATE_CATEGORY_MUTATION);

    const {loading, error, data, refetch} = useQuery(GET_CATEGORIES, {
        variables: {
            pagination: {
                pageSize: 20
            }
        }
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    if (localStorage.length === 0) {
        return <Navigate to="/authorization" replace />
    }

    const categories = data?.categories?.data;

    const newCategories = async (title) => {
        await newCategory(
            {
                variables: {
                    data: {
                        title: title,
                        img: null,
                        publishedAt: new Date().toISOString()
                    }
                }
            }
        )
        await refetch();
    }

    console.log(categories)

    return (
        <div className="container category__container">
            <h1 className="category__title">Categories</h1>
            <div className="category__cards">
                {categories.map((category) => (
                    <div className="category__card" key={category.id}>
                        <div className="category__img-container">
                            <img className="category__img"
                                 src={category.attributes.img?.data?.attributes?.url ? `${getBaseUrl()}${category.attributes.img?.data?.attributes?.url}` : "./images/more.png"}
                                 alt=""/>
                        </div>
                        <h3 className="category__name">{category.attributes.title}</h3>
                        {/*<Button type="primary">More</Button>*/}
                    </div>
                ))}
                <div className="category__card" onClick={() => setIsModalOpen(true)} >
                    <div className="category__img-container" style={{backgroundColor: "white"}}>
                        <img className="category__img" src="./images/add.png" alt="add"/>
                    </div>
                    <h3 className="category__name">New</h3>
                </div>
            </div>
            <ModalNewCategory isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} newCategories={newCategories}/>
        </div>
    );
}