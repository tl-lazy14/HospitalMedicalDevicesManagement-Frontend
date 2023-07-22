import { useState, useContext } from "react";
import api from "../../components/axiosInterceptor";
import { UserContext } from "../../components/userContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import "./ChangePasswordPage.css";

const ChangePasswordPage = () => {

    const accessToken = localStorage.getItem('accessToken');
    const { user, logout } = useContext(UserContext);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordAgain, setNewPasswordAgain] = useState('');

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post(`/auth/logout`, user._id, {
                headers: { token: `Bearer ${accessToken}` },
            });
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userID');
            logout();
            navigate('/login');
          } catch (error) {
            console.error(error);
        }
    }

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !newPasswordAgain) {
            toast.error('Vui lòng nhập đầy đủ các trường', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "changePasswordToast",
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                style: {
                    color: '#d32f2f',
                    fontSize: '17px',
                    backgroundColor: '#f1f4fa',
                },
            });
            return;
        }
        if (newPassword !== newPasswordAgain) {
            toast.error('Nhập lại mật khẩu mới chưa chính xác', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "changePasswordToast",
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                style: {
                    color: '#d32f2f',
                    fontSize: '17px',
                    backgroundColor: '#f1f4fa',
                },
            });
            return;
        }
        try {
            const response = await api.put(`/auth/change-password/${user._id}`, {
                currentPassword: currentPassword,
                newPassword: newPassword,
            }, {
                headers: { token: `Bearer ${accessToken}` },
            });
            console.log(response.data);
            toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.', {
                position: toast.POSITION.TOP_CENTER,
                containerId: 'changePasswordToast',
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                style: {
                    color: 'white',
                    fontSize: '17px',
                    backgroundColor: 'green',
                    width: '400px',
                },
            });
            setTimeout(handleLogout, 2000);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(`${err.response.data.error}`, {
                    position: toast.POSITION.TOP_RIGHT,
                    containerId: "changePasswordToast",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeButton: false,
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
        <>
            <ToastContainer containerId="changePasswordToast" limit={1}/>
            <div className="list-request-usage-page">
                <div className="change-password-box">
                    <h2 className="name-page">Đổi mật khẩu tài khoản</h2>
                    <div className="change-psw-container">
                        <div className="input-field">
                            <label>
                                <p>Nhập mật khẩu hiện tại:</p>
                                <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="input-field">
                            <label>
                                <p>Nhập mật khẩu mới:</p>
                                <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="input-field">
                            <label>
                                <p>Nhập lại mật khẩu mới:</p>
                                <input
                                type="password"
                                value={newPasswordAgain}
                                onChange={(e) => setNewPasswordAgain(e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="btn" onClick={handleChangePassword}>
                            Đổi mật khẩu
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChangePasswordPage;