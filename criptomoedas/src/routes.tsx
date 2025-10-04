import {createBrowserRouter} from 'react-router'

import {Home} from './pages/home'
import {Notfound} from './pages/notfound'
import {Detail} from './pages/detail'

import {Layout} from "./components/layout"

const router = createBrowserRouter([
  {
    element: <Layout></Layout>,
    children:[
      {
        path: "/",
        element: <Home></Home>
      },
      {
        path: "/detail/:cripto",
        element: <Detail></Detail>
      },
      {
        path: "*",
        element: <Notfound></Notfound>
      }
    ]
  }
])

export { router }