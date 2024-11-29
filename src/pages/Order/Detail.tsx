import {useNavigate, useParams} from 'react-router-dom';
import {fetchGet, fetchPost} from '../../services/CallApi';
import {useState, useEffect} from 'react';
import Swal from "sweetalert2";

function Detail() {
    const adminInfo = JSON.parse(localStorage.getItem('admin') || '{}');

    const roleAmin = adminInfo.role_id;
    const fullName = adminInfo.full_name;

    const {id} = useParams();
    const [color, setColor] = useState<any | null>(null);
    const [isHuy, setIsHuy] = useState<boolean>(false);
    const [lyDoHuy, setLyDoHuy] = useState<string>('');
    const [size, setSize] = useState<any | null>(null);
    const [order, setOrder] = useState<any | null>(null);
    const [orderDetail, setOrderDetail] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [trackingData, setTrackingData] = useState<any | null>([])
    const navigate = useNavigate();


    const [tracking, setTracking] = useState<any | null>({
        "order_id": Number(id),
        "warehouse_id": 1,
        "location": "",
        "carrier": "",
    });

    // @ts-ignore
    const HandleTracking = (key: string, value: string) => {
        setTracking({
            ...tracking,
            [key]: value,
        });
    }

    const UpdateStatus = (status: string) => {
        // @ts-ignore
        fetchPost(`/admin/order/update_status`, {
            "order_id": Number(id),
            "status": status,
            "carrier": fullName
        })
            .then(() => {

                let stringStatus = '';

                if (status === 'shipping') {
                    stringStatus = 'chuyển sang trạng thái vận chuyển';
                }
                if (status === 'success') {
                    stringStatus = 'chuyển sang đã giao hàng';
                }

                if (status === 'cancel') {
                    stringStatus = 'huỷ đơn hàng';
                }
                if (status === 'refund') {
                    stringStatus = 'hoàn tiền';
                }
                if (status === 'confirm') {
                    stringStatus = 'xác nhận đơn hàng';
                }

                Swal.fire({
                    title: 'Thành công',
                    text: `Đã ${stringStatus}`,
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false
                })
                    .then(() => {
                        navigate('/order');
                        setOrder({
                            ...order,
                            status: status,
                        });
                    });
            })
            .catch((error) => {
                console.error("Error updating status:", error);
            });
    }

    const fetchTracking = async () => {
        fetchGet(`/order/tracking?order_id=${id}`)
            .then((res) => {
                setTrackingData(res);
                console.log(res);
            })
            .catch((error) => {
                console.error("Error fetching tracking:", error);
            });
    }

    const HandleCancel = () => {
        if (!isHuy) {
            setIsHuy(true)
        } else {
            setTracking({
                ...tracking,
                carrier: "admin",
                location: "Đã huỷ đơn" + "-Lý do huỷ đơn: " + lyDoHuy,
            })
            fetchPost(`/admin/order/tracking`, {
                ...tracking,
                carrier: "admin",
                location: "Đã huỷ đơn" + " - Lý do huỷ đơn: " + lyDoHuy,
            })
                .then(() => {
                    UpdateStatus('cancel');
                })
        }
    }

    useEffect(() => {

        fetchGet(`/color`)
            .then((res) => {
                setColor(res);
            })
            .catch((error) => {
                console.error("Error fetching color:", error);
            });

        fetchGet(`/size`)
            .then((res) => {
                setSize(res);
            })
            .catch((error) => {
                console.error("Error fetching size:", error);
            });

        fetchTracking();

        fetchGet(`/admin/order/detail?id=${id}`)
            .then(async (res) => {
                setOrder(res);
                let orderDetails: any[] = [];
                for (const item of res.order_detail) {
                    try {
                        const r = await fetchGet(`/product/${item.product_id}`);
                        const variant = r.Variants.find((i: { id: any; }) => i.id === item.product_variant_id); // Tìm variant tương ứng
                        let orderDetail = {
                            ...item,
                            product_name: r.Product.name,
                            product_price: r.Product.price,
                            product_image: r.Images,
                            variant: variant || null,
                        };
                        console.log(orderDetail);
                        orderDetails.push(orderDetail);
                    } catch (error) {
                        console.error(`Error fetching product ${item.product_id}:`, error);
                    }
                }

                console.log(orderDetails);
                setOrderDetail(orderDetails);
            })
            .catch((error) => {
                console.error("Error fetching order:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }
    if (!order) {
        return <div className="text-center py-4">Không tìm thấy đơn hàng.</div>;
    }

    return (
        <div className="py-4">
            <div className="shadow-lg p-4 mb-5 mt-2 ">
                <h1 className="text-xl font-bold mb-4 d-flex justify-between">
                    <span> Chi tiết đơn hàng: {order.order_code}</span>
                    <div className="d-flex gap-6">
                        {order.status === 'pending' &&
                            <button className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                                    onClick={() => UpdateStatus('confirm')}>Xác nhận đặt hàng</button>
                        }
                        {order.status === 'confirm' &&
                            <button className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                                    onClick={() => UpdateStatus('shipping')}>Giao hàng</button>
                        }
                        {order.status === 'shipping' &&
                            <button className="bg-green-500 text-white px-3 py-1 rounded-lg"
                                    onClick={() => UpdateStatus('success')}>Giao hàng thành công</button>
                        }
                        {order.status === 'cancel' &&
                            <button className="bg-green-500 text-white px-3 py-1 rounded-lg"
                                    onClick={() => UpdateStatus('refund')}>Đã hoàn tiền</button>
                        }
                        {order.status != 'cancel' && order.status != "success" && order.status != "refund" &&
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg"
                                    onClick={() => HandleCancel()}
                                >
                                    {isHuy ? "Xác nhận huỷ" : "Huỷ đơn"}
                                </button>
                                {isHuy && <input
                                    className="border border-gray-300 px-3 py-1 rounded-lg"
                                    placeholder="Nhập lý do huỷ"
                                    value={lyDoHuy}
                                    onChange={(e) => setLyDoHuy(e.target.value)}
                                />}
                            </div>
                        }
                    </div>

                </h1>
                <div className="flex flex-row gap-70  mb-4">
                    <div>
                        <p>Khách hàng: {order.customer_name}</p>
                        <p>Địa chỉ giao hàng: {order.shipping_address}</p>
                        <p>Ngày đặt hàng: {order.order_date.toString().split("T")[0]}</p>
                        <p>Tổng tiền: {" "}
                            {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(order.total_amount)}
                        </p>
                    </div>

                    <div className="flex items-center -mt-5">
                            <span className="px-10 py-4 rounded-lg">
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
                                            return <span
                                                className="rounded-2xl text-white bg-red-500 p-2 ">Không rõ</span>;
                                    }
                                })()}
                            </span>
                    </div>
                </div>

                <div className="bg-white w-full shadow-lg rounded p-4 mb-6">
                    <p className="font-semibold text-lg text-center mb-2">Sản phẩm</p>
                    <div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-nowrap">Tên sản phẩm</th>
                                <th className="px-4 py-2 text-left text-nowrap">Hình ảnh</th>
                                <th className="px-4 py-2 text-left text-nowrap">Giá</th>
                                <th className="px-4 py-2 text-left text-nowrap">Số lượng</th>
                                <th className="px-4 py-2 text-left text-nowrap">Thành tiền</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {orderDetail && orderDetail.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 text-nowrap">
                                        {item.product_name}
                                        <br/>
                                        <span className="text-gray-500">
                                           Size: {item.variant ? size.find((i: {
                                            id: any;
                                        }) => i.id == item.variant.size_id).name : " không xác định"} --- Màu: {item.variant ? color.find((i: {
                                            id: any;
                                        }) => i.id == item.variant.color_id).name : "không xác định"}
                                        </span>

                                    </td>
                                    <td className="px-4 py-2">
                                        <img
                                            style={{
                                                width: 100,
                                                height: "auto",
                                                objectFit: 'cover',
                                            }}
                                            src={'https://api.yody.lokid.xyz' + item.product_image.find((i: {
                                                color_id: any;
                                            }) => i.color_id == item.variant.color_id).link}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(item.product_price)}
                                    </td>
                                    <td className="px-4 py-2">{item.quantity}</td>
                                    <td className="px-4 py-2">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(item.product_price * item.quantity)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {roleAmin == 1 &&
                    <div className="bg-white w- shadow-lg rounded p-4">
                        <h3 className="font-semibold text-lg text-center">
                            Tracking
                        </h3>
                        <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg my-5">
                            <thead className="bg-gray-200 text-gray-600">
                            <tr>
                                <th className="py-3 px-6 text-left">Nhân viên</th>
                                <th className="py-3 px-6 text-left">Hoạt động</th>
                                <th className="py-3 px-6 text-left">Thời gian</th>
                            </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm ">
                            {trackingData.map((item: any, index: number) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left">{item.carrier}</td>
                                    <td className="py-3 px-6 text-left">{item.location}</td>
                                    <td className="py-3 px-6 text-left">{item.create_time}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </div>
    );
}

export default Detail;
