import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { SidebarVertical } from '../Sidebar/SidebarVertical';
import {useDispatch} from "react-redux";
import {setUser} from '../../redux/userSlice.ts';
import Header from '../Header/index.tsx';
import Loader from '../Loader/Spin.tsx';
import {RefreshToken} from "../../services/CallApi.ts";


const AdminLayout = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const refreshToken = localStorage.getItem('refreshToken');
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            if (!refreshToken) {
                navigate('/login');
                return;
            }
            try {
                await RefreshToken();
                const admin = JSON.parse(localStorage.getItem('admin') || '{}');
                dispatch(setUser(admin));
                setLoading(false);
            } catch (error) {
                localStorage.removeItem('refreshToken');
                navigate('/login');
            }
        };

        checkAuth();
    }, [refreshToken, navigate, dispatch]);

    if (loading) return <Loader />;

    return (
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
            <div className="flex h-screen overflow-hidden">
                <SidebarVertical sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
