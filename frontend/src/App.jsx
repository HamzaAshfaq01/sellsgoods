import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DashboardLayout from "./layout/Dashboard";
import Header from "./components/Header";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/Profile";
import ProductListScreen from "./pages/dashboard/Products";
import AddProductScreen from "./pages/dashboard/AddProduct";
import EditProductScreen from "./pages/dashboard/EditProduct";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/profile" replace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="products" element={<ProductListScreen />} />
          <Route path="products/add" element={<AddProductScreen />} />
          <Route path="products/:id/edit" element={<EditProductScreen />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}

export default App;
