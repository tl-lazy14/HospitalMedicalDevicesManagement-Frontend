import './Modal.css';
import Modal from 'react-modal';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../axiosInterceptor";

const ModalCreatePurchaseRequest = ({ isModalOpen, setIsModalOpen, updateList, user }) => {

    const accessToken = localStorage.getItem('accessToken');

    const [newRequest, setNewRequest] = useState({
        requester: user._id,
        deviceName: '',
        quantity: '',
        unitPriceEstimated: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewRequest((prevDevice) => ({
          ...prevDevice,
          [name]: value,
        }));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewRequest({
            requester: user._id,
            deviceName: '',
            quantity: '',
            unitPriceEstimated: '',
        });
    };

    const handleAddRequest = async () => {
        if (
            newRequest.deviceName.trim() === '' ||
            newRequest.quantity.trim() === '' ||
            newRequest.unitPriceEstimated.trim() === ''
        ) {
            toast.error('Vui lòng nhập đầy đủ các trường thông tin', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationCreatePurchaseRequest",
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
            !numericRegex.test(newRequest.quantity) || !numericRegex.test(newRequest.unitPriceEstimated)
        ) {
            toast.error(`Vui lòng chỉ nhập ký tự số trong trường 'Số lượng' và 'Đơn giá dự kiến'`, {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationCreatePurchaseRequest",
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
            const response = await api.post('/purchase-request/create', newRequest, {
                headers: { token: `Bearer ${accessToken}` },
            });
            console.log(response.data);
            closeModal();
            toast.success('Tạo và gửi yêu cầu thành công!', {
                position: toast.POSITION.TOP_CENTER,
                containerId: 'validationCreatePurchaseRequest',
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                style: {
                    color: 'white',
                    fontSize: '17px',
                    backgroundColor: 'green',
                },
            });
            updateList();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(`${err.response.data.error}`, {
                    position: toast.POSITION.TOP_RIGHT,
                    containerId: "validationCreatePurchaseRequest",
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
            <ToastContainer containerId="validationCreatePurchaseRequest" limit={1}/>
            <Modal 
                isOpen={isModalOpen}
                onRequestClose={closeModal} 
                shouldCloseOnOverlayClick={false} 
                shouldCloseOnEsc={true}
                className="modal-device"
                overlayClassName="overlay-device" 
            >
                <h2>Tạo yêu cầu mua thiết bị mới</h2>
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
                            <span>Đơn giá dự kiến:</span>
                            <input
                            type="text"
                            name="unitPriceEstimated"
                            value={newRequest.unitPriceEstimated}
                            onChange={handleInputChange}
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

export default ModalCreatePurchaseRequest;