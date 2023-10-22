import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import EditBlog from './components/Blog/Edit'
import NewBlog from './components/Blog/NewBlog'
import CategoriesAdd from './components/Categories/Add'
import CategoriesEdit from './components/Categories/Edit'
import CategoriesSee from './components/Categories/See/index'
import NewCategories from './components/Categories/newCategories'
import Layout from "./components/Layout"
import EditNews from './components/News/Edit'
import NewNews from './components/News/NewNews'
import Achievements from './pages/Achievements'
import Blogs from './pages/Blogs'
import Categories from './pages/Categories'
import Dashboard from './pages/Dashboard'
import Galleries from './pages/Galleries'
import Login from "./pages/Login"
import News from './pages/News'
import Products from './pages/Products'
import AddProduct from './pages/Products/AddProduct'
import EditProduct from './pages/Products/EditProduct'
import Statistics from './pages/Statistics'
import SeeProduct from './components/Products/ProductSee'



const App = () => {
  const [login, ] = useState<boolean>(localStorage.getItem("access") ? true : false  )

  
  return (
    <div>
        <BrowserRouter>
          <Routes>
            <Route path={"/"} element={login ? <Layout login={login}><Dashboard /></Layout> : <Login />} />
            <Route path={"/dashbord"} element={<Layout login={login}> <Dashboard /> </Layout>} />
            {/* Categories */}
            <Route path={"/categories"} element={<Layout login={login}> <Categories /> </Layout>}/>
            <Route path={"/newCategories"} element={<Layout login={login}><NewCategories/></Layout>} />
            <Route path={"/categories/see/:id"} element={<Layout login={login}><CategoriesSee/></Layout>} />
            <Route path={"/categories/add/:id"} element={<Layout login={login}><CategoriesAdd/></Layout>} />
            <Route path={"/categories/edit/:id"} element={<Layout login={login}><CategoriesEdit/></Layout>} />
            {/* Achievements */}
            <Route path={"/achievements"} element={<Layout login={login}><Achievements/></Layout>} />
            {/* Galleries */}
            <Route path={"/galleries"} element={<Layout login={login}><Galleries/></Layout>} />
            {/* Statistika */}
            <Route path={"/statistics"} element={<Layout login={login}><Statistics/></Layout>}/>
            {/* Blog */}
            <Route path={"/blog"} element={<Layout login={login}><Blogs/></Layout>} />
            <Route path={"/newBlog"} element={<Layout login={login}><NewBlog/></Layout>} /> 
            <Route path={"/blog/edit/:id"} element={<Layout login={login}><EditBlog/></Layout>} />
            {/* News */}
            <Route path={"/news"} element={<Layout login={login}><News/></Layout>} />
            <Route path={"/newNews"} element={<Layout login={login}><NewNews/></Layout>} /> 
            <Route path={"/news/edit/:id"} element={<Layout login={login}><EditNews/></Layout>} />
            {/* Products */}
            <Route path={"/products"} element={<Layout login={login}><Products/></Layout>} />
            <Route path={"/products/add"} element={<Layout login={login}><AddProduct/></Layout>} />
            <Route path={"/products/edit/:id"} element={<Layout login={login}><EditProduct/></Layout>} />
            <Route path={"/products/see/:id"} element={<Layout login={login}><SeeProduct/></Layout>} />
          </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App