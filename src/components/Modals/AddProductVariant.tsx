import { forwardRef, useState, useImperativeHandle } from 'react';
import Swal from 'sweetalert2';
import { fetchPost } from '../../services/CallApi';

interface Props {
    colors?: { id: number; name: string }[];
    product_id: number;
    sizes?: { id: number; name: string }[];
}


const AddProductVariant = forwardRef((props: Props, ref) => {
    const product_id = props.product_id;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedColorId, setSelectedColorId] = useState<number | string>('');
    const [selectedSizeId, setSelectedSizeId] = useState<number | string>('');
    const [stock, setStock] = useState<number | string>('');
    const colors = props.colors || [];
    const sizes = props.sizes || [];
    const showModal = () => {
        setIsOpen(true);
    };

    useImperativeHandle(ref, () => ({
        showModal
    }));

    const handleSubmit = () => {

        fetchPost('/admin/product/add_variant',
            { color_id: Number(selectedColorId), size_id: Number(selectedSizeId), stock: Number(stock), product_id: product_id })
            .then(() => {
                Swal.fire({
                    title: 'Thêm biến thể thành công',
                    icon: 'success',
                    timer: 2000
                })
            })
            .catch(() => {
                Swal.fire({
                    title: 'Thêm biến thể thất bại',
                    icon: 'error',
                    timer: 2000
                });
            }).finally(() => {
                setIsOpen(false);
                window.location.reload();
            });

    }

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-99999 bg-black bg-opacity-25 h-full">
                    <div className="bg-white rounded-lg shadow-lg pt-3 pb-5 px-5 w-11/12 md:w-1/4 h-auto -translate-y-50">
                        <h2 className="text-lg font-bold mb-4">Thêm biến thể sản phẩm</h2>
                        <div className="flex mb-4 gap-3">
                            <div className="w-full">
                                <label htmlFor="swal-select-color" className="block text text-center my-1">Chọn mầu áo</label>
                                <select
                                    id="swal-select-color"
                                    className="w-full p-2 border rounded"
                                    value={selectedColorId}
                                    onChange={(e) => setSelectedColorId(e.target.value)}
                                >
                                    <option value=""></option>
                                    {colors.map(color => (
                                        <option key={color.id} value={color.id}>{color.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex mb-4 gap-3">
                            <div className="w-full">
                                <label htmlFor="swal-select-color" className="block text text-center my-1">Chọn size</label>
                                <select
                                    id="swal-select-color"
                                    className="w-full p-2 border rounded"
                                    value={selectedSizeId}
                                    onChange={(e) => setSelectedSizeId(e.target.value)}
                                >
                                    <option value=""></option>
                                    {sizes.map(size => (
                                        <option key={size.id} value={size.id}>{size.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='flex mb-4 gap-3'>
                            <div className='w-full'>
                                <label htmlFor="swal-stock" className="block text text-center my-1">Nhập số lượng</label>
                                <input
                                    id="swal-stock"
                                    type="number"
                                    className="w-full p-2 border rounded"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded" onClick={() => setIsOpen(false)}>Đóng</button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSubmit}>Lưu</button>
                        </div>
                    </div>
                </div>
            )}
        </>);
})

export default AddProductVariant