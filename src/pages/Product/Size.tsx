import {useEffect, useState} from 'react';
import {size} from '../../types/size';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPenToSquare, faTrashAlt, faPlus} from '@fortawesome/free-solid-svg-icons';
import {fetchGet, fetchPost} from '../../services/CallApi';
import Swal from 'sweetalert2';

function Size() {
    const [sizes, setSizes] = useState<size[]>([]);
    const [editingSize, setEditingSize] = useState<size | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        fetchSizes();
    }, []);

    const fetchSizes = () => {
        fetchGet("/admin/size").then(res => {
            setSizes(res);
        });
    };

    const handleEdit = (size: size) => {
        setEditingSize(size);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        Swal.fire({
            title: 'Bạn chắc chắn muốn xóa?',
            text: "Dữ liệu sẽ không thể khôi phục!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa!',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                fetchGet(`/admin/size/delete/${id}`).then(() => {
                    setSizes(sizes.filter(size => size.id !== id));
                    Swal.fire('', 'Thàn công', 'success');
                }).catch(() => {
                    Swal.fire('', 'Thất bại', 'error');
                });
            }
        });
    };

    const handleSave = async () => {
        if (!editingSize?.name) {
            setIsModalOpen(false);
            Swal.fire('Error!', 'Vui lòng nhập tên size', 'error');
            return;
        }
        if (editingSize) {
            let url = `/admin/size/update`;
            if (editingSize.id == 0) {
                url = `/admin/size/create`;
            }
            // @ts-ignore
            fetchPost(url, editingSize).then(() => {
                setIsModalOpen(false);
                fetchSizes();
                Swal.fire('', 'Thành công.', 'success');
            }).catch(() => {
                Swal.fire('', 'Thất bại', 'error');
            });
        }
    };

    return (
        <>
            <div className='m-auto mx-auto px-4 py-8'>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Danh sách size</h1>
                    <button
                        onClick={() => {
                            setEditingSize({id: 0, name: '', status: 1});
                            setIsModalOpen(true);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-full inline-flex items-center group"
                        title="Thêm size"
                    >
                        <FontAwesomeIcon icon={faPlus} className=""/>
                    </button>
                </div>
            </div>
            <table className="min-w-full bg-white border border-gray-300 table-auto">
                <thead>
                <tr className="border-b">
                    <th className="py-2 px-4 border-r">ID</th>
                    <th className="py-2 px-4 border-r">Tên size</th>
                    <th className="py-2 px-4">Thao tác</th>
                </tr>
                </thead>
                <tbody>
                {sizes.map((size: size) => (
                    <tr key={size.id.toString()} className="border-b">
                        <td className="py-2 px-4 border-r">{size.id.toString()}</td>
                        <td className="py-2 px-4 border-r">{size.name}</td>
                        <td className="py-2 px-4">
                            <button onClick={() => handleEdit(size)} className="mr-2 text-blue-500 hover:text-blue-700">
                                <FontAwesomeIcon icon={faPenToSquare}/>
                            </button>
                            <button onClick={() => handleDelete(size.id)} className="text-red-500 hover:text-red-700">
                                <FontAwesomeIcon icon={faTrashAlt}/>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Edit Modal */}
            {isModalOpen && (
                <div
                    className="inset-0 bg-black bg-opacity-10 z-99999 h-full w-full fixed flex items-center justify-center align-middle">
                    <div className="mx-auto p-5 border w-96 shadow-lg rounded-md bg-white -translate-y-50">
                        <h3 className="text-lg font-bold mb-4">Thông tin size</h3>
                        <input
                            type="text"
                            value={editingSize?.name || ''}
                            onChange={(e) => setEditingSize({id: 0, status: 0, ...editingSize, name: e.target.value})}
                            className="w-full p-2 mb-4 border rounded"
                            placeholder="Tên size"
                        />
                        <div className="flex justify-end">
                            <button onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2">Hủy
                            </button>
                            <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Size;
