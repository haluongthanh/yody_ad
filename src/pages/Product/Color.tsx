import {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPenToSquare, faTrashAlt, faPlus} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import {ChromePicker} from 'react-color';
import {fetchGet, fetchPost} from '../../services/CallApi'; // Ensure fetchPost is imported
import {IColor} from '../../types/color';

function Color() {
    const [colors, setColors] = useState<IColor[]>([]);
    const [editingColor, setEditingColor] = useState<IColor | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchColors = () => {
        fetchGet("/admin/color").then(res => {
            setColors(res);
        });
    };

    const handleEdit = (color: IColor) => {
        setEditingColor(color);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
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
                fetchGet(`/admin/color/delete/${id}`).then(() => {
                    setColors(colors.filter(color => color.id !== id));
                    Swal.fire('Thành công!', 'Xóa thành công!', 'success');
                }).catch(() => {
                    Swal.fire('Thất bại', 'Có lỗi xảy ra!', 'error');
                });
            }
        });
    };

    const handleSave = async () => {
        if (editingColor) {

            let url = `/admin/color/update`;
            if (!editingColor.id) {
                url = `/admin/color/create`;
            }

            await fetchPost(url, editingColor).then(() => {
                setColors(colors.map(color => (color.id === editingColor.id ? editingColor : color)));
                Swal.fire('Thành công!', 'Cập nhật màu thành công!', 'success');
                setIsModalOpen(false);
                fetchColors();
            }).catch(() => {
                Swal.fire('Thất bại', 'Có lỗi xảy ra!', 'error');
            });
        }
    };

    useEffect(() => {
        fetchColors();
    }, []);

    // @ts-ignore
    return (
        <>
            <div className='m-auto px-4 py-8'>
                <div className='flex justify-between'>
                    <h1 className='text-3xl font-bold'>Danh sách màu</h1>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-full inline-flex items-center group"
                        onClick={() => {
                            setEditingColor({id: 0, name: '', hex_code: '', status: 1});
                            setIsModalOpen(true);
                        }}
                        title="Thêm màu">
                        <FontAwesomeIcon icon={faPlus}/>

                    </button>
                </div>
            </div>
            <table className="min-w-full bg-white border border-gray-300 table-auto">
                <thead>
                <tr className="border-b">
                    <th className="py-2 px-4 border-r">ID</th>
                    <th className="py-2 px-4 border-r">Tên màu</th>
                    <th className="py-2 px-4 border-r">Mã màu</th>
                    <th className="py-2 px-4">Thao tác</th>
                </tr>
                </thead>
                <tbody>
                {colors.map((color: IColor) => (
                    <tr key={color.id.toString()} className="border-b">
                        <td className="py-2 px-4 border-r">{color.id.toString()}</td>
                        <td className="py-2 px-4 border-r">{color.name}</td>
                        <td className="py-2 px-4 border-r">
                            <div className="flex items-center">
                                <div
                                    className="w-6 h-6 mr-2 border border-gray-300 rounded-full"
                                    style={{backgroundColor: color.hex_code}}
                                ></div>
                                {color.hex_code}
                            </div>
                        </td>
                        <td className="py-2 px-4">
                            <button onClick={() => handleEdit(color)}
                                    className="mr-2 text-blue-500 hover:text-blue-700">
                                <FontAwesomeIcon icon={faPenToSquare}/>
                            </button>
                            <button onClick={() => handleDelete(color.id)} className="text-red-500 hover:text-red-700">
                                <FontAwesomeIcon icon={faTrashAlt}/>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Edit Modal */}
            {isModalOpen && editingColor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="p-5 border shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-bold mb-4">Thông tin màu</h3>
                        <input
                            type="text"
                            value={editingColor.name || ''}
                            onChange={(e) => setEditingColor({...editingColor, name: e.target.value})}
                            className="w-full p-2 mb-4 border rounded"
                            placeholder="Tên màu"
                        />
                        <ChromePicker
                            color={editingColor.hex_code}
                            onChangeComplete={(e) => setEditingColor({...editingColor, hex_code: e.hex})}
                            className="mb-4"
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

export default Color;
