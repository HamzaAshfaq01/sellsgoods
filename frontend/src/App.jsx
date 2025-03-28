import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DashboardLayout from "./layout/Dashboard";
import Header from "./components/Header";
import Home from "./pages/home/Home";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/dashboard/Profile";
import ProductListScreen from "./pages/dashboard/Products";
import AddProductScreen from "./pages/dashboard/AddProduct";
import EditProductScreen from "./pages/dashboard/EditProduct";
import ViewProductScreen from "./pages/dashboard/ViewProduct";
import Categories from "./pages/dashboard/Categories";
import AddCategories from "./pages/dashboard/AddCategories";
import EditCategoryScreen from "./pages/dashboard/EditCategory";
import OrdersListing from "./pages/dashboard/Orders";
import EditOrderScreen from "./pages/dashboard/EditOrders";
import ProductDetail from "./pages/home/ProductDetail";
import CategoryProducts from "./pages/home/CategoryProducts";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/cart/Cart";
import UsersListScreen from "./pages/dashboard/Users";


function App() {
  return (
    <CartProvider>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="productdetails/:id/view" element={<ProductDetail key={location.pathname}/> } />
        <Route path="/category/:category" element={<CategoryProducts />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/profile" replace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="products" element={<ProductListScreen />} />
           <Route path = "categories" element ={<Categories/>}/>
           <Route path = "users" element ={<UsersListScreen/>}/>

          <Route path="products/add" element={<AddProductScreen />} />
          <Route path="categories/add" element={<AddCategories />} />
         
          <Route path="categories/:id/edit" element={<EditCategoryScreen />} />
          <Route path="products/:id/edit" element={<EditProductScreen />} />
          <Route path="products/:id/view" element={<ViewProductScreen />} />
      
          <Route path="orders" element={<OrdersListing />} />
          <Route path="orders/:id/edit" element={<EditOrderScreen />} />

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
    </CartProvider>
  );
}

export default App;
