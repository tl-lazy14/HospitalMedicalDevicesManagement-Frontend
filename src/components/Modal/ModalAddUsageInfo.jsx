import './Modal.css';
import Modal from 'react-modal';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from "../axiosInterceptor";

const ModalAddUsageInfo = ({ isModalOpen, setIsModalOpen, updateListUsageInfo }) => {

    const accessToken = localStorage.getItem('accessToken');

    const [newUsageInfo, setNewUsageInfo] = useState({
        devices: [{
            deviceID: '',
            deviceName: '',
        }],
        requester: {
            userID: '',
            name: '',
        },
        usageDepartment: '',
        startDate: '',
        endDate: '',
    });

    const [deviceCount, setDeviceCount] = useState(1);

    const handleAddDeviceRow = () => {
        setDeviceCount((prevCount) => prevCount + 1);
        setNewUsageInfo((prevInfo) => ({
            ...prevInfo,
            devices: [
                ...prevInfo.devices,
                {
                    deviceID: '',
                    deviceName: '',
                },
            ],
        }));
    };

    const getRequesterNameByID = async (id) => {
        try {
            if (!id) {
                setNewUsageInfo((prevInfo) => ({
                    ...prevInfo,
                    requester: {
                      ...prevInfo.requester,
                      name: '',
                    },
                }));
            }
            else {
                const response = await api.get(`/user/getName/${id}`, {
                    headers: { token: `Bearer ${accessToken}` }
                });
                setNewUsageInfo((prevInfo) => ({
                    ...prevInfo,
                    requester: {
                    ...prevInfo.requester,
                    name: response.data,
                    },
                }))
            };
        } catch (err) {
            console.log(err);
        }
    }

    const getDeviceNameByID = async (id, index) => {
        try {
            const updatedDevices = [...newUsageInfo.devices];
            if (!id) {
                updatedDevices[index]['deviceName'] = '';
                setNewUsageInfo((prevInfo) => ({
                    ...prevInfo,
                    devices: updatedDevices,
                }));
            }
            else {
                const response = await api.get(`/device/getName/${id}`, {
                    headers: { token: `Bearer ${accessToken}` }
                });
                updatedDevices[index]['deviceName'] = response.data;
                setNewUsageInfo((prevInfo) => ({
                    ...prevInfo,
                    devices: updatedDevices,
                }));
            }

        } catch (err) {
            console.log(err);
        }
    }

    const renderDeviceRows = () => {
        const deviceRows = [];
        for (let i = 0; i < deviceCount; i++) {
            deviceRows.push(
                <div className='grid-row' key={i}>
                    <div className='grid-col'>
                        <label>
                            <span>{`Mã thiết bị ${i + 1}:`}</span>
                            <input
                                type='text'
                                name={`devices[${i}].deviceID`}
                                value={newUsageInfo.devices[i]?.deviceID || ''}
                                onChange={handleInputChange}
                                onBlur={() => {getDeviceNameByID(newUsageInfo.devices[i].deviceID, i);}}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>{`Tên thiết bị ${i + 1}:`}</span>
                            <input
                                type='text'
                                value={newUsageInfo.devices[i]?.deviceName || ''}
                                disabled
                            />
                        </label>
                    </div>
                </div>
            );
        }
        return deviceRows;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name.startsWith('devices')) {
            const regex = /devices\[(\d+)\]\.(.*)/; // Biểu thức chính quy để trích xuất số index
            const match = name.match(regex);
            if (match) {
                const index = match[1];
                const nestedField = match[2];

                const updatedDevices = [...newUsageInfo.devices];
                if (!updatedDevices[index]) {
                    updatedDevices[index] = {
                        deviceID: '',
                        deviceName: '',
                    };
                }
                updatedDevices[index][nestedField] = value;

                setNewUsageInfo((prevInfo) => ({
                    ...prevInfo,
                    devices: updatedDevices,
                }));
            }
        } else if (name.startsWith('requester')) {
            const [field, nestedField] = name.split('.');
            setNewUsageInfo((prevInfo) => ({
              ...prevInfo,
              requester: {
                ...prevInfo.requester,
                [nestedField]: value,
              },
            }));
        } else {
            // Xử lý các trường còn lại bình thường
            setNewUsageInfo((prevInfo) => ({
              ...prevInfo,
              [name]: value,
            }));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewUsageInfo({
            devices: [{
                deviceID: '',
                deviceName: '',
            }],
            requester: {
                userID: '',
                name: '',
            },
            usageDepartment: '',
            startDate: '',
            endDate: '',
        });
        setDeviceCount(1);
    };

    const checkDeviceAvailability = async () => {
        try {
          // Lấy danh sách các thiết bị đã được sử dụng trong khoảng thời gian đang kiểm tra
          const responseUsing = await api.get(`/usage/info/using`, {
            params: {
              startDate: newUsageInfo.startDate,
              endDate: newUsageInfo.endDate,
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
              startDate: newUsageInfo.startDate,
              endDate: newUsageInfo.endDate,
            },
            headers: { token: `Bearer ${accessToken}` },
          });

          const reparingDevices = responseRepairing.data;

          const responseMaintenance = await api.get(`/maintenance/maintenancing/get-maintenancing-device`, {
            params: {
              startDate: newUsageInfo.startDate,
              endDate: newUsageInfo.endDate,
            },
            headers: { token: `Bearer ${accessToken}` },
          });

          const maintenancingDevices = responseMaintenance.data;
      
          // Kiểm tra tính khả dụng của các thiết bị đã lấy được
          for (const device of newUsageInfo.devices) {
            const isDeviceFault = faultDevices.some((faultDevice) => {
                return (
                  faultDevice.deviceID === device.deviceID 
                )
            });

            if (isDeviceFault) {
                return false;
            }

            const isDeviceReparing = reparingDevices.some((reparingDevice) => {
                return (
                  reparingDevice.device.deviceID === device.deviceID &&
                  !(new Date(reparingDevice.finishedDate) < new Date(newUsageInfo.startDate) ||
                    new Date(reparingDevice.startDate) > new Date(newUsageInfo.endDate))
                );
            });
        
              // Nếu thiết bị đã được sử dụng trong khoảng thời gian đang kiểm tra
            if (isDeviceReparing) {
                return false;
            }

            const isDeviceMaintenancing = maintenancingDevices.some((maintenancingDevice) => {
                return (
                  maintenancingDevice.device.deviceID === device.deviceID &&
                  !(new Date(maintenancingDevice.finishedDate) < new Date(newUsageInfo.startDate) ||
                    new Date(maintenancingDevice.startDate) > new Date(newUsageInfo.endDate))
                );
            });
        
              // Nếu thiết bị đã được sử dụng trong khoảng thời gian đang kiểm tra
            if (isDeviceMaintenancing) {
                return false;
            }

            const isDeviceUsed = usedDevices.some((usedDevice) => {
                return (
                  usedDevice.device.deviceID === device.deviceID &&
                  !(new Date(usedDevice.endDate) < new Date(newUsageInfo.startDate) ||
                    new Date(usedDevice.startDate) > new Date(newUsageInfo.endDate))
                );
            });
        
              // Nếu thiết bị đã được sử dụng trong khoảng thời gian đang kiểm tra
            if (isDeviceUsed) {
                return false;
            }
            
          }
      
          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
    };

    const handleAddUsageInfo = async () => {

        const atLeastOneDeviceEmpty = newUsageInfo.devices.some(
            (device) => device.deviceID.trim() === '' || device.deviceName.trim() === ''
        );
        if (
            atLeastOneDeviceEmpty || 
            newUsageInfo.requester.userID.trim() === '' ||
            newUsageInfo.requester.name.trim() === '' ||
            newUsageInfo.usageDepartment.trim() === '' ||
            newUsageInfo.startDate.trim() === '' ||
            newUsageInfo.endDate.trim() === ''
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
        if (newUsageInfo.startDate > newUsageInfo.endDate) {
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
            const response = await api.post('/usage/info', newUsageInfo, {
                headers: { token: `Bearer ${accessToken}` },
            });
            console.log(response.data);
            closeModal();
            toast.success('Thêm thông tin sử dụng thành công!', {
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
                <h2>Thêm thông tin sử dụng mới</h2>
                <form className='grid-form'>
                <div className='grid-row'>
                    <div className='grid-col'>
                        <label>
                            <span>Mã người yêu cầu:</span>
                            <input
                            type="text"
                            name="requester.userID"
                            value={newUsageInfo.requester.userID}
                            onChange={handleInputChange}
                            onBlur={() => {getRequesterNameByID(newUsageInfo.requester.userID);}}
                            />
                        </label>
                    </div>
                    <div className='grid-col'>
                        <label>
                            <span>Tên người yêu cầu:</span>
                            <input
                            type="text"
                            value={newUsageInfo.requester.name}
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
                            value={newUsageInfo.usageDepartment}
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
                            value={newUsageInfo.startDate}
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
                            value={newUsageInfo.endDate}
                            onChange={handleInputChange}
                            />
                        </label>
                    </div>
                </div>
                {renderDeviceRows()}
                { deviceCount < 3 &&
                <div className='add-device-btn'>
                    <button type='button' onClick={handleAddDeviceRow}>
                        Thêm thiết bị
                    </button>
                </div>    
                }
                <div className='grid-row'>
                    <button className='done-btn' type="button" onClick={handleAddUsageInfo}>
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

export default ModalAddUsageInfo;