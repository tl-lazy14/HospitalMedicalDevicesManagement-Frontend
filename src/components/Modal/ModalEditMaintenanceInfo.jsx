import './Modal.css';
import Modal from 'react-modal';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../axiosInterceptor";

const ModalEditMaintenanceInfo = ({ isModalOpen, setIsModalOpen, updateListMaintenanceInfo, record, setSelectedRecord }) => {

    const accessToken = localStorage.getItem('accessToken');

    const [selectedMaintenanceInfo, setSelectedMaintenanceInfo] = useState({
        device: {
            deviceID: record.device.deviceID,
            deviceName: record.device.deviceName,
        },
        startDate: new Date(record.startDate).toISOString().split("T")[0],
        finishedDate: new Date(record.finishedDate).toISOString().split("T")[0],
        performer: record.performer,
        maintenanceServiceProvider: record.maintenanceServiceProvider,
        cost: record.cost,
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name.startsWith('device')) {
            const [field, nestedField] = name.split('.');
            setSelectedMaintenanceInfo((prevInfo) => ({
              ...prevInfo,
              device: {
                ...prevInfo.device,
                [nestedField]: value,
              },
            }));
        } else {
            // Xử lý các trường còn lại bình thường
            setSelectedMaintenanceInfo((prevInfo) => ({
              ...prevInfo,
              [name]: value,
            }));
        }
    };

    const closeModal = () => {
        setSelectedRecord(null);
        setIsModalOpen(false);
    };

    const handleUpdateMaintenanceInfo = async () => {

        if (
            selectedMaintenanceInfo.device.deviceID.trim() === '' ||
            selectedMaintenanceInfo.device.deviceName.trim() === '' ||
            selectedMaintenanceInfo.startDate.trim() === ''
        ) {
            toast.error('Bạn cần ít nhất phải nhập thông tin về thiết bị và ngày bắt đầu', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationEditMaintenanceInfo",
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
        if (selectedMaintenanceInfo.finishedDate && selectedMaintenanceInfo.startDate > selectedMaintenanceInfo.finishedDate) {
            toast.error('Ngày hoàn thành không được trước ngày bắt đầu', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationEditMaintenanceInfo",
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
            !numericRegex.test(selectedMaintenanceInfo.cost)
        ) {
            toast.error('Vui lòng chỉ nhập ký tự số cho trường chi phí bảo trì', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationEditMaintenanceInfo",
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
            const response = await api.put(`/maintenance/info/crud/${record._id}`, selectedMaintenanceInfo, {
                headers: { token: `Bearer ${accessToken}` },
            });
            console.log(response.data);
            closeModal();
            toast.success('Sửa thông tin bảo trì thành công!', {
                position: toast.POSITION.TOP_CENTER,
                containerId: 'validationEditMaintenanceInfo',
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
            updateListMaintenanceInfo();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(`${err.response.data.error}`, {
                    position: toast.POSITION.TOP_RIGHT,
                    containerId: "validationEditMaintenanceInfo",
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
            <ToastContainer containerId="validationEditMaintenanceInfo" limit={1}/>
            <Modal 
                isOpen={isModalOpen}
                onRequestClose={closeModal} 
                shouldCloseOnOverlayClick={false} 
                shouldCloseOnEsc={true}
                className="modal-device"
                overlayClassName="overlay-device" 
            >
                <h2>Sửa thông tin bảo trì thiết bị</h2>
                <form className='grid-form'>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Mã thiết bị:</span>
                            <input
                            type="text"
                            name="device.deviceID"
                            value={selectedMaintenanceInfo.device.deviceID}
                            disabled
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Tên thiết bị:</span>
                            <input
                            type="text"
                            value={selectedMaintenanceInfo.device.deviceName}
                            disabled
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Ngày bắt đầu bảo trì:</span>
                            <input
                            type="date"
                            name="startDate"
                            value={selectedMaintenanceInfo.startDate}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Ngày hoàn thành bảo trì:</span>
                            <input
                            type="date"
                            name="finishedDate"
                            value={selectedMaintenanceInfo.finishedDate}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Người thực hiện bảo trì:</span>
                            <input
                            type="text"
                            name="performer"
                            value={selectedMaintenanceInfo.performer}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Đơn vị bảo trì:</span>
                            <input
                            type="text"
                            name="maintenanceServiceProvider"
                            value={selectedMaintenanceInfo.maintenanceServiceProvider}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Chi phí:</span>
                            <input
                            type="text"
                            name="cost"
                            value={selectedMaintenanceInfo.cost}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <button className='done-btn' type="button" onClick={handleUpdateMaintenanceInfo}>
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

export default ModalEditMaintenanceInfo;