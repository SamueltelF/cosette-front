import { MessageCircle, Phone, RefreshCw, Shield, Smartphone, User, Zap, Globe } from "lucide-react";
import { useEffect, useState } from "react"; 
import { useApi } from "../Js/userApi"

const WhatsAppBotLogin = () => {
    const [activeTab, setActiveTab] = useState('login')
    const [particula, setParticula] = useState([])

    const [loginData, setLoginData] = useState({
        name: '',
        phone: '',
        devices: 'Android'
    })

    const [update, setUpdate] = useState({
        phone: '',
        newDevices: 'Android'
    })

    useEffect(() => {
        const newParticulas = []
        for (let i = 0; i < 15; i++) {
            newParticulas.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 4 + 2,
                speed: Math.random() * 2 + 1,
                delay: Math.random() * 2
            })
        }
        setParticula(newParticulas)
    }, [])

  const { isLoading, error, addUser, updateUser, clearError } = useApi();

    const handleLogin = async () => {
        // Validação dos campos
        if (!loginData.name.trim()) {
            alert('Por favor, preencha o nome');
            return;
        }
        if (!loginData.phone.trim()) {
            alert('Por favor, preencha o telefone');
            return;
        }
        
        try {
            const data = await addUser(loginData);
            alert(data.mensagem || 'Operação realizada com sucesso');
        } catch (error) {
            alert('Erro inesperado: ' + error.message);
        }
    };

    const handleUpdate = async () => {
        // Validação dos campos
        if (!update.phone.trim()) {
            alert('Por favor, preencha o telefone para validação');
            return;
        }
        
        try {
            const data = await updateUser(update);
            alert(data.mensagem || 'Atualização realizada com sucesso');
        } catch (error) {
            alert('Erro inesperado: ' + error.message);
        }
    };
    
    return ( 
        <>
            <style>
                {`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    25% { transform: translateY(-10px) rotate(1deg); }
                    75% { transform: translateY(-5px) rotate(-1deg); }
                }
                
                @keyframes float-random {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    25% { transform: translateY(-20px) translateX(10px); }
                    50% { transform: translateY(-10px) translateX(-5px); }
                    75% { transform: translateY(-15px) translateX(5px); }
                }
                
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.15; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(1.05); }
                }
                
                @keyframes spin-very-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0px); }
                }
                
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                
                .animate-float-random {
                    animation: float-random 6s ease-in-out infinite;
                }
                
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
                
                .animate-spin-very-slow {
                    animation: spin-very-slow 20s linear infinite;
                }
                
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
                
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
                `}
            </style>
            <div className="min-h-screen relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-amber-300 to-red-900">
                    <div className="absolute inset-0 bg-gradient-to-tl from-orange-400 via-transparent to-yellow-300 opacity-60"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600 via-transparent to-amber-400 opacity-40"></div>
                </div>

                {/* particulas flutuantes */}
                <div className="absolute inset-0">
                    {particula.map((particulas) => (
                        <div key={particulas.id} className="absolute rounded-full bg-white opacity-20 animate-float-random" 
                            style={{
                                left: `${particulas.x}%`, 
                                top: `${particulas.y}%`, 
                                width: `${particulas.size}px`, 
                                height: `${particulas.size}px`,
                                animationDuration: `${particulas.speed + 3}s`, 
                                animationDelay: `${particulas.delay}s`
                            }}
                        />
                    ))}
                </div>

                {/* elementos decorativos */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-300 to-transparent rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2 animate-spin-very-slow"></div> 
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-red-500 to-transparent rounded-full opacity-15 translate-x-1/2 translate-y-1/2 animate-pulse-slow"></div> 
            
                <div className="absolute inset-0 pointer-events-none">
                    <MessageCircle className="absolute top-20 left-16 w-8 h-8 text-green-600 opacity-30 animate-bounce-slow" /> 
                    <Smartphone className="absolute top-1/3 right-20 w-10 h-10 text-blue-500 opacity-25 animate-float" />
                    <Zap className="absolute bottom-1/3 left-12 w-6 h-6 text-yellow-500 opacity-40 animate-pulse" />
                    <Globe className="absolute top-2/3 right-1/4 w-7 h-7 text-indigo-500 opacity-30 animate-spin-slow" /> 
                    <Shield className="absolute bottom-20 right-16 w-8 h-8 text-green-500 opacity-35 animate-bounce" />
                </div>

                <div className="relative mt-20 z-20 min-h-screen flex items-center justify-center p-4">
                    <div className="w-full max-w-lg">
                        <div className="relative mb-8">
                            <div className="flex bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-white border-opacity-30"> 
                                <button onClick={() => setActiveTab('login')} className={`relative flex-1 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'login' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl transform scale-105' : 'text-orange-800 hover:bg-white hover:bg-opacity-20'}`}> 
                                    <User className="w-5 h-5 inline mr-2" /> 
                                    ENTRAR
                                    {activeTab === 'login' && (
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-bounce"></div> 
                                    )}
                                </button>
                                <button onClick={() => setActiveTab('update')} className={`relative flex-1 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'update' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl transform scale-105' : 'text-orange-800 hover:bg-white hover:bg-opacity-20'}`}>
                                    <RefreshCw className="w-5 h-5 inline mr-2" />
                                    ATUALIZAR
                                    {activeTab === 'update' && (
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-bounce"></div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Exibir mensagem de erro se houver */}
                        {error && (
                            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white border-opacity-50 overflow-hidden"> 
                            {activeTab === 'login' && (
                                <div className="p-8 animate-fade-in">
                                    <div className="text-center mb-8">
                                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float shadow-xl"> 
                                            <MessageCircle className="w-10 h-10 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-red-900 mb-2">Fazer Login</h2>
                                        <p className="text-orange-700">Entre com seus dados para conectar</p> 
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="relative">
                                            <label className="block text-sm font-bold text-orange-800 mb-3">Nome / Nickname</label>
                                            <input 
                                                type="text" 
                                                value={loginData.name} 
                                                onChange={(e) => setLoginData({...loginData, name: e.target.value})} 
                                                className="w-full px-6 py-4 border-2 border-yellow-300 rounded-2xl focus:border-orange-500 focus:outline-none transition-all duration-300 bg-gradient-to-r from-yellow-50 to-orange-50 text-red-900 placeholder-orange-400 text-lg shadow-inner hover:shadow-lg transform hover:scale-105" 
                                                placeholder="Digite seu nome ou nick"
                                                disabled={isLoading}
                                            />
                                        </div>
                                        
                                        <div className="relative">
                                            <label className="block text-sm font-bold text-orange-800 mb-3">
                                                <Phone className="w-4 h-4 inline mr-2" />
                                                Número do WhatsApp
                                            </label>
                                            <input 
                                                type="tel" 
                                                value={loginData.phone} 
                                                onChange={(e) => setLoginData({...loginData, phone: e.target.value})}
                                                className="w-full px-6 py-4 border-2 border-yellow-300 rounded-2xl focus:border-orange-500 focus:outline-none transition-all duration-300 bg-gradient-to-r from-yellow-50 to-orange-50 text-red-900 placeholder-orange-400 text-lg shadow-inner hover:shadow-lg transform hover:scale-105"
                                                placeholder="+55 (11) 99999-9999"
                                                disabled={isLoading}
                                            />
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-bold text-orange-800 mb-3">Dispositivo</label>
                                            <select 
                                                value={loginData.devices} 
                                                onChange={(e) => setLoginData({...loginData, devices: e.target.value})} 
                                                className="w-full px-6 py-4 border-2 border-yellow-300 rounded-2xl focus:border-orange-500 focus:outline-none transition-all duration-300 bg-gradient-to-r from-yellow-50 to-orange-50 text-red-900 text-lg shadow-inner hover:shadow-lg transform hover:scale-105 cursor-pointer"
                                                disabled={isLoading}
                                            > 
                                                <option value="Android">Android</option>
                                                <option value="iPhone">iPhone</option>
                                                <option value="Web">Web WhatsApp</option>
                                            </select>
                                        </div>

                                        <button 
                                            onClick={handleLogin} 
                                            disabled={isLoading} 
                                            className="w-full bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"> 
                                            {isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                                    Conectando... 
                                                </>
                                            ) : (
                                                <>
                                                    <MessageCircle className="w-6 h-6 mr-3 animate-bounce" />
                                                    CONECTAR AO BOT
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'update' && (
                                <div className="p-8 animate-fade-in">
                                    <div className="text-center mb-8">
                                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce shadow-xl">
                                            <RefreshCw className="w-10 h-10 text-white animate-spin-slow" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-red-900 mb-2">Atualizar Dados</h2> 
                                        <p className="text-orange-700">Altere o dispositivo vinculado à sua conta</p> 
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="relative">
                                            <label className="block text-sm font-bold text-orange-800 mb-3"> 
                                                <Phone className="w-4 h-4 inline mr-2" />
                                                Número para Validação
                                            </label>
                                            <input 
                                                type="tel" 
                                                value={update.phone} 
                                                onChange={(e) => setUpdate({...update, phone: e.target.value})}
                                                className="w-full px-6 py-4 border-2 border-yellow-300 rounded-2xl focus:border-orange-500 focus:outline-none transition-all duration-300 bg-gradient-to-r from-yellow-50 to-orange-50 text-red-900 placeholder-orange-400 text-lg shadow-inner hover:shadow-lg transform hover:scale-105"
                                                placeholder="+55 (11) 99999-9999"
                                                disabled={isLoading}
                                            />
                                        </div>
                                        
                                        <div className="relative"> 
                                            <label className="block text-sm font-bold text-orange-800 mb-3">
                                                Novo Dispositivo
                                            </label>
                                            <select 
                                                value={update.newDevices} 
                                                onChange={(e) => setUpdate({...update, newDevices: e.target.value})}
                                                className="w-full px-6 py-4 border-2 border-yellow-300 rounded-2xl focus:border-orange-500 focus:outline-none transition-all duration-300 bg-gradient-to-r from-yellow-50 to-orange-50 text-red-900 text-lg shadow-inner hover:shadow-lg transform hover:scale-105 cursor-pointer"
                                                disabled={isLoading}
                                            > 
                                                <option value="Android">Android</option>
                                                <option value="iPhone">iPhone</option>
                                                <option value="Web">Web WhatsApp</option>
                                            </select>
                                        </div>
                                        
                                        <button 
                                            onClick={handleUpdate} 
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                                            {isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                                    Atualizando...
                                                </>
                                            ) : (
                                                <>
                                                    <RefreshCw className="w-6 h-6 mr-3 animate-bounce" />
                                                    ATUALIZAR DISPOSITIVO
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default WhatsAppBotLogin;