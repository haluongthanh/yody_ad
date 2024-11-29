import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Swal from 'sweetalert2';
import { Product } from "../../types/product";
import {generateSlug} from '../../utils/string_methods'
import { fetchPost } from '../../services/CallApi';
import { useNavigate } from 'react-router-dom';

function Form() {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        slug: '',
        description: '',
        price: 0,
        status: 1,
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "name") {
            setFormData(prevData => ({
                ...prevData,
                name: value,
                slug: generateSlug(value)
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: name === 'price' || name === 'status' ? Number(value) : value,
            }));
        }
    };

    const handleEditorChange = (event: any, editor: any) => {
        const data = editor.getData();
        setFormData(prevData => ({
            ...prevData,
            description: data
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        fetchPost("/admin/product/add", formData)
        .then((data) => {
            console.log(data);
            if (data.code == 20001) {
                Swal.fire({
                    title: 'Thành công!',
                    text: 'Sản phẩm đã được thêm thành công.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                })
                .then(() => {
                    navigate('/admin/product');
                });
            }else{
                Swal.fire({
                    title: 'Thất bại!',
                    text: 'Có lỗi xảy ra khi thêm sản phẩm.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        })
        
    };

    return (
        <div className="w-2/3 mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Thêm sản phẩm mới</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Tên sản phẩm</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="slug" className="block mb-2 text-sm font-medium text-gray-700">Slug</label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">Mô tả</label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.description}
                            onChange={handleEditorChange}
                            config={{
                                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
                            }}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700">Giá</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300">
                        Thêm sản phẩm
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Form;