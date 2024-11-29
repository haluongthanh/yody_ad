import { forwardRef, useImperativeHandle, useState } from 'react';

import { fetchPost } from '../../services/CallApi';

interface Props {
    product_id: number;
    categories?: { id: number; name: string }[];
}


const AddCategory = forwardRef((props:Props, ref) => {
    
    const [isOpen, setIsOpen] = useState(false);
    const [category_id, setCategory_id] = useState<number>(0);
    const categories = props.categories || [];

    const handleSubmit = () => {

        fetchPost('/admin/product/add_cate', {product_id: props.product_id, category_id: category_id})
            .then(res => {
                console.log('Thêm ảnh sản phẩm thành công:', res);
            })
            .catch(error => {
                console.error('Thêm ảnh sản phẩm thất bại:', error);
            }).finally(() => {
                window.location.reload();
                setIsOpen(false);
            });

    };

    const showModal = () => {
        setIsOpen(true);
    };

    useImperativeHandle(ref, () => ({
        showModal
    }));

    return (
        <>
            {isOpen && (
                 <div className="fixed inset-0 flex items-center justify-center z-999999 bg-black bg-opacity-25 h-full">
                 <div className="bg-white rounded-lg shadow-lg pt-5 pb-5 px-5 w-11/12 md:w-1/4  h-auto -translate-y-50">
                     <h2 className="text-lg font-bold mb-4">Thêm danh mục sản phẩm</h2>
                     <div className="flex mb-4 gap-3">
                         <div className="w-full">
                             <label htmlFor="swal-select-color" className="block text text-center my-1">Chọn danh mục</label>
                             <select
                                 id="swal-select-color"
                                 className="w-full p-2 border rounded"
                                 value={category_id}
                                 onChange={(e) => setCategory_id(Number(e.target.value))}
                             >
                                 <option value=""></option>
                                 {categories.map(c => (
                                     <option key={c.id} value={c.id}>{c.name}</option>
                                 ))}
                             </select>
                         </div>
                     </div>
                     
                     <div className="flex justify-end">
                         <button className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded" onClick={() => setIsOpen(false)}>Đóng</button>
                         <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSubmit}>Lưu</button>
                     </div>
                 </div>
             </div>
            )}
        </>
    );
});

export default AddCategory;
