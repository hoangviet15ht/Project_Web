import React, { useState, useEffect } from "react";
import { Container, Modal, Button } from 'react-bootstrap';
import { BsFillSuitHeartFill } from 'react-icons/bs';
import { FaShoppingCart } from 'react-icons/fa';
import { MdPriceCheck, MdOutlineDescription, MdProductionQuantityLimits } from 'react-icons/md';
import "./Shop.css";
import { notification } from 'antd';
import axios from "axios";
import PageContent from "../PageContent/PageContent";
import { useNavigate } from "react-router-dom";
import NumberFormat from "react-number-format";

function Shop(props) {
    const navigate = useNavigate();
    // list product
    const [data, setData] = useState(null);
    const [authenticated, setAuthenticated] = useState(JSON.parse(localStorage.getItem("authenticated")));

    const base_url = "https://my-happy-farmer.herokuapp.com/api/v1";

    const [currentElm, setCurrentElm] = useState(8);
    const [loadData, setLoadData] = useState([]);


    useEffect(async () => {
        await axios.get(base_url + "/product")
            .then(res => res.data)
            .then(data => {
                setData(data.data);
                setLoadData(data.data.slice(0, currentElm));
            });
    }, [])
    // tab active
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const tabs = $$(".tabItem");

    tabs.forEach((tab) => {
        tab.onclick = function () {
            $(".tabItem.active").classList.remove("active");
            this.classList.add("active");
        };
    });

    // filter products
    const filterItem = (cateItem) => {
        const updateItem = data.filter((curEle) => {
            return curEle.category === cateItem;
        });
        // setData(updateItem);
        setLoadData(updateItem);
    }

    // load more
    const loadMore = () => {
        setCurrentElm(currentElm + 4);
    }

    // show detail modal
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setActiveModal(null);
    }
    const [activeModal, setActiveModal] = useState(null);
    const clickHandler = (e, index) => {
        setActiveModal(index);
    }

    // Add product to cart
    var cart = [];

    const getProductById = (id) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === id)
                return data[i];
        }
    }

    const addToCard = async (id) => {
        if (authenticated == null) {
            openNotificationWarning("Bạn cần đăng nhập trước nhé !")
            navigate("/login");
        } else {
            let headers = {
                'Authorization': 'Bearer ' + authenticated.token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            let product = getProductById(id);
            await axios.post(base_url + "/cart", { product_id: id }, { headers })
                .then(res => {
                    if (res.status == 200) {

                        openNotificationSuccess(product.name);
                    }
                }).catch(err => { throw new Error(err) });
            props.handleIncreaseCart();
        }

    }

    // notification add to cart success
    const openNotificationSuccess = (name) => {
        notification.success({
            message: `Sản phẩm ${name} đã được thêm vào giỏ hàng`,
            duration: 1
        });
    }
    const openNotificationWarning = (message) => {
        notification.warning({
            message: message,
            duration: 1
        });
    }


    // shop content
    const shopContent = {
        img: "https://images.unsplash.com/photo-1626139576127-f02f74c10298?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        line2: "Cửa hàng",
        line3: "Happy Farmer",
        line4: "Mang hạnh phúc đến mọi người!"
    }

    return (

        <div>
            <PageContent content={shopContent} />
            <Container>
                <div className="shop-content" >
                    <div className="row justify-content-center">
                        <div className=" text-center">
                            <ul className="products-category">
                                <li>
                                    <div onClick={() => setLoadData(data)} className="tabItem active">Tất cả</div>
                                </li>
                                <li>
                                    <div onClick={() => filterItem('Phân bón')} className="tabItem">Phân bón</div>
                                </li>
                                <li>
                                    <div onClick={() => filterItem('Dụng cụ lao động')} className="tabItem">Dụng cụ lao động</div>
                                </li>
                                <li>
                                    <div onClick={() => filterItem('Hạt giống')} className="tabItem">Hạt giống</div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="shop-products row">
                        {
                            loadData.map((element, index) => {
                                return (
                                    <div key={element.id} className='col-sm-6 col-md-4 col-lg-3' data-aos="fade-up" data-aos-duration="1000">
                                        <div className='agri-item'>
                                            <div className='agri-img'>
                                                <img className='img-fluid' src={element.image_url} alt="agri-img" />
                                                <span className='sale'>{element.discount}%</span>
                                                <div className="detail btn btn-primary" onClick={(e) => clickHandler(e, index)}>
                                                    Detail
                                                </div>
                                                <Modal show={activeModal === index} onHide={handleClose} centered>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>{element.name}</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <img src={element.image_url} alt="job-img" style={{ width: "100%" }} />
                                                                <div><MdPriceCheck />Price: <NumberFormat value={element.price} displayType={'text'} thousandSeparator={true} prefix={'₫'}></NumberFormat></div>
                                                                <div><MdProductionQuantityLimits /> Quantity: {element.quantity}</div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="des"><MdOutlineDescription /> Description: <p>{element.description}</p></div>
                                                            </div>
                                                        </div>
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <Button variant="secondary" onClick={handleClose}>
                                                            Close
                                                        </Button>
                                                    </Modal.Footer>
                                                </Modal>
                                            </div>
                                            <div className='text text-center px-3 py-3 pb-4'>
                                                <h3>{element.name}</h3>
                                                <div className='price d-lex '>
                                                    <span className='price-dc'><NumberFormat value={element.price} displayType={'text'} thousandSeparator={true} prefix={'₫'}></NumberFormat></span>
                                                    <span className='price-sale'><NumberFormat value={element.sale} displayType={'text'} thousandSeparator={true} prefix={'₫'}></NumberFormat></span>
                                                </div>
                                                <div className='bottom-area d-flex px-3'>
                                                    <div className='m-auto d-flex'>
                                                        <div className='buy-now d-flex justify-content-center align-items-center text-center'
                                                            onClick={() => { addToCard(element.id) }}
                                                        >
                                                            <FaShoppingCart />
                                                        </div>
                                                        <div className='like d-flex justify-content-center align-items-center text-center'>
                                                            <BsFillSuitHeartFill />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <button
                        className="btn d-block load-more-btn"
                        onClick={() => loadMore()}
                    >
                        Load more...
                    </button>
                </div>
            </Container>
        </div>
    );
};

export default React.memo(Shop);