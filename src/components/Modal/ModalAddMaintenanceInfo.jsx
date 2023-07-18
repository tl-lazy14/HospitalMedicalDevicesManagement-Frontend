import './Modal.css';
import Modal from 'react-modal';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../axiosInterceptor";

const ModalAddMaintenanceInfo = ({ isModalOpen, setIsModalOpen, updateListMaintenanceInfo }) => {

    const accessToken = localStorage.getItem('accessToken');

    const [newMaintenanceInfo, setNewMaintenanceInfo] = useState({
        device: {
            deviceID: '',
            deviceName: '',
        },
        startDate: '',
        finishedDate: '',
        performer: '',
        maintenanceServiceProvider: '',
        cost: '',
    });

    const getDeviceNameByID = async (id) => {
        try {
            if (!id) {
                setNewMaintenanceInfo((prevInfo) => ({
                    ...prevInfo,
                    device: {
                      ...prevInfo.device,
                      deviceName: '',
                    },
                }));
            }
            else {
                const response = await api.get(`/device/getName/${id}`, {
                    headers: { token: `Bearer ${accessToken}` }
                });
                setNewMaintenanceInfo((prevInfo) => ({
                    ...prevInfo,
                    device: {
                    ...prevInfo.device,
                    deviceName: response.data,
                    },
                }))
            };
        } catch (err) {
            console.log(err);
        }
    }


    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name.startsWith('device')) {
            const [field, nestedField] = name.split('.');
            setNewMaintenanceInfo((prevInfo) => ({
              ...prevInfo,
              device: {
                ...prevInfo.device,
                [nestedField]: value,
              },
            }));
        } else {
            // Xử lý các trường còn lại bình thường
            setNewMaintenanceInfo((prevInfo) => ({
              ...prevInfo,
              [name]: value,
            }));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewMaintenanceInfo({
            device: {
                deviceID: '',
                deviceName: '',
            },
            startDate: '',
            finishedDate: '',
            performer: '',
            maintenanceServiceProvider: '',
            cost: '',
        });
    };

    const handleAddMaintenanceInfo = async () => {

        if (
            newMaintenanceInfo.device.deviceID.trim() === '' ||
            newMaintenanceInfo.device.deviceName.trim() === '' ||
            newMaintenanceInfo.startDate.trim() === ''
        ) {
            toast.error('Bạn cần ít nhất phải nhập thông tin về thiết bị và ngày bắt đầu', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationAddMaintenanceInfo",
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
        if (newMaintenanceInfo.finishedDate && newMaintenanceInfo.startDate > newMaintenanceInfo.finishedDate) {
            toast.error('Ngày hoàn thành không được trước ngày bắt đầu', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationAddMaintenanceInfo",
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
            newMaintenanceInfo.cost && !numericRegex.test(newMaintenanceInfo.cost)
        ) {
            toast.error('Vui lòng chỉ nhập ký tự số cho trường chi phí bảo trì', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationAddMaintenanceInfo",
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
            const response = await api.post('/maintenance/info/add', newMaintenanceInfo, {
                headers: { token: `Bearer ${accessToken}` },
            });
            console.log(response.data);
            closeModal();
            toast.success('Thêm thông tin bảo trì thành công!', {
                position: toast.POSITION.TOP_CENTER,
                containerId: 'validationAddMaintenanceInfo',
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
                    containerId: "validationAddMaintenanceInfo",
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
            <ToastContainer containerId="validationAddMaintenanceInfo" limit={1}/>
            <Modal 
                isOpen={isModalOpen}
                onRequestClose={closeModal} 
                shouldCloseOnOverlayClick={false} 
                shouldCloseOnEsc={true}
                className="modal-device"
                overlayClassName="overlay-device" 
            >
                <h2>Thêm thông tin bảo trì mới</h2>
                <form className='grid-form'>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Mã thiết bị:</span>
                            <input
                            type="text"
                            name="device.deviceID"
                            value={newMaintenanceInfo.device.deviceID}
                            onChange={handleInputChange}
                            onBlur={() => {getDeviceNameByID(newMaintenanceInfo.device.deviceID);}}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Tên thiết bị:</span>
                            <input
                            type="text"
                            value={newMaintenanceInfo.device.deviceName}
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
                            value={newMaintenanceInfo.startDate}
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
                            value={newMaintenanceInfo.finishedDate}
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
                            value={newMaintenanceInfo.performer}
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
                            value={newMaintenanceInfo.maintenanceServiceProvider}
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
                            value={newMaintenanceInfo.cost}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <button className='done-btn' type="button" onClick={handleAddMaintenanceInfo}>
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

export default ModalAddMaintenanceInfo;