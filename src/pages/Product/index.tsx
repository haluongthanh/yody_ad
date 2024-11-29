import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {product} from '../../types/product'
import {
    faPenToSquare,
    faTrashAlt,
    faPlus,
    faArrowCircleLeft,
    faArrowAltCircleRight
} from '@fortawesome/free-solid-svg-icons';
import {fetchGet} from '../../services/CallApi';
import Swal from "sweetalert2";

function Index() {

    const navigate = useNavigate();
    const [products, setProducts] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState<string>('');

    const fetchProducts = () => {
        fetchGet(`/admin/product?page=${currentPage}&pageSize=12&search=${search}`).then(res => {
            if (res != null) {
                let list_data: product[] = []
                res.forEach((item: any) => {
                    list_data.push(item);
                });
                setProducts(list_data);
            }
        }).catch(error => {
            console.error("Error fetching products:", error);
        });
    };

    const handleEdit = (id: number) => {
        navigate("/product/edit/" + id);
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa?',
            text: "Dữ liệu sẽ không thể khôi phục!",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            cancelButtonText: "Hủy",
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Xóa'
        }).then((result) => {
            if (result.isConfirmed) {
                fetchGet('/admin/product/delete?id=' + id)
                    .then(() => {
                        fetchProducts();
                    });
            }
        });
    };

    useEffect(() => {
        console.log("currentPage", currentPage);
        console.log("search", search);
        fetchProducts();
    }, [currentPage, search]);

    return (
        <div className="container mx-auto px-4 py-8 shadow-lg">
            <div className="flex justify-between items-center mb-6 pb-3 border-b">
                <h1 className="text-3xl font-bold">Danh sách sản phẩm</h1>
                <Link
                    to="/product/form"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-full inline-flex items-center group"
                    title="Thêm sản phẩm"
                >
                    <FontAwesomeIcon icon={faPlus} className=""/>
                </Link>
            </div>
            <div className="container d-flex justify-end my-2 mb-4">
                <div className="form-group">
                    <input className="form-control" type="text" placeholder="Tìm kiếm" value={search} onChange={(e)=>setSearch(e.target.value)}/>
                </div>
            </div>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                <tr className="bg-gray-100 border-b">
                    <th className="py-2 px-4 border-r">STT</th>
                    <th className="py-2 px-4 border-r">Tên sản phẩm</th>
                    <th className="py-2 px-4 border-r"></th>
                    <th className="py-2 px-4 border-r">Số danh mục</th>
                    <th className="py-2 px-4 border-r">Số biến thể</th>
                    <th className="py-2 px-4 border-r">Giá</th>
                    <th className="py-2 px-4">Hành động</th>
                </tr>
                </thead>
                <tbody>
                {products && products.map((item, index) => (
                    <tr key={item.Product.id.toString()} className="border-b cursor-pointer">
                        <td className="py-2 px-4 border-r">{index +1 }</td>
                        <td className="py-2 px-4 border-r">{item.Product.name}</td>
                        <td className="py-2 px-4 border-r">
                            <img src={`https://api.yody.lokid.xyz${item.Images[0].link}`} alt={item.Images[0].link} className="w-10 h-10"/>
                        </td>
                        <td className="py-2 px-4 border-r">{item.Category.length}</td>
                        <td className="py-2 px-4 border-r">{item.Variants.length}</td>
                        <td className="py-2 px-4 border-r">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.Product.price)}
                        </td>

                        <td className="py-2 px-4">
                            <button onClick={() => handleEdit(item.Product.id)}
                                    className="text-blue-500 hover:text-blue-700 mr-2">
                                <FontAwesomeIcon icon={faPenToSquare}/>
                            </button>
                            <button onClick={() => handleDelete(item.Product.id)} className="text-red-500 hover:text-red-700">
                                <FontAwesomeIcon icon={faTrashAlt}/>
                            </button>
                        </td>
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
    );
}

export default Index;