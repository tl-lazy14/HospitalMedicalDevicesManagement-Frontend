import './Modal.css';
import Modal from 'react-modal';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../axiosInterceptor";

const ModalEditUsageRequest = ({ isModalOpen, setIsModalOpen, updateListUsageRequest, request, setSelectedRequest }) => {

    const accessToken = localStorage.getItem('accessToken');

    const [newRequest, setNewRequest] = useState({
        usageDepartment: request.usageDepartment,
        deviceName: request.deviceName,
        quantity: request.quantity.toString(),
        startDate: new Date(request.startDate).toISOString().split("T")[0],
        endDate: new Date(request.endDate).toISOString().split("T")[0],
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewRequest((prevDevice) => ({
          ...prevDevice,
          [name]: value,
        }));
    };

    const closeModal = () => {
        setSelectedRequest(null);
        setIsModalOpen(false);
    };

    const handleAddRequest = async () => {
        if (
            newRequest.usageDepartment.trim() === '' || 
            newRequest.deviceName.trim() === '' ||
            newRequest.quantity.trim() === '' ||
            newRequest.startDate.trim() === '' ||
            newRequest.endDate.trim() === ''
        ) {
            toast.error('Vui lòng nhập đầy đủ các trường thông tin', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationEditUsageRequest",
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

        const numericRegex = /^\d+$/;
        if (
            !numericRegex.test(newRequest.quantity)
        ) {
            toast.error(`Vui lòng chỉ nhập ký tự số trong trường 'Số lượng'`, {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationEditUsageRequest",
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

        if (newRequest.startDate > newRequest.endDate) {
            toast.error('Ngày kết thúc không được trước ngày bắt đầu', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationEditUsageRequest",
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
            const response = await api.put(`/usage/request/crud/${request._id}`, newRequest, {
                headers: { token: `Bearer ${accessToken}` },
            });
            console.log(response.data);
            closeModal();
            toast.success('Sửa và gửi yêu cầu thành công!', {
                position: toast.POSITION.TOP_CENTER,
                containerId: 'validationEditUsageRequest',
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                style: {
                    color: 'white',
                    fontSize: '17px',
                    backgroundColor: 'green',
                },
            });
            updateListUsageRequest();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(`${err.response.data.error}`, {
                    position: toast.POSITION.TOP_RIGHT,
                    containerId: "validationEditUsageRequest",
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
            <ToastContainer containerId="validationEditUsageRequest" limit={1}/>
            <Modal 
                isOpen={isModalOpen}
                onRequestClose={closeModal} 
                shouldCloseOnOverlayClick={false} 
                shouldCloseOnEsc={true}
                className="modal-device"
                overlayClassName="overlay-device" 
            >
                <h2>Sửa yêu cầu sử dụng</h2>
                <form className='grid-form'>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Tên thiết bị:</span>
                            <input
                            type="text"
                            name="deviceName"
                            value={newRequest.deviceName}
                            onChange={handleInputChange}
                            autoComplete='off'
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Số lượng:</span>
                            <input
                            type="text"
                            name="quantity"
                            value={newRequest.quantity}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Ngày bắt đầu:</span>
                            <input
                            type="date"
                            name="startDate"
                            value={newRequest.startDate}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Ngày kết thúc:</span>
                            <input
                            type="date"
                            name="endDate"
                            value={newRequest.endDate}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Phòng sử dụng:</span>
                            <input
                            type="text"
                            name="usageDepartment"
                            value={newRequest.usageDepartment}
                            onChange={handleInputChange}
                            autoComplete='off'
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <button className='done-btn' type="button" onClick={handleAddRequest}>
                        Gửi
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

export default ModalEditUsageRequest;