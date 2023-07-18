import './Modal.css';
import Modal from 'react-modal';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../axiosInterceptor";

const ModalEditOperator = ({ isModalOpen, setIsModalOpen, updateListOperator, user, setSelectedUser }) => {

    const accessToken = localStorage.getItem('accessToken');

    const [infoOperator, setInfoOperator] = useState({
        userID: user.userID,
        name: user.name,
        email: user.email,
        department: user.department,
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInfoOperator((prevDevice) => ({
          ...prevDevice,
          [name]: value,
        }));
    };

    const closeModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    const handleEditDevice = async () => {
        if (
            infoOperator.userID.trim() === '' || 
            infoOperator.name.trim() === '' ||
            infoOperator.email.trim() === '' ||
            infoOperator.department.trim() === '' 
        ) {
            toast.error('Vui lòng nhập đầy đủ các trường thông tin', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationEditOperator",
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
            const response = await api.put(`/user/info/crud/${user._id}`, infoOperator, {
                headers: { token: `Bearer ${accessToken}` },
            });
            console.log(response.data);
            closeModal();
            toast.success('Sửa thông tin người vận hành thành công!', {
                position: toast.POSITION.TOP_CENTER,
                containerId: 'validationEditOperator',
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
                    containerId: "validationEditOperator",
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
            <ToastContainer containerId="validationEditOperator" limit={1}/>
            <Modal 
                isOpen={isModalOpen} 
                onRequestClose={closeModal} 
                shouldCloseOnOverlayClick={false} 
                shouldCloseOnEsc={true}
                className="modal-device"
                overlayClassName="overlay-device" 
            >
                <h2>Sửa thông tin người vận hành</h2>
                <form className='grid-form'>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Mã người vận hành:</span>
                            <input
                            type="text"
                            name="userID"
                            value={infoOperator.userID}
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
                            value={infoOperator.name}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Email:</span>
                            <input
                            type="text"
                            name="email"
                            value={infoOperator.email}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Khoa phòng:</span>
                            <input
                            type="text"
                            name="department"
                            value={infoOperator.department}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <button className='done-btn' type="button" onClick={handleEditDevice}>
                        Cập nhật
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

export default ModalEditOperator;