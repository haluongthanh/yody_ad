import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { warehouse } from '../../types/warehouse';
import { fetchGet } from '../../services/CallApi';

function Index() {

    const [warehouses, setWarehouses] = useState<warehouse[]>();

    function handleEdit(id: number) {
        console.log('Edit:', id);
    }
    function handleDelete(id: number) {
        console.log('Delete:', id);
    }

    useEffect(() => {
        fetchGet('/admin/warehouse')
            .then(res => {
                setWarehouses(res);
            })
            .catch(error => {
                console.error('Warehouse:', error);
            });
    }, []);

    return (
        <div className='m-auto px-4 py-8'>
            <div className='flex justify-between'>
                <h1 className='text-3xl font-bold'>Danh sách chi nhánh</h1>
                <Link
                    to="/product/form"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-full inline-flex items-center group"
                    title="Thêm sản phẩm"
                >
                    <FontAwesomeIcon icon={faPlus} className="" />
                    <span className="hidden group-hover:inline">
                        Thêm chi nhánh
                    </span>
                </Link>
            </div>
            <table className="min-w-full bg-white border border-gray-300">
                <thead className='bg-gray-100 border-b'>
                    <tr>
                        <td className='py-2 px-4 border-r'>STT</td>
                        <td className='py-2 px-4 border-r'>Tên chi nhánh</td>
                        <td className='py-2 px-4 border-r'>Địa chỉ</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {warehouses?.map((warehouse, index) => (
                        <tr key={warehouse.id}>
                            <td className='py-2 px-4 border-r'>{index + 1}</td>
                            <td className='py-2 px-4 border-r'>{warehouse.name}</td>
                            <td className='py-2 px-4 border-r'>{warehouse.address}</td>
                            <td>
                            <button className="mr-2 text-blue-500 hover:text-blue-700" onClick={() => handleEdit(warehouse.id)}>
                                    <FontAwesomeIcon icon={faPenToSquare} className="h-5 w-5" />
                                </button>
                                <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(warehouse.id)}>
                                    <FontAwesomeIcon icon={faTrashAlt} className="h-5 w-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Index;