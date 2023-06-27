import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/axiosInterceptor";
import { UserContext } from "../../components/userContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Homepage = () => {
    const { user, logout } = useContext(UserContext);

    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();

    useEffect(() => {
        const hasJustLoggedIn = localStorage.getItem('hasJustLoggedIn');
        if (!user || !accessToken) {
            navigate('/login');
        }
        else if (hasJustLoggedIn) {
            toast.success('Đăng nhập thành công!', {
                containerId: 'welcome',
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                style: {
                    color: 'white',
                    fontSize: '17px',
                    backgroundColor: 'green',
                },
            });
            localStorage.removeItem("hasJustLoggedIn");
        }
    }, [accessToken, navigate, user]);

    const handleLogout = async () => {
        try {
            await api.post(`http://localhost:3001/api/auth/logout`, user._id, {
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

    return (
        <>
            <ToastContainer containerId="welcome" limit={1}/>
            <div>Homepage</div>
            {user && (
            <div>
                <p>{user._id}</p>
                <p>{user.email}</p>
                <p>{user.name}</p>
                <p>{user.department}</p>
            </div>
            )}
            <button onClick={handleLogout}>Đăng xuất</button>
        </>
    );
}

export default Homepage;