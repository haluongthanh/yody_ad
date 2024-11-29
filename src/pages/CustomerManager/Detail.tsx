import  {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {fetchGet, fetchPostForm} from "../../services/CallApi.ts";

function Detail() {
    const {id} = useParams();
    const [customer, setCustomer] = useState<any>({});
    const [orders, setOrders] = useState<any[]>([]);


    function CallCustomer(id: string | undefined) {
        fetchGet(`/admin/customer/${id}`)
            .then((res) => {
                setCustomer(res);
            })
            .catch((error) => {
                console.error("Error fetching customer:", error);
            });
    }

    const HandleUpdate = (key: string, value:any) => {

        let data = new FormData()
        data.append("key", key)
        data.append("value", value)
        data.append('id', Number(id).toString())

        fetchPostForm(`/admin/customer/update`, data)
            .then(() => {
                CallCustomer(id);
            })
            .catch((error) => {
                console.error("Error fetching customer:", error);
            });

    }

    useEffect(() => {

        CallCustomer(id);

        fetchGet(`/admin/customer/get_order/${id}`)
            .then((res) => {
                setOrders(res);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
            });

    }, [id]);

    return (
        <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
            <div className="flex flex-col md:flex-row gap-4">

                <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-md">
                    <p className="h4 text-center">Thông tin khách hàng</p>
                    <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
                        <div className="w-full">
                            <table className="table table-bordered">
                                <tbody>
                                <tr>
                                    <th>Tên đăng nhập</th>
                                    <td className="py-3">{customer.user_name}</td>
                                </tr>
                                <tr>
                                    <th>Địa chỉ</th>
                                    <td className="py-3">{customer.address || "Chưa có thông tin"}</td>
                                </tr>
                                <tr>
                                    <th>Số điện thoại</th>
                                    <td className="py-3">{customer.phone_number}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td className="py-3">{customer.email}</td>
                                </tr>
                                <tr>
                                    <th>Trạng thái</th>
                                    <td className="py-3">
                                        <span className="m-2" style={{cursor: "pointer"}}
                                              onClick={() => HandleUpdate('active', customer.active == 1 ? 0 : 1)}>
                                            {customer.active ? <span
                                                    className="pointer-events-auto bg-green-500 text-white p-2 rounded-2xl">Hoạt động</span> :
                                                <span className="bg-red-500 text-white p-1 rounded-2xl">Khóa</span>}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Ngày tham gia</th>
                                    <td className="py-3">{new Date(customer.created_time).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <th></th>
                                    <td className="py-3">
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>


                <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-md">
                    <p className="text-center h4">Danh sách đơn hàng đã mua</p>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Mã đơn hàng</th>
                            <th>Ngày mua</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders && orders.map((order, index) => (
                            <tr key={index}>
                                <td className="py-3">{order.order_code}</td>
                                <td className="py-3">{new Date(order.order_date).toLocaleString()}</td>
                                <td className="py-3">{order.total_amount}</td>
                                <td className="py-3">
                                    <Link to={`/order/${order.id}`}>
                                        {(() => {
                                            switch (order.status) {
                                                case 'pending':
                                                    return <span
                                                        className="rounded-2xl text-white bg-yellow-500 p-2 ">Đang chờ</span>;
                                                case 'confirm':
                                                    return <span
                                                        className="rounded-2xl text-white bg-yellow-500 p-2 ">Đã xác nhận đơn</span>;
                                                case 'shipping':
                                                    return <span
                                                        className="cursor-pointer rounded-2xl text-white bg-blue-500 p-2 hover:underline">Vận chuyển</span>;
                                                case 'cancel':
                                                    return <span
                                                        className="cursor-pointer rounded-2xl text-white bg-red-500 p-2 hover:underline">Huỷ đơn</span>;
                                                case 'success':
                                                    return <span
                                                        className="rounded-2xl text-white bg-green-500 p-2 ">Đã giao</span>;
                                                case 'refund':
                                                    return <span
                                                        className="rounded-2xl text-white bg-green-500 p-2 ">Đã hoàn tiền</span>;
                                                default:
                                                    return <span className="rounded-2xl text-white bg-red-500 p-2 ">Không rõ</span>;
                                            }
                                        })()}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Detail;
