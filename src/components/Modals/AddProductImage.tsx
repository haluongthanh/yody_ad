import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { fetchPostForm } from '../../services/CallApi';

interface Props {
    colors?: { id: number; name: string }[];
    product_id: number;
}


const AddProductImage = forwardRef((props:Props, ref) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedColorId, setSelectedColorId] = useState<bigint | string>('');
    const [file, setFile] = useState<File | null>(null);



    const colors = props.colors || [
        { id: 1, name: 'Red' },
        { id: 2, name: 'Green' },
        { id: 3, name: 'Blue' }
    ];

    const handleImagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            setFile(selectedFile);
            reader.readAsDataURL(selectedFile);
        } else {
            setImagePreview(null);
            setFile(null);
        }
    };

    const handleSubmit = () => {
        if (!selectedColorId || !file) {
            alert('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const formData = new FormData();
        formData.append('product_id', props.product_id.toString());
        formData.append('color_id', selectedColorId.toString());
        formData.append('image', file);

        fetchPostForm('/admin/product/add_image', formData)
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
                     <h2 className="text-lg font-bold mb-4">Thêm ảnh sản phẩm</h2>
                     <div className="flex mb-4 gap-3">
                         <div className="w-full">
                             <label htmlFor="swal-select-color" className="block text text-center my-1">Chọn mầu áo</label>
                             <select
                                 id="swal-select-color"
                                 className="w-full p-2 border rounded"
                                 value={String(selectedColorId)}
                                 onChange={(e) => setSelectedColorId(e.target.value)}
                             >
                                 <option value=""></option>
                                 {colors.map(color => (
                                     <option key={color.id} value={color.id}>{color.name}</option>
                                 ))}
                             </select>
                         </div>
                     </div>
                     <div className="mb-4">
                         <input
                             type="file"
                             id="swal-file-input"
                             className="hidden"
                             accept="image/*"
                             onChange={handleImagePreview}
                         />
                         <label htmlFor="swal-file-input" className="cursor-pointer flex items-center justify-center bg-blue-600 text-white rounded py-2 px-4">
                             <FontAwesomeIcon icon={faUpload} className="mr-2" />
                             Chọn hình ảnh
                         </label>
                     </div>
                     <div className="mb-4">
                         <img
                             id="image-preview"
                             src={imagePreview || ''}
                             alt="Preview"
                             style={{ display: imagePreview ? 'block' : 'none' }}
                             className="w-auto h-64 object-cover m-auto"
                         />
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

export default AddProductImage;
