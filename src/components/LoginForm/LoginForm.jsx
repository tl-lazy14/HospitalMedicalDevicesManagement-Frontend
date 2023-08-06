import "./LoginForm.css"
import MailImg from "../../assets/mail.png"
import LockImg from "../../assets/lock.png"
import { NavLink } from "react-router-dom";
import { FaArrowRight } from 'react-icons/fa';
import { useContext, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContext";


const LoginForm = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");

    const navigate = useNavigate();
    const { login } = useContext(UserContext);

    const handleEmailChange = (event) => {
        const value = event.target.value;
        setErrorEmail("");
        setEmail(value);
    }

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setErrorPassword("");
        setPassword(value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let count = 0;
        if (!email) {
            count++;
            setErrorEmail("Bạn chưa nhập email");
        } else setErrorEmail("");

        if (!password) {
            count++;
            setErrorPassword("Bạn chưa nhập mật khẩu");
        } else setErrorPassword("");

        if (count > 0) return;
        else {
            try {
                const response = await axios.post(`http://localhost:3001/api/auth/login`, { email, password });
                const user = response.data;
                localStorage.setItem('accessToken', user.accessToken);
                localStorage.setItem('userID', user._id);
                localStorage.setItem('hasJustLoggedIn', 'true');
                login(user);
                if (user.isAdmin === true) navigate('/list-device');
                else navigate('/operator/usage-request');
            } catch (err) {
                toast.error('Tài khoản hoặc mật khẩu không đúng. Vui lòng nhập lại', {
                    position: toast.POSITION.TOP_RIGHT,
                    containerId: "incorrect",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeButton: true,
                    style: {
                        color: '#d32f2f',
                        fontSize: '17px',
                        backgroundColor: '#f1f4fa',
                    },
                });
            }
        }
    }

    return (
        <div className="login-form">
            <ToastContainer containerId="incorrect" limit={1}/>
            <form onSubmit={handleSubmit}>
                <div className="field-container">
                    <label>Email Address</label>
                    <br />
                    <div className="input-field">
                        <span className="icon"><img src={MailImg} width={25} alt="email-icon" /></span>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            autoComplete="on"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        {errorEmail && <div className="error-message">{errorEmail}</div>}  
                    </div>
                </div>
                <div className="field-container">
                    <label>Password</label>
                    <br />
                    <div className="input-field">
                        <span className="icon"><img src={LockImg} width={25} alt="lock-icon" /></span>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />  
                        {errorPassword && <div className="error-message">{errorPassword}</div>}
                    </div>
                </div>
                <div className="forgot"><NavLink className="link" to="/forgot-password">Forgot Password?</NavLink></div>
                <div className="submit-btn">
                    <FaArrowRight 
                        className="icon" 
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    />
                    <button type="submit" className={`${isHovered ? 'icon-hovered' : ''}`}>Login</button>
                </div>
            </form>
        </div>
    );
}   

export default LoginForm;