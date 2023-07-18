import './Modal.css';
import Modal from 'react-modal';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../axiosInterceptor";

const ModalEditUsageInfo = ({ isModalOpen, setIsModalOpen, updateListUsageInfo, record, setSelectedRecord }) => {

    const accessToken = localStorage.getItem('accessToken');

    const [selectedUsageInfo, setSelectedUsageInfo] = useState({
        device: {
            deviceID: record.device.deviceID,
            deviceName: record.device.deviceName,
        },
        requester: {
            userID: record.requester.userID,
            name: record.requester.name,
        },
        usageDepartment: record.usageDepartment,
        startDate: new Date(record.startDate).toISOString().split("T")[0],
        endDate: new Date(record.endDate).toISOString().split("T")[0],
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name.startsWith('device')) {
            const [field, nestedField] = name.split('.');
            setSelectedUsageInfo((prevInfo) => ({
              ...prevInfo,
              device: {
                ...prevInfo.device,
                [nestedField]: value,
              },
            }));
        } else if (name.startsWith('requester')) {
            const [field, nestedField] = name.split('.');
            setSelectedUsageInfo((prevInfo) => ({
              ...prevInfo,
              requester: {
                ...prevInfo.requester,
                [nestedField]: value,
              },
            }));
        } else {
            // Xử lý các trường còn lại bình thường
            setSelectedUsageInfo((prevInfo) => ({
              ...prevInfo,
              [name]: value,
            }));
        }
    };

    const closeModal = () => {
        setSelectedRecord(null);
        setIsModalOpen(false);
    };

    const checkDeviceAvailability = async () => {
        try {
          // Lấy danh sách các thiết bị đã được sử dụng trong khoảng thời gian đang kiểm tra
          const responseUsing = await api.get(`/usage/info/using`, {
            params: {
              startDate: selectedUsageInfo.startDate,
              endDate: selectedUsageInfo.endDate,
            },
            headers: { token: `Bearer ${accessToken}` },
          });
      
          const usedDevices = responseUsing.data;

          const responseFault = await api.get('/faultRepair/fault/statusFault', {
                headers: { token: `Bearer ${accessToken}` }
          });

          const faultDevices = responseFault.data;

          const responseRepairing = await api.get(`/faultRepair/repair/repairing`, {
            params: {
              startDate: selectedUsageInfo.startDate,
              endDate: selectedUsageInfo.endDate,
            },
            headers: { token: `Bearer ${accessToken}` },
          });

          const reparingDevices = responseRepairing.data;

          const responseMaintenance = await api.get(`/maintenance/maintenancing/get-maintenancing-device`, {
            params: {
              startDate: selectedUsageInfo.startDate,
              endDate: selectedUsageInfo.endDate,
            },
            headers: { token: `Bearer ${accessToken}` },
          });

          const maintenancingDevices = responseMaintenance.data;
      
          // Kiểm tra tính khả dụng của các thiết bị đã lấy được
            const isDeviceFault = faultDevices.some((faultDevice) => {
                return (
                  faultDevice.deviceID === selectedUsageInfo.device.deviceID 
                )
            });

            if (isDeviceFault) {
                return false;
            }

            const isDeviceReparing = reparingDevices.some((reparingDevice) => {
                return (
                  reparingDevice.device.deviceID === selectedUsageInfo.device.deviceID &&
                  !(new Date(reparingDevice.finishedDate) < new Date(selectedUsageInfo.startDate) ||
                    new Date(reparingDevice.startDate) > new Date(selectedUsageInfo.endDate))
                );
            });
        
              // Nếu thiết bị đã được sử dụng trong khoảng thời gian đang kiểm tra
            if (isDeviceReparing) {
                return false;
            }

            const isDeviceMaintenancing = maintenancingDevices.some((maintenancingDevice) => {
                return (
                  maintenancingDevice.device.deviceID === selectedUsageInfo.device.deviceID &&
                  !(new Date(maintenancingDevice.finishedDate) < new Date(selectedUsageInfo.startDate) ||
                    new Date(maintenancingDevice.startDate) > new Date(selectedUsageInfo.endDate))
                );
            });
        
              // Nếu thiết bị đã được sử dụng trong khoảng thời gian đang kiểm tra
            if (isDeviceMaintenancing) {
                return false;
            }

            const isDeviceUsed = usedDevices.some((usedDevice) => {
                return (
                  usedDevice.device.deviceID === selectedUsageInfo.device.deviceID && usedDevice._id !== record._id &&
                  !(new Date(usedDevice.endDate) < new Date(selectedUsageInfo.startDate) ||
                    new Date(usedDevice.startDate) > new Date(selectedUsageInfo.endDate))
                );
            });
        
            // Nếu thiết bị đã được sử dụng trong khoảng thời gian đang kiểm tra
            if (isDeviceUsed) {
                return false;
            }
      
          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
    };

    const handleUpdateUsageInfo = async () => {

        if (
            selectedUsageInfo.device.deviceID.trim() === '' ||
            selectedUsageInfo.device.deviceName.trim() === '' ||
            selectedUsageInfo.requester.userID.trim() === '' ||
            selectedUsageInfo.requester.name.trim() === '' ||
            selectedUsageInfo.usageDepartment.trim() === '' ||
            selectedUsageInfo.startDate.trim() === '' ||
            selectedUsageInfo.endDate.trim() === ''
        ) {
            toast.error('Mã người yêu cầu, mã thiết bị không tồn tại hoặc bạn chưa nhập đủ các trường thông tin', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationAddUsageInfo",
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
        if (selectedUsageInfo.startDate > selectedUsageInfo.endDate) {
            toast.error('Ngày bắt đầu cần đến trước ngày kết thúc', {
                position: toast.POSITION.TOP_RIGHT,
                containerId: "validationAddUsageInfo",
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

        const isDevicesAvailable = await checkDeviceAvailability();

        if (!isDevicesAvailable) {
            // Xử lý tương ứng (hiển thị thông báo, vô hiệu hóa nút Thêm, vv.)
            toast.error('Thiết bị không khả dụng trong khoảng thời gian đã chọn', {
              position: toast.POSITION.TOP_RIGHT,
              containerId: 'validationAddUsageInfo',
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
            const response = await api.put(`/usage/info/crud/${record._id}`, selectedUsageInfo, {
                headers: { token: `Bearer ${accessToken}` },
            });
            console.log(response.data);
            closeModal();
            toast.success('Sửa thông tin sử dụng thành công!', {
                position: toast.POSITION.TOP_CENTER,
                containerId: 'validationAddUsageInfo',
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
            updateListUsageInfo();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(`${err.response.data.error}`, {
                    position: toast.POSITION.TOP_RIGHT,
                    containerId: "validationAddUsageInfo",
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
            <ToastContainer containerId="validationAddUsageInfo" limit={1}/>
            <Modal 
                isOpen={isModalOpen}
                onRequestClose={closeModal} 
                shouldCloseOnOverlayClick={false} 
                shouldCloseOnEsc={true}
                className="modal-device"
                overlayClassName="overlay-device" 
            >
                <h2>Sửa thông tin sử dụng thiết bị</h2>
                <form className='grid-form'>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Mã thiết bị:</span>
                            <input
                                type='text'
                                name='device.deviceID'
                                value={selectedUsageInfo.device.deviceID}
                                disabled
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Tên thiết bị:</span>
                            <input
                                type='text'
                                value={selectedUsageInfo.device.deviceName}
                                disabled
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Mã người yêu cầu:</span>
                            <input
                            type="text"
                            name="requester.userID"
                            value={selectedUsageInfo.requester.userID}
                            disabled
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Tên người yêu cầu:</span>
                            <input
                            type="text"
                            value={selectedUsageInfo.requester.name}
                            disabled
                            />
                        </label>
                    </div>
                </div>
                <div className='single-col'>
                        <label>
                            <span>Phòng sử dụng:</span>
                            <input
                            type="text"
                            name="usageDepartment"
                            value={selectedUsageInfo.usageDepartment}
                            onChange={handleInputChange}
                            />
                        </label>
                </div>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Ngày bắt đầu:</span>
                            <input
                            type="date"
                            name="startDate"
                            value={selectedUsageInfo.startDate}
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
                            value={selectedUsageInfo.endDate}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                <div className='grid-row'>
                    <button className='done-btn' type="button" onClick={handleUpdateUsageInfo}>
                        Sửa
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

export default ModalEditUsageInfo;