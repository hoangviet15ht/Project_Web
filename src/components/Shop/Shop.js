import React, {useState} from "react";
import { Container, Modal, Button } from 'react-bootstrap';
import { BsFillSuitHeartFill,BsList } from 'react-icons/bs';
import { FaShoppingCart } from 'react-icons/fa';
import { AiOutlineMoneyCollect } from 'react-icons/ai';
import { MdOutlineCategory,MdPriceCheck,MdOutlineDescription,MdOutlineAttachMoney,MdProductionQuantityLimits,MdOutlineDateRange } from 'react-icons/md';
import "./Shop.css";
import ListProducts from "../Shop/ListProducts";

function Shop(){
    // list product
    const [Items, setItems] = useState(ListProducts);

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
        const updateItem = ListProducts.filter((curEle) => {
            return curEle.category === cateItem;
        });
        setItems(updateItem);
    } 
    
    // load more
    const [currentElm, setCurrentElm] = useState(8);
    const loadItems = Items.slice(0, currentElm);
    const loadMore = () => {
        setCurrentElm(currentElm + 4);
    }

    // show detail modal
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setActiveModal(null);
    }
    const handleShow = () => {
        setShow(true);
    }
    const [activeModal, setActiveModal] = useState(null);
    const clickHandler= (e, index) => {
        setActiveModal(index);
    }

    return(
        <div>
            <div className="shop-title">
                <div className="shop-img">
                    <img src="./images/slider-1.jpg" alt="shop-img"></img>
                </div>
                <div className="shop-content"  data-aos="fade-up" data-aos-duration="1000">
                    <div className="container content-detail text-center">
                        <h3>Home products</h3>
                        <h1>Products</h1>
                    </div>
                </div>
            </div>
            <Container>
                <div className="shop-content" >
                    <div className="row justify-content-center">
                        <div className=" text-center">
                            <ul className="products-category">
                                <li>
                                    <div onClick={() => setItems(ListProducts)} className="tabItem active">All</div>
                                </li>
                                <li>
                                    <div onClick={() => filterItem('vegetables')} className="tabItem">Vegetables</div>
                                </li>
                                <li>
                                    <div onClick={() => filterItem('fruits')} className="tabItem">Fruits</div>
                                </li>
                                <li>
                                    <div onClick={() => filterItem('juice')} className="tabItem">Juice</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="shop-products row">
                        {
                            loadItems.map((element, index) => {
                                const {id, image, discount, category, name, price, sale_price, expiration_date, quantity,description} = element;
                                return (
                                    <div key={id} className='col-md-6 col-lg-3'  data-aos="fade-up" data-aos-duration="1000">
                                        <div className='agri-item'>
                                            <div className='agri-img'>
                                                <img className='img-fluid' src={image} alt="agri-img"/>
                                                <span className='sale'>{discount}</span>
                                                <div className="detail btn btn-primary" onClick={(e) => clickHandler(e,index)}>
                                                    Detail
                                                </div>
                                                <Modal show={activeModal === index} onHide={handleClose} centered>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>{name}</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <img src={image} alt="job-img" style={{width: "100%"}}/>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div><MdOutlineCategory /> Category: {category}</div>
                                                                <div><MdOutlineDescription/> Description: {description}</div>
                                                                <div><MdPriceCheck />Price: {price}</div>
                                                                <div><AiOutlineMoneyCollect /> Discount: {discount}</div>
                                                                <div><MdOutlineAttachMoney/> Sale price: {sale_price}</div>
                                                                <div><MdProductionQuantityLimits /> Quantity: {quantity}</div>
                                                                <div><MdOutlineDateRange /> Expiration date: {expiration_date}</div>
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
                                                <h3>{name}</h3>
                                                <div className='price d-lex '>
                                                    <span className='price-dc'>{price}</span>
                                                    <span className='price-sale'>{sale_price}</span>
                                                </div>
                                                <div className='bottom-area d-flex px-3'>
                                                    <div className='m-auto d-flex'>
                                                        <a href="#" className='add-to-card d-flex justify-content-center align-items-center text-center'>
                                                            <BsList />
                                                        </a>
                                                        <a href="#" className='buy-now d-flex justify-content-center align-items-center text-center'>
                                                            <FaShoppingCart />
                                                        </a>
                                                        <a href="#" className='like d-flex justify-content-center align-items-center text-center'>
                                                            <BsFillSuitHeartFill />
                                                        </a>
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

export default Shop;