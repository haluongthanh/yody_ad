import {useEffect, useState} from "react";
import {fetchGet} from "../../services/CallApi.ts";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPenToSquare, faTrashAlt, faPlus} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import {useNavigate} from "react-router-dom";
import {CategoryType} from '../../types/category.ts'


function Category() {

    const [category, setCategory] = useState<CategoryType[]>([]);
    const navigate = useNavigate()

    const handleEdit = (id: number) => {
        navigate("/product/category/" + id)
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa',
            text: "Không thể khôi phục sau khi xóa",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            cancelButtonText: "Hủy",
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Xóa'
        }).then((result) => {
            if (result.isConfirmed) {

                fetchGet(`/admin/category/delete/${id}`).then(() => {
                    setCategory(category.filter(item => item.id !== id));
                    Swal.fire(
                        '',
                        'Thành công.',
                        'success'
                    );
                }).catch(() => {
                    Swal.fire(
                        '',
                        'Thất bại.',
                        'error'
                    );
                });
            }
        })
            .finally(() => {
                fetchGet("/admin/category").then((res) => {
                    setCategory(res);
                });
            })
    };


    useEffect(() => {
        fetchGet("/admin/category").then((res) => {
            setCategory(res);
        });
    }, []);

    return (
        <div className='m-auto px-4 py-8 shadow-lg'>
            <div className='flex justify-between mb-4'>
                <h1 className='text-3xl font-bold'>Danh sách danh mục</h1>
                <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-full inline-flex items-center group"
                    title="Thêm danh mục"
                    onClick={() => navigate("/product/category/0")}
                >
                    <FontAwesomeIcon icon={faPlus} className=""/>

                </button>
            </div>
            <table className="min-w-full bg-white border border-gray-300 table-auto">
                <thead>
                <tr className="border-b">
                    <th className="py-2 px-4 border-r">STT</th>
                    <th className="py-2 px-4 border-r">Tên danh mục</th>
                    <th className="py-2 px-4 border-r">Slug</th>
                    <th className="py-2 px-4"></th>
                </tr>
                </thead>
                <tbody>
                {category && category.map((item) => (
                    <tr key={item.id} className="border-b">
                        <td className="py-2 px-4 border-r">{item.id}</td>
                        <td className="py-2 px-4 border-r">{item.name}</td>
                        <td className="py-2 px-4 border-r">{item.slug}</td>
                        <td className="py-2 px-4">
                            <button className="mr-2 text-blue-500 hover:text-blue-700"
                                    onClick={() => handleEdit(item.id)}>
                                <FontAwesomeIcon icon={faPenToSquare} className="h-5 w-5"/>
                            </button>
                            <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(item.id)}>
                                <FontAwesomeIcon icon={faTrashAlt} className="h-5 w-5"/>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Category;