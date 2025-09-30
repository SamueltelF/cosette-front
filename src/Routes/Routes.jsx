import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../Pages/Home';
import Header from '../Componestes/Header';
import Sobre from '../Pages/Sobre';
import WhatsAppBotLogin from '../Pages/LoginBot';
import PaymentPage from '../Pages/Pagamentos';

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
    </Routes>
    </BrowserRouter> );
}
 
export default AppRoute;