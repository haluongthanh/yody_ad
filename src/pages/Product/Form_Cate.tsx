import { useEffect, useState } from 'react'
import {CategoryType} from '../../types/category'
import {generateSlug} from '../../utils/string_methods'
import {fetchGet, fetchPost} from "../../services/CallApi.ts";
import {useNavigate, useParams} from 'react-router-dom';
import Swal from 'sweetalert2'

function FormCate() {

    const navigate = useNavigate()

    const [category, setCategory] = useState<CategoryType>({
        id: 0,
        name: '',
        slug: '',
        status: 1,
        created_time: new Date(),
        updated_time: new Date(),
        created_by: BigInt(1),
        updated_by: BigInt(1)
    })


    const handleSubmit = () => {

        if (!category.name) {
            Swal.fire('Error!', 'Vui lòng nhập tên danh mục', 'error');
            return;
        }

        let url = '/admin/category/update'
        if (category.id == 0) {
            url = '/admin/category/create'
        }

        fetchPost(url, category).then(() => {
            Swal.fire('', 'Thành công!', 'success')
                .then(() => {
                    navigate('/product/category')
                });
        })
    }

    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id != "0") {
            fetchGet(`/admin/category/${id}`).then((res) => {
                setCategory(res);
            });
        }
        
    }, []);

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Thông tin danh mục</h1>
            <form>
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-2 font-semibold">Tên</label>
                    <input
                        type="text"
                        id="name"
                        value={category.name}
                        onChange={(e) => setCategory({...category, name: e.target.value})}
                        onKeyUp={(e) => setCategory({...category, slug: generateSlug((e.target as HTMLInputElement).value)})}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="slug" className="block mb-2 font-semibold">Slug</label>
                    <input
                        type="text"
                        id="slug"
                        value={category.slug}
                        onChange={(e) => setCategory({...category, slug: e.target.value})}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <button type={"button"} onClick={handleSubmit} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                    Gửi
                </button>
            </form>
        </div>
    );
}

export default FormCate;