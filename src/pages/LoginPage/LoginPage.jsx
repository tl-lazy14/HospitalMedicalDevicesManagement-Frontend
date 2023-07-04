import "./LoginPage.css";
import WebLogo from "../../assets/logoWeb.png";
import MedicalLogo from "../../assets/medicalLogo.png";
import Illustration1 from "../../assets/illustration1.png";
import Illustration2 from "../../assets/illustration2.png";
import LoginForm from "../../components/LoginForm/LoginForm";
import { useContext, useEffect } from "react";
import { UserContext } from "../../components/userContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {

    const { user } = useContext(UserContext);

    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();

    useEffect(() => {
        if (user && accessToken) {
            navigate('/');
        } 
    }, [accessToken, navigate, user]);

    return (
        <div className="login-page">
            <div className="left-container">
                <div className="logo-login-page">
                    <img src={MedicalLogo} style={{width: "130px"}} alt="medical-logo" />
                </div>
                <div className="web-name">
                    <h2>Hospital Medical Equipment</h2>
                    <h1>Management System</h1>
                </div>
                <div className="illustration">
                    <div><img className="illu1" src={Illustration1} style={{width: "380px"}} alt="illustration" /></div>
                    <div><img className="illu2" src={Illustration2} style={{width: "380px"}} alt="illustration" /></div>
                </div>
                <div className="contact">
                    Terms and conditions | FAQs | Contact us
                </div>
            </div>
            <div className="right-container">
                <div className="web-logo">
                    <img src={WebLogo} style={{width: "75px"}} alt="web-logo" />
                    <div><h2>Log in</h2></div>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}

export default LoginPage;