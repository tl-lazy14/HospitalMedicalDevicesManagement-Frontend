import './Modal.css';
import Modal from 'react-modal';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../axiosInterceptor";

const ModalAddOperator = ({ isModalOpen, setIsModalOpen, updateListOperator }) => {

    const accessToken = localStorage.getItem('accessToken');

    const [newOperator, setNewOperator] = useState({
        userID: '',
        name: '',
        email: '',
        password: '',
        department: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewOperator((prevDevice) => ({
          ...prevDevice,
          [name]: value,
        }));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewOperator({
            userID: '',
            name: '',
            email: '',
            password: '',
            department: '',
        });
    };

    const handleAddOperator = async () => {
        if (
            newOperator.userID.trim() === '' || 
            newOperator.name.trim() === '' ||
            newOperator.email.trim() === '' ||
            newOperator.password.trim() === '' ||
            newOperator.department.trim() === '' 
        ) {
            toast.error('Vui lòng nhập đầy đủ các trường thông tin', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationAddOperator",
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
            const response = await api.post('/auth/register', newOperator, {
                headers: { token: `Bearer ${accessToken}` },
            });
            console.log(response.data);
            closeModal();
            toast.success('Thêm người vận hành mới thành công!', {
                position: toast.POSITION.TOP_CENTER,
                containerId: 'validationAddOperator',
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
            updateListOperator();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(`${err.response.data.error}`, {
                    position: toast.POSITION.TOP_RIGHT,
                    containerId: "validationAddOperator",
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
    };

    return (
        <>
            <ToastContainer containerId="validationAddOperator" limit={1}/>
            <Modal 
                isOpen={isModalOpen}
                onRequestClose={closeModal} 
                shouldCloseOnOverlayClick={false} 
                shouldCloseOnEsc={true}
                className="modal-device"
                overlayClassName="overlay-device" 
            >
                <h2>Thêm người vận hành mới</h2>
                <form className='grid-form'>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Mã người vận hành:</span>
                            <input
                            type="text"
                            name="userID"
                            value={newOperator.userID}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Họ tên:</span>
                            <input
                            type="text"
                            name="name"
                            value={newOperator.name}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Email</span>
                            <input
                            type="email"
                            name="email"
                            value={newOperator.email}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Mật khẩu mặc định</span>
                            <input
                            type="password"
                            name="password"
                            value={newOperator.password}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Khoa phòng:</span>
                            <input
                            type="text"
                            name="department"
                            value={newOperator.department}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <button className='done-btn' type="button" onClick={handleAddOperator}>
                        Thêm
                    </button>
                    <button className='cancel-btn' type="button" onClick={closeModal}>
                        Hủy
                    </button>
                </div>
                </form>
            </Modal>
        </>
    );
}

export default ModalAddOperator;