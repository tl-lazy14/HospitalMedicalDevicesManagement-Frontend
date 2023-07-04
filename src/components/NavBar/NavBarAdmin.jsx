import { faAngleLeft, faCartShopping, faDashboard, faLaptopMedical, faRightFromBracket, faScrewdriverWrench, faStethoscope, faUserDoctor, faWrench, } from "@fortawesome/free-solid-svg-icons";
import WebLogo from "../../assets/logoWeb.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./NavBar.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContext";

const NavBarAdmin = ({onLogOut}) => {

    const { user } = useContext(UserContext);

    const [dropdownUsing, setDropdownUsing] = useState(false);
    const [dropdownMaintenance, setDropdownMaintenance] = useState(false);

    const path = window.location.pathname;

    const navigate = useNavigate();

    return (
        <>
            <div className="nav-bar">
                <div onClick={() => navigate('/')} className="logo">
                    <img src={WebLogo} alt="logo" />
                    <h2>Admin Site</h2>
                </div>
                <nav>
                    <ul className="nav-bar-container">
                        <li>
                            <button onClick={() => navigate('/dashboard')} className={`${path === '/dashboard' ? 'selected' : ''}`}>
                                <FontAwesomeIcon className="icon" icon={faDashboard} />
                                <span>Dashboard</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate('/list-operator')} className={`${path === '/list-operator' ? 'selected' : ''}`}>
                                <FontAwesomeIcon className="icon" icon={faUserDoctor} />
                                <span>Người vận hành</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate('/list-device')} className={`${path === '/list-device' ? 'selected' : ''}`}>
                                <FontAwesomeIcon className="icon" icon={faLaptopMedical} />
                                <span>Quản lý thông tin thiết bị</span>
                            </button>
                        </li>
                        <li>
                            <button className={`${dropdownUsing ? 'open' : ''}`} onClick={() => setDropdownUsing(!dropdownUsing)}>
                                <FontAwesomeIcon className="icon" icon={faStethoscope} />
                                <span>Quản lý sử dụng thiết bị</span>
                                <FontAwesomeIcon className="icon-dropdown" icon={faAngleLeft} />
                            </button>
                            <ul className={`dropdown-menu ${dropdownUsing ? 'open' : ''}`}>
                                <li onClick={() => navigate('/list-using-request')} className={`${path === '/list-using-request' ? 'selected' : ''}`}>
                                    <span>Yêu cầu sử dụng thiết bị</span>
                                </li>
                                <li onClick={() => navigate('/using-device')} className={`${path === '/using-device' ? 'selected' : ''}`}>
                                    <span>Danh sách sử dụng thiết bị</span>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <button onClick={() => navigate('/fault-repair')} className={`${path === '/fault-repair' ? 'selected' : ''}`}>
                                <FontAwesomeIcon className="icon" icon={faScrewdriverWrench} />
                                <span>Hỏng hóc & sửa chữa</span>
                            </button>
                        </li>
                        <li>
                            <button className={`${dropdownMaintenance ? 'open' : ''}`} onClick={() => setDropdownMaintenance(!dropdownMaintenance)}>
                                <FontAwesomeIcon className="icon" icon={faWrench} />
                                <span>Quản lý bảo trì thiết bị</span>
                                <FontAwesomeIcon className="icon-dropdown" icon={faAngleLeft} />
                            </button>
                            <ul className={`dropdown-menu ${dropdownMaintenance ? 'open' : ''}`}>
                                <li onClick={() => navigate('/maintenance-soon')} className={`${path === '/maintenance-soon' ? 'selected' : ''}`}>
                                    <span>Sắp tới hạn bảo trì định kỳ</span>
                                </li>
                                <li onClick={() => navigate('/list-maintenance')} className={`${path === '/list-maintenance' ? 'selected' : ''}`}>
                                    <span>Danh sách bảo trì thiết bị</span>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <button onClick={() => navigate('/purchase-request')} className={`${path === '/purchase-request' ? 'selected' : ''}`}>
                                <FontAwesomeIcon className="icon" icon={faCartShopping} />
                                <span>Quản lý mua sắm thiết bị</span>
                            </button>
                        </li>
                    </ul>
                </nav>
                <div className="user-info">
                    <div className="user-info-container">
                        <p>{user.name}</p>
                        <p style={{opacity: 0.8, fontSize: '14px'}}>{user.department}</p>
                    </div>
                    <div className="log-out">
                        <FontAwesomeIcon onClick={() => onLogOut()} className="icon" icon={faRightFromBracket} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default NavBarAdmin;