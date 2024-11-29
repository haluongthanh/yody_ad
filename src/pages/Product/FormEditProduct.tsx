import {useEffect, useState, useRef} from 'react';
import {useParams} from 'react-router-dom';
import {Product} from '../../types/product';
import {productImage} from '../../types/productImage';
import {variant} from '../../types/variant';
import {IColor} from '../../types/color';
import {size} from '../../types/size';
import {fetchGet, fetchPostForm} from '../../services/CallApi';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import Swal from 'sweetalert2';
import {CategoryType} from '../../types/category.ts'
import {Warehouse} from "../../types/warehouse.ts";
import {Product_cate} from "../../types/product_cate.tsx";

import AddProductImage from '../../components/Modals/AddProductImage';
import AddProductVariant from '../../components/Modals/AddProductVariant';
import AddCategory from '../../components/Modals/AddCategory';


function FormEditProduct() {
    const {id} = useParams();
    const [product, setProduct] = useState<Product>();
    const [variants, setVariant] = useState<variant[]>();
    const [productImages, setProductImage] = useState<productImage[]>();
    const [color, setColor] = useState<IColor[]>();
    const [size, setSize] = useState<size[]>();
    const [category, setCategory] = useState<CategoryType[]>([]);
    const [warehouse, setWarehouse] = useState<Warehouse[]>([]);
    // @ts-ignore
    const [list_category, setListCategory] = useState<[Product_cate]>(null);
    const productImageRef = useRef<{ showModal: () => void }>(null);
    const productVariantRef = useRef<{ showModal: () => void }>(null);
    const productCategory = useRef<{ showModal: () => void }>(null);

    function handleDeleteProductImage(productImageId: number) {

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
                fetchGet('/admin/product/delete_image?id=' + productImageId)
                    .then(() => {
                        setProductImage(productImages?.filter(image => image.id !== productImageId));
                    });
            }
        });

    }

    function handleDeleteVariant(varId: number) {

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
                fetchGet('/admin/product/delete_variant?id=' + varId)
                    .then(() => {
                        // @ts-ignore
                        setVariant(variants?.filter(item => item.id !== varId));
                    });
            }
        });

    }

    function handleDeleteProductCate(id: number) {
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
                fetchGet('/admin/product/delete_cate?id=' + id)
                    .then(() => {
                        setProductImage(productImages?.filter(image => image.id !== id));
                    });
            }
        });

    }

    function handleAddProductImage() {
        if (productImageRef.current) {
            productImageRef.current.showModal();
        }
    }

    function handleAddVariant() {
        if (productVariantRef.current) {
            productVariantRef.current.showModal();
        }
    }

    function handleAddCategory() {
        setCategory(category.filter((cate) => list_category.filter((item) => item.category_id === cate.id).length === 0));
        if (productCategory.current) {
            productCategory.current.showModal();
        }
    }

    function handleUpdateProduct(field: string, value: any) {

        // @ts-ignore
        setProduct(prevProduct => {
            return ({...prevProduct, [field]: value});
        });


        const formData = new FormData();
        formData.append("key", field);
        // @ts-ignore
        formData.append("id", Number(id));
        formData.append("value", value);

        fetchPostForm("/admin/product/update", formData)
            .then((response) => {
                if (response.ok) {

                    fetchData();
                } else {
                    console.error('Error updating product:', response.statusText);
                }
            })
            .catch((error) => {
                console.error('Fetch error:', error);
            });
    }


    const fetchData = () => {
        fetchGet(`/admin/product/detail/${id}`)
            .then((response) => {
                setProduct(response.Product);
                setVariant(response.Variants);
                setProductImage(response.Images);
                setListCategory(response.Category);
            });
    };

    useEffect(() => {

        fetchGet("/admin/color").then(res => {
            setColor(res)
        })

        fetchGet("/admin/size").then(res => {
            setSize(res);
        });

        fetchGet("/admin/category").then((res) => {
            setCategory(res);
        });

        fetchGet('/admin/warehouse')
            .then(res => {
                setWarehouse(res);
            })

        fetchData();

    }, [id]);

    if (!product) return <div>Loading...</div>

    return (
        <>
            <h2 className="text-2xl font-bold mb-10">
                <input type="text" value={product.name}
                       onChange={(e) => handleUpdateProduct("name", e.target.value)}
                       className="text-dark font-bold py-4 px-4 rounded-full inline-flex items-center group w-full"
                />
            </h2>
            <div className='flex justify-between gap-5'>
                <div className="flex-none overflow-x-auto w-2/5 shadow-lg shadow-form-strokedark rounded-lg p-6">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-semibold">Hình ảnh: {productImages?.length}</h3>
                        <FontAwesomeIcon icon={faPlus}
                                         className='text-green-600 cursor-pointer hover:bg-green-600 hover:text-white hover:p-3 hover:rounded-full'
                                         onClick={handleAddProductImage}/>
                    </div>
                    <div className="flex space-x-2">

                        {productImages && productImages.map((image) => (
                            <img
                                key={image.id}
                                src={"https://api.yody.lokid.xyz" + image.link}
                                alt={`Product ${product.name}`}
                                className="h-32 object-cover rounded hover:opacity-75 hover:shadow-md"
                                onClick={() => handleDeleteProductImage(image.id)}
                            />
                        ))}
                    </div>
                </div>
                <div className='flex-none overflow-x-auto w-3/5 shadow-lg shadow-form-strokedark rounded-lg p-6'>
                    <div className='flex justify-between items-center mb-2'>
                        <h3 className="text-xl font-semibold mb-2">Biến thể: {variants?.length}</h3>
                        <FontAwesomeIcon icon={faPlus}
                                         className='text-green-600 cursor-pointer hover:bg-green-600 hover:text-white hover:p-3 hover:rounded-full'
                                         onClick={handleAddVariant}/>
                    </div>
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                        <tr>
                            <th className="px-4 py-2 border">Màu</th>
                            <th className="px-4 py-2 border">Kích thước</th>
                            <th className="px-4 py-2 border">Kho</th>
                            <th className="px-4 py-2 border">Số lượng</th>
                            <th className="px-4 py-2 border"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {variants && variants.map((variant) => (
                            <tr key={variant.id}>
                                <td className="px-4 py-2 border">
                                        <span className='px-4 py-2 w-5 h-2 rounded-full text-white'
                                              style={{backgroundColor: `${color?.find(i => i.id == variant.color_id)?.hex_code}`}}>
                                        </span>
                                </td>
                                <td className="px-4 py-2 border">{size?.find(i => i.id == variant.size_id)?.name}</td>
                                <td className="px-4 py-2 border">{warehouse.find(i => i.id == variant.warehouse_id)?.name}</td>
                                <td className="px-4 py-2 border">{variant.stock}</td>
                                <td className="px-4 py-2 border">
                                    <div className="flex justify-around">
                                        <button className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDeleteVariant(variant.id)}>
                                            <FontAwesomeIcon icon={faTrash} className="h-5 w-5"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                </div>
            </div>
            <div className="flex mb-10 gap-5 mt-10">
                <div className="flex-1 pr-4 w-5/6 shadow-lg shadow-form-strokedark rounded-lg p-6">
                    <div className='flex justify-start gap-3 mb-3'>
                        <p className="mb-3"><span className="font-semibold px-2">Giá:</span>
                            <input type="number" value={product.price}
                                   onChange={(e) => handleUpdateProduct("price", e.target.value)}
                                   className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            <span className="px-2">VNĐ</span>
                        </p>
                        <p className="mb-3"><span className="font-semibold px-2">Trạng thái:</span> <span
                            className='px-2 py-1 bg-green-500 rounded-lg'> {product.status === 1 ? 'Mở bán' : 'Đóng'}</span>
                        </p>
                    </div>
                    <ReactQuill value={product.description} readOnly={false} theme="snow"
                                onChange={(content) => handleUpdateProduct("description", content)}/>
                </div>
                <div className='w-1/6 shadow-lg shadow-form-strokedark rounded-lg p-6'>
                    <div className='flex justify-between border-b'>
                        <p className='font-semibold mb-3'>Danh mục</p>
                        <FontAwesomeIcon icon={faPlus}
                                         className='text-green-600 cursor-pointer hover:bg-green-600 hover:text-white hover:p-3 hover:rounded-full'
                                         onClick={handleAddCategory}/>
                    </div>
                    <ul>
                        {list_category?.map((cate, index) => (
                            <li key={index}>
                                <p className="font-bold my-1 flex justify-between">
                                    {category.find(i => i.id == cate.category_id)?.name || ""}
                                    <span>
                                        <FontAwesomeIcon icon={faTrash}
                                                         className='text-red-600 cursor-pointer hover:bg-red-600 hover:text-white hover:p-3 hover:rounded-full'
                                                         onClick={() => handleDeleteProductCate(cate.id)}/>
                                    </span>
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <AddProductImage ref={productImageRef} colors={color} product_id={product.id}/>
            <AddProductVariant ref={productVariantRef} colors={color} sizes={size} product_id={product.id}/>
            <AddCategory ref={productCategory} categories={category} product_id={product.id}/>
        </>
    );
}

export default FormEditProduct;