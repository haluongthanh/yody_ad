import {useEffect, useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowCircleLeft, faArrowAltCircleRight} from '@fortawesome/free-solid-svg-icons';
import {fetchGet} from "../../services/CallApi.ts";
import {useNavigate} from "react-router-dom";

function Index() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const navigate = useNavigate();

    const fetchCustomers = () => {
        fetchGet(`/admin/customer?page=${currentPage}&pageSize=${pageSize}&search=${search}`)
            .then((res) => {
                setCustomers(res);
            })
            .catch((error) => {
                console.error("Error fetching customers:", error);
            });
    };

    const GoToUser = (id:any)=> {
        navigate(`/customer/${id}`);
    }

    useEffect(() => {
        fetchCustomers();
    }, [currentPage, search]);

    return (
        <div className="container-fluid p-11 shadow-lg shadow-cyan-500/50">
            <h1 className="p-2 text-2xl font-bold">Khách hàng</h1>
            <hr/>
            <div className="container">
                <div className="flex justify-end my-2">
                    <div>
                        <input type="text" placeholder="Tìm kiếm" className="form-control" value={search} onChange={(e)=>setSearch(e.target.value)}/>
                    </div>
                </div>
                <table className="table-auto w-full border-collapse border border-gray-300 table-hover">
                    <thead>
                    <tr className="hover:bg-gray-100 bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2 text-left">STT</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Avatar</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Tên khách hàng</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Số điện thoại</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Địa chỉ</th>
                    </tr>
                    </thead>
                    <tbody>
                    {customers && customers.map((customer:any, index) => (
                        <tr key={index} className="hover:bg-gray-100 cursor-pointer" onClick={()=>GoToUser(customer.id)}>
                            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {customer.avatar &&
                                <img src={customer.avatar} alt="" className="w-10 h-10"/>
                                }
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{customer.full_name}</td>
                            <td className="border border-gray-300 px-4 py-2">{customer.email}</td>
                            <td className="border border-gray-300 px-4 py-2">{customer.phone_number}</td>
                            <td className="border border-gray-300 px-4 py-2">{customer.address}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="container d-flex justify-end gap-3 my-2">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="btn btn-primary"
                        disabled={currentPage === 1}
                    >
                        <FontAwesomeIcon icon={faArrowCircleLeft}/>
                    </button>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="btn btn-primary"
                    >
                        <FontAwesomeIcon icon={faArrowAltCircleRight}/>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Index;
