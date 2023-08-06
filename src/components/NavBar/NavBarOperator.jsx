import { faCartShopping, faKey, faRightFromBracket, faScrewdriverWrench, faStethoscope } from "@fortawesome/free-solid-svg-icons";
import WebLogo from "../../assets/logoWeb.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./NavBar.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContext";

const NavBarOperator = ({ onLogOut }) => {

    const { user } = useContext(UserContext);

    const path = window.location.pathname;

    const navigate = useNavigate();

    return (
            <div className="nav-bar">
                <div onClick={() => navigate('/usage-request')} className="logo">
                    <img src={WebLogo} alt="logo" />
                    <h2>Operator Site</h2>
                </div>
                <nav>
                    <ul className="nav-bar-container">
                        <li>
                            <button onClick={() => navigate('/operator/change-password')} className={`${path === '/operator/change-password' ? 'selected' : ''}`}>
                                <FontAwesomeIcon className="icon" icon={faKey} />
                                <span>Đổi mật khẩu</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate('/operator/usage-request')} className={`${path === '/operator/usage-request' ? 'selected' : ''}`}>
                                <FontAwesomeIcon className="icon" icon={faStethoscope} />
                                <span>Yêu cầu sử dụng thiết bị</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate('/operator/fault-report')} className={`${path === '/operator/fault-report' ? 'selected' : ''}`}>
                                <FontAwesomeIcon className="icon" icon={faScrewdriverWrench} />
                                <span>Báo cáo hỏng hóc</span>
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate('/operator/purchase-request')} className={`${path === '/operator/purchase-request' ? 'selected' : ''}`}>
                                <FontAwesomeIcon className="icon" icon={faCartShopping} />
                                <span>Yêu cầu mua sắm thiết bị</span>
                            </button>
                        </li>
                    </ul>
                </nav>
                <div className="user-info-operator">
                    <div className="user-info-container">
                        <p style={{ color: "black", fontWeight: '600' }} className="operator-name">{user.name}</p>
                        <p style={{opacity: 0.8, fontSize: '14px'}} className="department">{user.department}</p>
                    </div>
                    <div className="log-out">
                        <FontAwesomeIcon onClick={() => onLogOut()} className="icon" icon={faRightFromBracket} />
                    </div>
                </div>
            </div>
    );
}

export default NavBarOperator;