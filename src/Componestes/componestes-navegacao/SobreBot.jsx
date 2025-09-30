const SobreBot = () => {
    return ( 
    <div className="space-y-6">
        <div className="bg-gradient-to-r from-[#401919] to-[#40191994] text-white p-8 rounded-xl">
            <h2 className="text-3xl dont-bold flex items-center">
                Sobre Bot
            </h2>
            <p className="text-blue-100 text-lg">Conheça as funcionalidades e características do bot.</p>
        </div>
        <div className="grid md:grid-colos-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <div className="flex items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Fucionalidades</h3>
                </div>
               <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                    <i className="fas fa-book text-green-500 mr-2"></i>
                    Comandos personalizados
                </li>
                 <li className="flex items-center">
                    <i className="fas fa-book text-green-500 mr-2"></i>
                    Moderação automática
                </li>
                 <li className="flex items-center">
                    <i className="fas fa-book text-green-500 mr-2"></i>
                    Sistema de níveis
                </li>
                 <li className="flex items-center">
                    <i className="fas fa-book text-green-500 mr-2"></i>
                    Integração com APIs
                </li>

                </ul> 
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                <div className="flex items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Segurança</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                        <i className="fas fa-book text-green-500 mr-2"></i>
                        Código Bailys - Documentação
                    </li>
                    <li className="flex items-center">
                        <i className="fas fa-book text-green-500 mr-2"></i>
                        Auto controle e Adiministração
                    </li>
                     <li className="flex items-center">
                        <i className="fas fa-book text-green-500 mr-2"></i>
                        Controle ao site
                    </li>
                     <li className="flex items-center">
                        <i className="fas fa-book text-green-500 mr-2"></i>
                       Suporte
                    </li>
                </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"></h3>
            </div>
        </div>

    </div> );
}
 
export default SobreBot;