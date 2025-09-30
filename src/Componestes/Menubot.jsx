const Menubot = ({ activeSection, onSectionChange, isMobileOpen, onCloseMobile }) => {
    const menusItems = [
        { id: 'sobre', label: 'Sobre o bot'},
        { id: 'instalacao', label: 'Instalação'},
        { id: 'comandos', label: 'Comandos'},
        { id: 'faq', label: 'FAQ'}
    ];
    
    return (
        <>
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onCloseMobile}></div>
            )}
            
            {/* sidebar */}
            <aside className={`w-full lg:w-80 transition-transform duration-300 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative top-0 left-0 h-full lg:h-auto bg-white lg:bg-transparent z-50 lg:z-auto shadow-2xl lg:shadow-none`}>
                <div className="p-6 lg:p-0">
                    <div className="lg:hidden flex items-center justify-between mb-6 pb-6 border-b">
                        <h2 className="text-lg font-bold text-gray-800">MENU</h2>
                        <button className="text-gray-500 hover:text-gray-700" onClick={onCloseMobile}>
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-[#F2CB57] to-[#F2D64B] text-white">
                            <h2 className="text-xl font-bold flex items-center">
                                <i className="fas fa-book mr-3"></i>
                                Navegação
                            </h2>
                        </div>
                        <nav className="p-4 space-y-2">
                            {menusItems.map((item) => {
                                return (
                                    <button 
                                        key={item.id} 
                                        onClick={() => onSectionChange(item.id)} 
                                        className={`w-full flex items-center p-4 rounded-xl text-left transition-all duration-200 ${
                                            activeSection === item.id 
                                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 shadow-sm' 
                                                : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-800'
                                        }`}
                                    >
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Menubot;