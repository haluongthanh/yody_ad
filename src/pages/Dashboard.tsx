import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import {useEffect, useState} from "react";
import {fetchGet} from "../services/CallApi.ts";

ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard = () => {
    const stats = [
        { label: "Đang chờ", value: 0, color: "#4e4802" },
        { label: "Đang giao", value: 0, color: "#67811a" },
        { label: "Huỷ", value: 0, color: "#8f0202" },
        { label: "Thành công", value: 0, color: "#2d6802" },
    ];

     const [ordersCount, setOrdersCount] = useState<any[]>(stats);
     const [orderCountPerMonth, setOrderCountPerMonth] = useState<any[]>([50, 70, 90, 100, 120, 80, 110, 95, 85, 130, 150, 140]);
     const [orderRevanue, setOrderRevanue] = useState<any[]>([50, 70, 90, 100, 120, 80, 110, 95, 85, 130, 150, 140]);

    const ordersData = {
        labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
        datasets: [
            {
                label: "Số đơn hàng",
                data: orderCountPerMonth,
                backgroundColor: "#67811a",
            },
        ],
    };

    const revenueData = {
        labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
        datasets: [
            {
                label: "Doanh thu (triệu đồng)",
                data: orderRevanue,
                borderColor: "#4e4802",
                backgroundColor: "rgba(78, 72, 2, 0.2)",
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    async function fetchData() {
        let pending_order = fetchGet(
            '/admin/order/order_count_by_status?status=pending',
        );
        let shipping_order = fetchGet(
            '/admin/order/order_count_by_status?status=shipping',
        );
        let success_order = fetchGet(
            '/admin/order/order_count_by_status?status=success',
        );
        let canceled_order = fetchGet(
            '/admin/order/order_count_by_status?status=cancel',
        );

        const [pendingResponse, shippingResponse, successResponse, canceledResponse] =
            await Promise.all([pending_order, shipping_order, success_order, canceled_order]);
        const pendingCount = pendingResponse || 0;
        const shippingCount = shippingResponse || 0;
        const successCount = successResponse || 0;
        const canceledCount = canceledResponse || 0;
        setOrdersCount([
            { label: "Đang chờ", value: pendingCount, color: "#4e4802" },
            { label: "Đang giao", value: shippingCount, color: "#67811a" },
            { label: "Huỷ", value: canceledCount, color: "#8f0202" },
            { label: "Thành công", value: successCount, color: "#2d6802" },
        ])
    }

    useEffect(() => {
        fetchData()
        fetchGet('/admin/order/order_count_per_month').then((data) => {
            setOrderCountPerMonth(data);
        });
        fetchGet('/admin/order/revenue_per_month').then((data) => {
            setOrderRevanue(data);
        })
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            {/* Các ô trạng thái */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                {ordersCount.map((stat, index) => (
                    <div
                        key={index}
                        style={{
                            flex: 1,
                            margin: "0 10px",
                            padding: "20px",
                            backgroundColor: stat.color,
                            color: "#fff",
                            borderRadius: "8px",
                            textAlign: "center",
                        }}
                    >
                        <h3>{stat.label}</h3>
                        <p style={{ fontSize: "24px", fontWeight: "bold" }}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Biểu đồ */}
            <div style={{ display: "flex", gap: "20px" }}>
                {/* Biểu đồ Bar */}
                <div style={{ flex: 1 }}>
                    <h3>Số đơn hàng theo tháng</h3>
                    <div style={{ height: "300px" }}>
                        <Bar data={ordersData} options={chartOptions} />
                    </div>
                </div>

                {/* Biểu đồ Line */}
                <div style={{ flex: 1 }}>
                    <h3>Doanh thu theo tháng</h3>
                    <div style={{ height: "300px" }}>
                        <Line data={revenueData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
