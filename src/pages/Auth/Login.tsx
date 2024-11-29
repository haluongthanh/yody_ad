import {FormEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {fetchPost} from '../../services/CallApi';
import {useDispatch} from "react-redux";
import {setUser} from '../../redux/userSlice.ts';

const Login = () => {
    const [user_name, setUserName] = useState('admin');
    const [password, setPassword] = useState('1234567890');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const HandleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            let response = await fetchPost('/admin/auth/login', {user_name, password});
            console.log(response);
            response = response.data;
            localStorage.setItem('accessToken', response.tokens.access_token);
            localStorage.setItem('refreshToken', response.tokens.refresh_token);
            localStorage.setItem('admin', JSON.stringify(response.admin));
            dispatch(setUser(response.admin));
            if (response.admin.role_id == 1) {
                navigate('/staff');
            }
            if (response.admin.role_id == 3 || response.admin.role_id == 4 || response.admin.role_id == 5 || response.admin.role_id == 6) {
                navigate('/order');
            }
        } catch (err) {
            console.log(err);
            setError('Invalid email or password');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg -translate-y-40" style={{minWidth: "600px"}}>
                <h3 className="text-2xl font-bold text-center">Đăng nhập tài khoản</h3>
                <form onSubmit={HandleLogin}>
                    <div className="mt-4">
                        <div>
                            <label className="block" htmlFor="email">Tài khoản</label>
                            <input
                                type="text"
                                placeholder="Tài khoản"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                value={user_name}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block">Mật khẩu</label>
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-baseline justify-between">
                            <button type="submit"
                                    className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                                Đăng nhập
                            </button>
                            <a href="#" className="text-sm text-blue-600 hover:underline">Quên mật khẩu</a>
                        </div>
                    </div>
                </form>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
        </div>
    );
}

export default Login;