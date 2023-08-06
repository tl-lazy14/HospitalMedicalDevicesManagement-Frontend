import "./Dashboard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCheckToSlot, faHeartBroken, faHospitalUser, faScrewdriverWrench, faStethoscope } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import api from "../../components/axiosInterceptor";
import PieChartClassifyDevice from "../../components/Chart/PieChartClassifyDevice";
import PieChartRequest from "../../components/Chart/PieChartRequest";
import BarChartNumOfDevice from "../../components/Chart/BarChartNumOfDevice";
import BarChartOverview from "../../components/Chart/BarChartOverview";
import LineChartInventory from "../../components/Chart/LineChartInventory";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {

    const accessToken = localStorage.getItem('accessToken');

    const [totalDevice, setTotalDevice] = useState();
    const [totalUsageRequest, setTotalUsageRequest] = useState();
    const [totalFaultRepair, setTotalFaultRepair] = useState();
    const [totalPurchaseRequest, setTotalPurchaseRequest] = useState();
    const [availableDevice, setAvailableDevice] = useState();
    const [usingDevice, setUsingDevice] = useState();
    const [failureDevice, setFailureDevice] = useState();
    const [maintenanceDevice, setMaintenanceDevice] = useState();
    const [classify, setClassify] = useState([]);
    const [dataUsageRequest, setDataUsageRequest] = useState([]);
    const [dataFaultRepair, setDataFaultRepair] = useState([]);
    const [dataPurchaseRequest, setDataPurchaseRequest] = useState([]);
    const [yearNumDeviceByMonth, setYearNumDeviceByMonth] = useState(2022);
    const [dropdownYearNumDeviceByMonth, setDropdownYearNumDeviceByMonth] = useState(false);
    const [yearOverviewByMonth, setYearOverviewByMonth] = useState(new Date().getFullYear());
    const [dropdownYearOverviewByMonth, setDropdownYearOverviewByMonth] = useState(false);
    const [yearCostBreakdownByMonth, setYearCostBreakdownByMonth] = useState(new Date().getFullYear());
    const [dropdownCostBreakdownByMonth, setDropdownCostBreakdownByMonth] = useState(false);

    const navigate = useNavigate();

    const [dataDeviceByMonth, setDataDeviceByMonth] = useState([]);
    const [dataOverviewByMonth, setDataOverviewByMonth] = useState([]);
    const [dataCostBreakdownByMonth, setDataCostBreakdownByMonth] = useState([]);
    const [uptime, setUptime] = useState(0);
    const [mtbf, setMTBF] = useState(0);
    const [ageFailureRate, setAgeFailureRate] = useState(0);
    const [periodicMaintenanceRatio, setPeriodicMaintenanceRatio] = useState(0);
    const [avgRepairTime, setAvgRepairTime] = useState(0);
    const [avgMaintenanceTime, setAvgMaintenanceTime] = useState(0);
    const [repairMaintenanceCost, setRepairMaintenanceCost] = useState(0);
    const [purchaseCost, setPurchaseCost] = useState(0);

    let yearToSelectFrom2021 = [];
    for (let i = 2021; i <= new Date().getFullYear(); i++) {
        yearToSelectFrom2021.push(i);
    }

    let yearToSelectFrom2022 = [];
    for (let i = 2022; i <= new Date().getFullYear(); i++) {
        yearToSelectFrom2022.push(i);
    }

    const selectYear = (year, setYear, setDropdown) => {
        setYear(year);
        setDropdown(false);
    }

    const getNumDeviceByStatus = async () => {
        try {
            const response = await api.get('/device/dashboard/numDeviceByStatus', {
                headers: { token: `Bearer ${accessToken}` }
            });
            setTotalDevice(response.data.total);
            setAvailableDevice(response.data.available);
            setUsingDevice(response.data.using);
            setFailureDevice(response.data.failure);
            setMaintenanceDevice(response.data.maintenance);
        } catch (err) {
            console.log(err);
        }
    };

    const getClassifyDevice = async () => {
        try {
            const response = await api.get('/device/dashboard/classify-device', {
                headers: { token: `Bearer ${accessToken}` }
            });
            setClassify(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getClassifyUsageRequest = async () => {
        try {
            const response = await api.get('/device/dashboard/classify-usage-request', {
                headers: { token: `Bearer ${accessToken}` }
            });
            setTotalUsageRequest(response.data.total);
            setDataUsageRequest(response.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getClassifyFaultRepair = async () => {
        try {
            const response = await api.get('/device/dashboard/classify-fault-repair', {
                headers: { token: `Bearer ${accessToken}` }
            });
            setTotalFaultRepair(response.data.total);
            setDataFaultRepair(response.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getClassifyPurchaseRequest = async () => {
        try {
            const response = await api.get('/device/dashboard/classify-purchase-request', {
                headers: { token: `Bearer ${accessToken}` }
            });
            setTotalPurchaseRequest(response.data.total);
            setDataPurchaseRequest(response.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getNumDeviceByMonth = async () => {
        try {
            const response = await api.get('/device/dashboard/numDeviceByMonth', {
                headers: { token: `Bearer ${accessToken}` },
                params: {
                    year: yearNumDeviceByMonth
                }
            });
            setDataDeviceByMonth(response.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getOverviewByMonth = async () => {
        try {
            const response = await api.get('/device/dashboard/overviewByMonth', {
                headers: { token: `Bearer ${accessToken}` },
                params: {
                    year: yearOverviewByMonth
                }
            });
            setDataOverviewByMonth(response.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getCostBreakdownByMonth = async () => {
        try {
            const response = await api.get('/device/dashboard/cost-breakdown-month', {
                headers: { token: `Bearer ${accessToken}` },
                params: {
                    year: yearCostBreakdownByMonth
                }
            });
            setDataCostBreakdownByMonth(response.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getUptime = async () => {
        try {
            const response = await api.get('/device/dashboard/uptime', {
                headers: { token: `Bearer ${accessToken}` }
            });
            setUptime(response.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getMTBF = async () => {
        try {
            const response = await api.get('/device/dashboard/mtbf', {
                headers: { token: `Bearer ${accessToken}` }
            });
            setMTBF(response.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getAgeFailureRate = async () => {
        try {
            const response = await api.get('/device/dashboard/ageFailureRate', {
                headers: { token: `Bearer ${accessToken}` }
            });
            setAgeFailureRate(response.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getPeriodicMaintenanceRatio = async () => {
        try {
            const response = await api.get('/device/dashboard/periodicMaintenance', {
                headers: { token: `Bearer ${accessToken}` }
            });
            setPeriodicMaintenanceRatio(response.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getAvgRepairTime = async () => {
        try {
            const response = await api.get('/device/dashboard/avgRepairTime', {
                headers: { token: `Bearer ${accessToken}` }
            });
            setAvgRepairTime(response.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getAvgMaintenanceTime = async () => {
        try {
            const response = await api.get('/device/dashboard/avgMaintenanceTime', {
                headers: { token: `Bearer ${accessToken}` }
            });
            setAvgMaintenanceTime(response.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getRepairMaintenanceCost = async () => {
        try {
            const response = await api.get('/device/dashboard/repairMaintenanceCost', {
                headers: { token: `Bearer ${accessToken}` }
            });
            setRepairMaintenanceCost(response.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    const getPurchaseCost = async () => {
        try {
            const response = await api.get('/device/dashboard/purchaseCost', {
                headers: { token: `Bearer ${accessToken}` }
            });
            setPurchaseCost(response.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getNumDeviceByStatus();
        getClassifyDevice();
        getClassifyUsageRequest();
        getClassifyFaultRepair();
        getClassifyPurchaseRequest();
        getUptime();
        getMTBF();
        getAgeFailureRate();
        getPeriodicMaintenanceRatio();
        getAvgRepairTime();
        getAvgMaintenanceTime();
        getRepairMaintenanceCost();
        getPurchaseCost();
    }, []);

    useEffect(() => {
        getNumDeviceByMonth();
    }, [yearNumDeviceByMonth]);

    useEffect(() => {
        getOverviewByMonth();
    }, [yearOverviewByMonth]);

    useEffect(() => {
        getCostBreakdownByMonth();
    }, [yearCostBreakdownByMonth]);

    return (
        <>
            <div className="dashboard-page">
                <h2 className="name-page">Dashboard thiết bị y tế</h2>
                <div className="content-container">
                    <div className="num-device-by-status-container">
                        <div className="num-device-by-status-element" style={{ backgroundColor: 'rgba(53, 4, 180, 0.7)' }}>
                            <div className="left-element">
                                <p className="label">Tổng Số Thiết Bị</p>
                                <p className="quantity">{totalDevice}</p>
                            </div>
                            <div className="right-element">
                                <FontAwesomeIcon className="icon" icon={faStethoscope} />
                            </div>
                        </div>
                        <div className="num-device-by-status-element" style={{ backgroundColor: 'rgba(10, 188, 10, 0.7)' }}>
                            <div>
                                <p className="label">Sẵn Sàng Sử Dụng</p>
                                <p className="quantity">{availableDevice}</p>
                            </div>
                            <div>
                                <FontAwesomeIcon className="icon" icon={faCheckToSlot} />
                            </div>
                        </div>
                        <div className="num-device-by-status-element" style={{ backgroundColor: 'rgba(35, 137, 192, 0.7)' }}>
                            <div className="left-element">
                                <p className="label">Đang Sử Dụng</p>
                                <p className="quantity">{usingDevice}</p>
                            </div>
                            <div className="right-element">
                                <FontAwesomeIcon className="icon" icon={faHospitalUser} />
                            </div>
                        </div>
                        <div className="num-device-by-status-element" style={{ backgroundColor: 'rgba(239, 10, 10, 0.7)' }}>
                            <div className="left-element">
                                <p className="label">Hỏng Hóc</p>
                                <p className="quantity">{failureDevice}</p>
                            </div>
                            <div className="right-element">
                                <FontAwesomeIcon className="icon" icon={faHeartBroken} />
                            </div>
                        </div>
                        <div className="num-device-by-status-element" style={{ backgroundColor: 'rgba(238, 160, 5, 0.7)' }}>
                            <div className="left-element">
                                <p className="label">Sửa Chữa, Bảo Trì</p>
                                <p className="quantity">{maintenanceDevice}</p>
                            </div>
                            <div className="right-element">
                                <FontAwesomeIcon className="icon" icon={faScrewdriverWrench} />
                            </div>
                        </div>
                    </div>
                    <div className="number-device-chart">
                        <div className="classify">
                            <h3>Phân loại thiết bị</h3>
                            <PieChartClassifyDevice data={classify} total={totalDevice} />
                            <div className="total-num-device">
                                <span className="quantity">{totalDevice}</span>
                                <span className="label">thiết bị</span>
                            </div>
                        </div>
                        <div className="num-device-by-month">
                            <div className="top-container">
                                <div><h3>Số thiết bị nhập theo tháng</h3></div>
                                <div className="select-year">
                                    <div onClick={() => setDropdownYearNumDeviceByMonth(!dropdownYearNumDeviceByMonth)} className="selected-year">
                                        Năm {yearNumDeviceByMonth}
                                        <span><FontAwesomeIcon className="icon" icon={faCaretDown} /></span>
                                    </div>
                                    {dropdownYearNumDeviceByMonth && (
                                    <div className="list-year">
                                    {yearToSelectFrom2021.map((year,index) => (
                                        <div key={index} onClick={() => selectYear(year, setYearNumDeviceByMonth, setDropdownYearNumDeviceByMonth)}
                                        className={year === yearNumDeviceByMonth ? 'selected' : ''}>
                                            Năm {year}
                                        </div>
                                    ))}
                                    </div>
                                    )}
                                </div>
                            </div>
                            <div className="bar-chart"><BarChartNumOfDevice data={dataDeviceByMonth} /></div>
                        </div>
                    </div>
                    <div className="overview-statistic">
                        <div className="top-container">
                            <div><h3>Thống kê tổng quan theo tháng</h3></div>
                            <div className="select-year">
                                <div onClick={() => setDropdownYearOverviewByMonth(!dropdownYearOverviewByMonth)} className="selected-year">
                                    Năm {yearOverviewByMonth}
                                    <span><FontAwesomeIcon className="icon" icon={faCaretDown} /></span>
                                </div>
                                {dropdownYearOverviewByMonth && (
                                <div className="list-year">
                                {yearToSelectFrom2022.map((year,index) => (
                                    <div key={index} onClick={() => selectYear(year, setYearOverviewByMonth, setDropdownYearOverviewByMonth)}
                                    className={year === yearOverviewByMonth ? 'selected' : ''}>
                                        Năm {year}
                                    </div>
                                ))}
                                </div>
                                )}
                            </div>
                        </div>
                        <div className="bar-chart"><BarChartOverview data={dataOverviewByMonth} /></div>
                    </div>
                    <div className="metrics-inventory">
                        <div className="metrics-container">
                            <div className="row">
                                <div className="metric-element">
                                    <div className="label" title="Tỷ lệ thời gian hoạt động">Uptime</div>
                                    <div className="result">{uptime}%</div>
                                </div>
                                <div className="metric-element">
                                    <div className="label" title="Thời gian trung bình giữa các lần hỏng">MTBF</div>
                                    <div className="result">{mtbf}</div>
                                    <div className="unit">hours</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="metric-element">
                                    <div className="label">Age Failure Rate</div>
                                    <div className="result">{ageFailureRate}%</div>
                                </div>
                                <div className="metric-element">
                                    <div className="label">Periodic Maintenance</div>
                                    <div className="result">{periodicMaintenanceRatio}%</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="metric-element">
                                    <div className="label">Average Repair Time</div>
                                    <div className="result">{avgRepairTime}</div>
                                    <div className="unit">days</div>
                                </div>
                                <div className="metric-element">
                                    <div className="label">Average Maintenance Time</div>
                                    <div className="result">{avgMaintenanceTime}</div>
                                    <div className="unit">days</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="metric-element">
                                    <div className="label">Total Breakdown Cost</div>
                                    <div className="result">{repairMaintenanceCost}M</div>
                                    <div className="unit">VND</div>
                                </div>
                                <div className="metric-element">
                                    <div className="label">Total Purchase Cost</div>
                                    <div className="result">{purchaseCost}M</div>
                                    <div className="unit">VND</div>
                                </div>
                            </div>
                        </div>
                        <div className="cost-breakdown-chart">
                            <div className="top-container">
                                <div><h3>Chi phí sửa chữa, bảo trì thiết bị</h3></div>
                                <div className="select-year">
                                    <div onClick={() => setDropdownCostBreakdownByMonth(!dropdownCostBreakdownByMonth)} className="selected-year">
                                        Năm {yearCostBreakdownByMonth}
                                        <span><FontAwesomeIcon className="icon" icon={faCaretDown} /></span>
                                    </div>
                                    {dropdownCostBreakdownByMonth && (
                                    <div className="list-year">
                                    {yearToSelectFrom2022.map((year,index) => (
                                        <div key={index} onClick={() => selectYear(year, setYearCostBreakdownByMonth, setDropdownCostBreakdownByMonth)}
                                        className={year === yearCostBreakdownByMonth ? 'selected' : ''}>
                                            Năm {year}
                                        </div>
                                    ))}
                                    </div>
                                    )}
                                </div>
                            </div>
                            <div className="line-chart"><LineChartInventory data={dataCostBreakdownByMonth} /></div>
                        </div>
                    </div>    
                    <div className="three-pie-chart">
                        <div className="element">
                            <h3>Yêu cầu sử dụng</h3>
                            <PieChartRequest data={dataUsageRequest} total={totalUsageRequest} />
                            <div className="element-info total-usage-request">
                                <span className="quantity">{totalUsageRequest}</span>
                                <span className="label">yêu cầu</span>
                            </div>
                        </div>
                        <div className="element">
                            <h3>Quyết định sửa chữa</h3>
                            <PieChartRequest data={dataFaultRepair} total={totalFaultRepair} />
                            <div className="element-info total-fault-repair">
                                <span className="quantity">{totalFaultRepair}</span>
                                <span className="label">hỏng hóc</span>
                            </div>
                        </div>
                        <div className="element">
                            <h3>Yêu cầu mua sắm</h3>
                            <PieChartRequest data={dataPurchaseRequest} total={totalPurchaseRequest} />
                            <div className="element-info total-purchase-request">
                                <span className="quantity">{totalPurchaseRequest}</span>
                                <span className="label">yêu cầu</span>
                            </div>
                        </div>
                    </div>               
                </div>
            </div>
        </>
    );
}

export default DashboardPage;