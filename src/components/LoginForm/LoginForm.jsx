import "./LoginForm.css"
import MailImg from "../../assets/mail.png"
import LockImg from "../../assets/lock.png"
import { NavLink } from "react-router-dom";
import { FaArrowRight } from 'react-icons/fa';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");

    const navigate = useNavigate();

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

    const handleSubmit = (event) => {
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
        else navigate('/next-page')
    }

    return (
        <div className="login-form">
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
                    <button type="submit" className={`${isHovered ? 'icon-hovered' : ''}`} >Login</button>
                </div>
            </form>
        </div>
    );
}   

export default LoginForm;