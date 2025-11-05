import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../Pages/Home';
import Header from '../Componestes/Header';
import Sobre from '../Pages/Sobre';
import WhatsAppBotLogin from '../Pages/LoginBot';
import PaymentPage from '../Pages/Pagamentos';
import Dashboard from '../Pages/PainelApi';

const AppRoute = () => {
    return ( 
    <BrowserRouter>
    <Header />
    <Routes>
        <Route path='/' element={<Home />}  />
        <Route path='/sobre' element={<Sobre />}>
      
        </Route>
         <Route path='/loginBot' element={<WhatsAppBotLogin />} />
         <Route path='/consumo' element={<PaymentPage />} />
         <Route path='/api' element={<Dashboard />} />
    </Routes>
    </BrowserRouter> );
}
 
export default AppRoute;