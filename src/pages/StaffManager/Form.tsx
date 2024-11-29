import {useState, useEffect, Key} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {fetchGet, fetchPost, fetchPostForm} from "../../services/CallApi.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCloudArrowUp} from "@fortawesome/free-solid-svg-icons";

function Form() {
    const {id} = useParams<any>();
    const navigation = useNavigate()

    const [staff, setStaff] = useState<any>({
        user_name: '',
        full_name: '',
        address: '',
        avatar: '',
        status: 1,
        role_id: 1,
    });

    const [roles] = useState<any>([
        {
            id: 1,
            name: 'Quản trị viên'
        },
        {
            id: 2,
            name: 'Nhân viên'
        }, {
            id: 3,
            name: 'Nhân viên kho'
        }, {
            id: 4,
            name: 'Nhân viên giao hàng'
        },
        {
            id: 5,
            name: 'Nhân viên chăm sóc khách hàng'
        },
        {
            id: 6,
            name: 'Nhân viên nhận đơn'
        },
    ]);

    const handleImageUpload = (event: any) => {
        const file = event.target.files[0];
        let formData = new FormData();
        formData.append('file', file);
        fetchPostForm('/uploadImage', formData)
            .then((response) => {
                setStaff({...staff, avatar: `https://api.yody.lokid.xyz${response.file}`});
                HandleUpdate('avatar', `https://api.yody.lokid.xyz${response.file}`);
            })
            .catch((error) => {
                console.error("Error uploading image:", error);
            });
    };

    const HandleUpdate = (key: string, value: string) => {

        if (key === 'role_id') {
            let valueInt = Number(value);
            setStaff({...staff, [key]: valueInt});
        }else{
            setStaff({...staff, [key]: value});
        }
        if (id === '0') {
            setStaff({...staff, [key]: value});
            return;
        }
        fetchPost(`/admin/staff/update`, {
            id: Number(id),
            key: key,
            value: value,
        }).then((data) => {
            console.log(data);
        })
    }

    const CreateStaff = () => {
        fetchPost(`/admin/staff/create`, staff).then(() => {

        }).finally(() => {
            navigation('/staff');
        });
    }

    useEffect(() => {
        if (id && id !== '0') {
            fetchGet(`/admin/staff/${id}`).then((data) => {
                setStaff(data);
            });
        }
    }, [id]);

    // @ts-ignore
    return (
        <div className="container">
            <div>
                <Link to={"/staff"} className="btn btn-primary">Quay lại</Link>
            </div>
            <h2 className="text-center mb-4">Thông tin nhân viên</h2>
            <form className="flex">
                <div className="w-8/12 p-4">
                    <div className="form-group mb-4">
                        <label htmlFor="user_name">Tài khoản</label>
                        <input
                            type="text"
                            className="form-control"
                            id="user_name"
                            value={staff.user_name}
                            onChange={(e) => HandleUpdate("user_name", e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="full_name">Tên nhân viên</label>
                        <input
                            type="text"
                            className="form-control"
                            id="full_name"
                            value={staff.full_name}
                            onChange={(e) => HandleUpdate("full_name", e.target.value)}
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label htmlFor="address">Địa chỉ</label>
                        <input
                            type="text"
                            className="form-control"
                            id="address"
                            value={staff.address}
                            onChange={(e) => HandleUpdate("address", e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="role_id">Chức vụ</label>
                        <select
                            className="form-control"
                            id="role_id"
                            value={staff.role_id}
                            onChange={(e) => HandleUpdate("role_id", e.target.value)}>
                            {roles.map((role: { id: Key |  bigint; name: string}) => (
                                <option key={role.id} value={String(role.id)}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="w-4/12 p-4">
                    <div className="form-group mb-4">
                        <div className="flex flex-col items-center">
                            {staff.avatar &&
                                <img src={staff.avatar} alt="Avatar" className="w-32 h-32 mb-4 rounded-full"/>}
                            <input
                                type="file"
                                id="avatar"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="mb-2 d-none"
                            />
                            <div className="flex justify-around gap-2">
                                <label htmlFor="avatar" className="btn btn-primary">
                                    <FontAwesomeIcon icon={faCloudArrowUp} className="text-2xl cursor-pointer"/>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            {id === '0' &&
                <div className="container">
                    <button className="btn btn-success" onClick={()=>CreateStaff()}>
                        Lưu
                    </button>
                </div>
            }
        </div>
    );
}

export default Form;
