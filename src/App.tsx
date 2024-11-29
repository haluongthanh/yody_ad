import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import AdminLayout from './components/Layout/AdminLayout';
import Login from "./pages/Auth/Login.tsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.tsx";
import DashBoard from './pages/Dashboard.tsx';
import ProductIndex from './pages/Product/index.tsx';
import ProductDetail from './pages/Product/Detail.tsx';
import FormEditProduct from './pages/Product/FormEditProduct.tsx';
import ProductForm from './pages/Product/Form.tsx';
import Size from './pages/Product/Size.tsx';
import Category from './pages/Product/Category.tsx';
import CategoryForm from './pages/Product/Form_Cate.tsx';
import Color from "./pages/Product/Color.tsx";
import OrderIndex from './pages/Order/index.tsx';
import OrderDetail from './pages/Order/Detail.tsx';
import CustomerIndex from "./pages/CustomerManager/index.tsx";
import CustomerDetail from "./pages/CustomerManager/Detail.tsx";
import StaffIndex from "./pages/StaffManager/index.tsx";
import StaffDetail from "./pages/StaffManager/Detail.tsx";
import StaffForm from "./pages/StaffManager/Form.tsx";
import StaffRoles from "./pages/StaffManager/Roles.tsx";
import Warehouse from "./pages/Warehouse/index.tsx";

function App() {
    return (

        <Router>
            <Routes>
                {/* Routes với MainLayout */}
                <Route element={<MainLayout />}>
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/login" element={<Login />} />
                </Route>

                {/* Routes với AdminLayout */}
                <Route element={<AdminLayout />}>
                    <Route path="/" element={<DashBoard />} />
                    <Route path="/dashboard" element={<DashBoard />} />

                    <Route path="/product" element={<ProductIndex />} />
                    <Route path="/product/form" element={<ProductForm />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/product/edit/:id" element={<FormEditProduct />} />
                    <Route path="/product/size" element={<Size />} />
                    <Route path="/product/color" element={<Color />} />
                    <Route path="/product/category" element={<Category />} />
                    <Route path="/product/category/:id" element={<CategoryForm />} />

                    <Route path="/order" element={<OrderIndex />} />
                    <Route path="/order/:id" element={<OrderDetail />} />

                    <Route path="/customer" element={<CustomerIndex />} />
                    <Route path="/customer/:id" element={<CustomerDetail />} />

                    <Route path="/staff" element={<StaffIndex />} />
                    <Route path="/staff/:id" element={<StaffDetail />} />
                    <Route path="/staff/form/:id" element={<StaffForm />} />
                    <Route path="/staff/role" element={<StaffRoles />} />

                    <Route path="/warehouse" element={<Warehouse />} />

                </Route>
            </Routes>
        </Router>
    );
}

export default App;
