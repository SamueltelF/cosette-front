import { useState } from "react";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Menubot from "../Componestes/Menubot";
import Navbar from "../Componestes/Navbar";

const Sobre = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const getActiveSection = () => {
        const path = location.pathname;
        if (path.includes('/instalacao')) return 'instalacao';
        if (path.includes('/comandos')) return 'comandos';
        if (path.includes('/faq')) return 'faq';
        return 'sobre';
    };
    
    const activeSection = getActiveSection();
    
    // Navega para rotas
    const handleSectionChange = (section) => {
        const rotas = {
            'sobre': '/sobre',
            'instalacao': '/sobre/instalacao',
            'comandos': '/sobre/comandos',
            'faq': '/sobre/faq'
        };
        navigate(rotas[section] || '/sobre');
        setIsMobileMenuOpen(false);
    };
    
    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
            <Navbar />
            
            {/* Botão mobile menu */}
            {!isMobileMenuOpen && (
                <div className="lg:hidden fixed top-28 left-4 z-30">
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)} 
                        className="bg-[#F20C36] hover:bg-[#f20c368e] p-3 rounded-lg shadow-lg text-white transition-all duration-300 transform hover:scale-105"
                    >
                        <i className="fas fa-bars text-xl"></i>
                        <span className="ml-2">MENU</span>
                    </button>
                </div>
            )}
            
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed top-28 left-4 z-40">
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="bg-red-500 hover:bg-red-600 p-3 rounded-lg shadow-lg text-white transition-all duration-300 transform hover:scale-105"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
            )}
            
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Menu lateral */}
                    <Menubot 
                        activeSection={activeSection}
                        onSectionChange={handleSectionChange}
                        isMobileOpen={isMobileMenuOpen}
                        onCloseMobile={() => setIsMobileMenuOpen(false)}
                    />
                    
                    {/* Área do conteúdo */}
                    <main className="flex-1">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 min-h-[600px] p-6">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Sobre;