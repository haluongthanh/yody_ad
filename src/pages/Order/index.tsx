import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import moment from "moment";
import {IOrder} from "../../types/order.ts";
import {fetchGet} from "../../services/CallApi.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowAltCircleRight, faArrowCircleLeft} from "@fortawesome/free-solid-svg-icons";

function Index() {

    const adminInfo = JSON.parse(localStorage.getItem('admin') || '{}');
    const roleAmin = adminInfo.role_id;

    let status_default = '';
    if (roleAmin === 3) status_default = 'confirm'; // Nhân viên kho
    if (roleAmin === 4) status_default = 'shipping'; // Nhân viên ship
    if (roleAmin === 5) status_default = 'cancel'; // Nhân viên CSK
    if (roleAmin === 6) status_default = 'pending'; // Nhân viên xác nhận đơn

    const currentDate = moment();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [status, setStatus] = useState<string>(status_default);
    const [fromDate, setFromDate] = useState<string>(currentDate.clone().subtract(3, 'days').format("YYYY-MM-DD"));
    const [toDate, setToDate] = useState<string>(currentDate.clone().add(1, 'days').format("YYYY-MM-DD"));

    const navigateToTracking = (order: IOrder) => {
        navigate(`/order/${order.id}`);
    };

    const getOrders = () => {
        fetchGet(`/admin/order?page=${page}&pageSize=${pageSize}&status=${status}&fromDate=${fromDate}&toDate=${toDate}`)
            .then((res) => {
                setOrders(res);
            });
    };

    useEffect(() => {
        if (fromDate > toDate) {
            setToDate(fromDate);
        }
        getOrders();
    }, [page, status, toDate]);

    const statusOptions = [
        {value: '', label: 'Tất cả'},
        {value: 'pending', label: 'Đang chờ'},
        {value: 'confirm', label: 'Đã xác nhận'},
        {value: 'shipping', label: 'Đang giao'},
        {value: 'cancel', label: 'Huỷ'},
        {value: 'refund', label: 'Hoàn tiền'},
        {value: 'success', label: 'Đã giao'},
    ];

    return (
        <div className="container-fluid p-11 shadow-lg shadow-cyan-500/50">
            <h1 className="p-2 text-2xl font-bold">Đơn hàng</h1>
            <hr/>
            {/* Thanh trạng thái */}
            <div className="container flex gap-3 my-4">
                <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap d-flex items-center">Từ ngày</label>
                    <input className="form-control border rounded px-3 py-1" type="date"
                           value={fromDate} onChange={e => setFromDate(e.target.value)}/>
                </div>
                <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap d-flex items-center">Đến ngày</label>
                    <input className="form-control border rounded px-3 py-1" type="date"
                           value={toDate} onChange={e => setToDate(e.target.value)}/>
                </div>
            </div>

            {roleAmin === 1 && <div className="flex justify-start gap-2 mb-4">
                {statusOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setStatus(option.value)}
                        className={`px-4 py-2 border rounded ${
                            status === option.value
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
            }

            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                <tr className="hover:bg-gray-100 bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 text-left">STT</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Khách hàng</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Mã đơn hàng</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Địa chỉ giao hàng</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Ngày đặt hàng</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Tổng tiền</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Trạng thái</th>
                </tr>
                </thead>
                <tbody>
                {orders && orders.map((order: IOrder, index: number) => (
                    <tr key={order.id.toString()} className="border-b cursor-pointer"
                        onClick={() => navigateToTracking(order)}>
                        <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                        <td className="border border-gray-300 px-4 py-3">{order.customer_name}</td>
                        <td className="border border-gray-300 px-4 py-3">{order.order_code}</td>
                        <td className="border border-gray-300 px-4 py-3">{order.shipping_address}</td>
                        <td className="border border-gray-300 px-4 py-3">{order.order_date.toString().split("T")[0]}</td>
                        <td className="border border-gray-300 px-4 py-3">
                                {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(order.total_amount)}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                            {(() => {
                                switch (order.status) {
                                    case 'pending':
                                        return <span
                                            className="rounded-2xl text-white bg-yellow-500 p-2">Đang chờ</span>;
                                    case 'confirm':
                                        return <span className="rounded-2xl text-white bg-yellow-500 p-2">Đã xác nhận đơn</span>;
                                    case 'shipping':
                                        return <span className="rounded-2xl text-white bg-blue-500 p-2 hover:underline">Vận chuyển</span>;
                                    case 'cancel':
                                        return <span className="rounded-2xl text-white bg-red-500 p-2 hover:underline">Huỷ đơn</span>;
                                    case 'success':
                                        return <span className="rounded-2xl text-white bg-green-500 p-2">Đã giao</span>;
                                    case 'refund':
                                        return <span
                                            className="rounded-2xl text-white bg-green-500 p-2">Đã hoàn tiền</span>;
                                    default:
                                        return <span className="rounded-2xl text-white bg-red-500 p-2">Không rõ</span>;
                                }
                            })()}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="d-flex justify-end gap-2 mt-5">
                <button className="btn btn-primary" onClick={() => setPage(page - 1)}>
                    <FontAwesomeIcon icon={faArrowCircleLeft}/>
                </button>
                <button className="btn btn-primary" onClick={() => setPage(page + 1)}>
                    <FontAwesomeIcon icon={faArrowAltCircleRight}/>
                </button>
            </div>
        </div>
    );
}

export default Index;
