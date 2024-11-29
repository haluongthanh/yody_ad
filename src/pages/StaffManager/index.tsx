import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowAltCircleRight, faArrowCircleLeft, faPlus} from "@fortawesome/free-solid-svg-icons";
import {fetchGet} from "../../services/CallApi.ts";
import {Link} from "react-router-dom";

function Index() {
    const [staffs, setStaffs] = useState([]);
    const [roles] = useState<any>([
        {
            id: 1,
            name: 'Quản trị viên'
        },
        {
            id: 2,
            name: 'Nhân viên'
        }, {
            id: 3,
            name: 'Nhân viên kho'
        }, {
            id: 4,
            name: 'Nhân viên giao hàng'
        },
        {
            id: 5,
            name: 'Nhân viên chăm sóc khách hàng'
        },
        {
            id: 6,
            name: 'Nhân viên nhận đơn'
        },
    ]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [search, setSearch] = useState('');

    function getStaffs() {
        fetchGet(`/admin/staff?page=${page}&pageSize=${pageSize}&search=${search}`).then((data) => {
            setStaffs(data.data);
        });
    }

    useEffect(() => {
        getStaffs();
    }, [page, search]);

    return (
        <div className="container mx-auto p-5">
            <p className="text-2xl font-semibold text-center mb-6">Nhân viên</p>
            <div className="overflow-x-auto">
                <div className="d-flex justify-between">
                    <div>
                        <Link to={`/staff/form/0`} className="btn btn-primary gap-2">
                            <FontAwesomeIcon icon={faPlus}/>

                        </Link>
                    </div>
                    <div className="mb-3">
                        <input className="form-control" placeholder={"Tìm kiếm"} value={search} onChange={(e) => {
                            setSearch(e.target.value)
                        }}/>
                    </div>
                </div>
                <table className="table w-full border-collapse border border-gray-200 shadow-lg">
                    <thead className="bg-black text-white">
                    <tr>
                        <th className="p-3 border border-gray-300">STT</th>
                        <th className="p-3 border border-gray-300">Avatar</th>
                        <th className="p-3 border border-gray-300">Tài khoản</th>
                        <th className="p-3 border border-gray-300">Tên nhân viên</th>
                        <th className="p-3 border border-gray-300">Chức vụ</th>
                        <th className="p-3 border border-gray-300">Địa chỉ</th>
                        <th className="p-3 border border-gray-300">Ngày tạo</th>
                        <th className="p-3 border border-gray-300">Trạng thái</th>
                        <th className="p-3 border border-gray-300">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {staffs && staffs.map((staff: any, index) => (
                        <tr key={staff.id} className="hover:bg-gray-100">
                            <td className="p-3 border border-gray-300 text-center">{index + 1}</td>
                            <td className="p-3 border border-gray-300 text-center">
                                <img src={staff.avatar} alt="avatar" className="w-12 h-12 rounded-full mx-auto"/>
                            </td>
                            <td className="p-3 border border-gray-300 text-center">{staff.user_name}</td>
                            <td className="p-3 border border-gray-300">{staff.full_name}</td>
                            <td className="p-3 border border-gray-300 text-center">
                                {roles.find((role: any) => role.id === staff.role_id)?.name}
                            </td>
                            <td className="p-3 border border-gray-300">{staff.address}</td>
                            <td className="p-3 border border-gray-300 text-center">{staff.created_time}</td>
                            <td
                                className={`p-3 border border-gray-300 text-center font-semibold ${
                                    staff.active === 1 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {staff.active === 1 ? 'Hoạt động' : 'Dừng hoạt động'}
                            </td>
                            <td className="p-3 border border-gray-300 text-center">
                                <Link to={`/staff/form/${staff.id}`} className="text-blue-500 hover:underline">
                                    Chi tiết
                                </Link>
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
        </div>
    );
}

export default Index;
