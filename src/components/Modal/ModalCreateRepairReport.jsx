import './Modal.css';
import Modal from 'react-modal';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../axiosInterceptor";

const ModalCreateRepairInfo = ({ isModalOpen, setIsModalOpen, record, setSelectedRecord, updateListRecord }) => {

    const accessToken = localStorage.getItem('accessToken');

    const [newInfo, setNewInfo] = useState({
        startDate: '',
        finishedDate: '',
        repairServiceProvider: '',
        cost: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewInfo((prevDevice) => ({
          ...prevDevice,
          [name]: value,
        }));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRecord(null);
        setNewInfo({
            startDate: '',
            finishedDate: '',
            repairServiceProvider: '',
            cost: '',
        });
    };

    const handleCreateReport = async () => {
        if (
            newInfo.startDate.trim() === '' 
        ) {
            toast.error('Cần nhập ngày bắt đầu sửa chữa', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "RepairInfoToast",
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
            !numericRegex.test(newInfo.cost) 
        ) {
            toast.error('Vui lòng chỉ nhập ký tự số cho trường chi phí', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "RepairInfoToast",
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
            const response = await api.put(`/faultRepair/repair/create-update/${record._id}`, newInfo, {
                headers: { token: `Bearer ${accessToken}` },
            });
            console.log(response.data);
            closeModal();
            toast.success('Tạo thông tin sửa chữa thiết bị thành công!', {
                position: toast.POSITION.TOP_CENTER,
                containerId: 'RepairInfoToast',
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                style: {
                    color: 'white',
                    fontSize: '17px',
                    backgroundColor: 'green',
                },
            });
            updateListRecord();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(`${err.response.data.error}`, {
                    position: toast.POSITION.TOP_RIGHT,
                    containerId: "RepairInfoToast",
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
            <ToastContainer containerId="RepairInfoToast" limit={1}/>
            <Modal 
                isOpen={isModalOpen}
                onRequestClose={closeModal} 
                shouldCloseOnOverlayClick={false} 
                shouldCloseOnEsc={true}
                className="modal-device"
                overlayClassName="overlay-device" 
            >
                <h2>Tạo thông tin sửa chữa thiết bị</h2>
                <form className='grid-form'>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Mã thiết bị:</span>
                            <input
                            type="text"
                            value={record?.device?.deviceID}
                            disabled
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Tên thiết bị:</span>
                            <input
                            type="text"
                            value={record?.device?.deviceName}
                            disabled
                            />
                        </label>
                    </div>
                </div>
                <div className='single-col'>
                        <label>
                            <span>Mô tả hỏng hóc:</span>
                            <input
                            type="text"
                            value={record?.description}
                            disabled
                            />
                        </label>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Ngày bắt đầu sửa:</span>
                            <input
                            type="date"
                            name="startDate"
                            value={newInfo.startDate}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Ngày hoàn thành sửa:</span>
                            <input
                            type="date"
                            name="finishedDate"
                            value={newInfo.finishedDate}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Đơn vị sửa chữa:</span>
                            <input
                            type="text"
                            name="repairServiceProvider"
                            value={newInfo.repairServiceProvider}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Chi phí:</span>
                            <input
                            type="text"
                            name="cost"
                            value={newInfo.cost}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <button className='done-btn' type="button" onClick={handleCreateReport}>
                        Tạo
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

export default ModalCreateRepairInfo;