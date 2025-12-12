import { MessageCircle, Phone, RefreshCw, Shield, Smartphone, User, Zap, Globe, AlertCircle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react"; 
import { useApi } from '../Js/userApi'; // ✅ IMPORTA O HOOK

const WhatsAppBotLogin = () => {
    const [activeTab, setActiveTab] = useState('login')
    const [particula, setParticula] = useState([])
    const [errors, setErrors] = useState({})
    
    // ✅ USA O HOOK useApi
    const { isLoading, error, clearError, addUser, updateUser } = useApi()

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

    // ✅ Mostra erro da API se houver
    useEffect(() => {
        if (error) {
            alert('Erro: ' + error)
            clearError()
        }
    }, [error, clearError])

    // ========== VALIDAÇÕES ==========
    
    const validateName = (name) => {
        const trimmedName = name.trim()
        
        if (!trimmedName) {
            return { valid: false, message: 'Nome é obrigatório' }
        }
        
        if (trimmedName.length < 3) {
            return { valid: false, message: 'Nome deve ter pelo menos 3 caracteres' }
        }
        
        if (trimmedName.includes('@')) {
            return { valid: false, message: 'Por favor, digite seu NOME, não email' }
        }
        
        if (/^\S+@?\S+\.\S+$/.test(trimmedName)) {
            return { valid: false, message: 'Digite apenas seu nome ou apelido' }
        }
        
        const numberCount = (trimmedName.match(/\d/g) || []).length
        if (numberCount > 3) {
            return { valid: false, message: 'Nome não pode conter muitos números' }
        }
        
        return { valid: true }
    }

    // ❌ CÓDIGO ANTIGO (BUGADO)
const normalizeWhatsAppNumberOLD = (phone) => {
    let numbers = phone.replace(/\D/g, '')
    
    if (numbers.startsWith('55')) {
        numbers = numbers.slice(2)
    }
    
    if (numbers.length < 10) {
        return { valid: false, message: 'Número incompleto' }
    }
    
    const ddd = numbers.slice(0, 2)
    let numero = numbers.slice(2)
    
    // ❌ PROBLEMA: Sempre adiciona 9, mesmo se já tiver
    // Se numero = "999999999", vira "9999999999" (10 dígitos!)
    
    const fullNumber = '55' + ddd + numero
    
    return { 
        valid: true, 
        normalized: fullNumber,
        formatted: `+55 (${ddd}) ${numero.slice(0, 5)}-${numero.slice(5)}`
    }
}

// ✅ CÓDIGO NOVO (CORRETO)
const normalizeWhatsAppNumber = (phone) => {
    // Remove tudo que não é número
    let numbers = phone.replace(/\D/g, '')
    
    // Remove o código do país se já estiver presente
    if (numbers.startsWith('55')) {
        numbers = numbers.slice(2)
    }
    
    // Validar tamanho mínimo
    if (numbers.length < 10) {
        return { valid: false, message: 'Número incompleto' }
    }
    
    // Separar DDD e número
    const ddd = numbers.slice(0, 2)
    let numero = numbers.slice(2)
    
    // ✅ CORREÇÃO: Não adiciona 9 extra
    // Apenas mantém o número como está
    
    // Validar tamanho do número (deve ter 8 ou 9 dígitos)
    if (numero.length < 8 || numero.length > 9) {
        return { 
            valid: false, 
            message: 'Número deve ter 8 ou 9 dígitos' 
        }
    }
    
    // Montar número completo
    const fullNumber = '55' + ddd + numero
    
    return { 
        valid: true, 
        normalized: fullNumber,
        formatted: `+55 (${ddd}) ${numero.slice(0, numero.length === 9 ? 5 : 4)}-${numero.slice(numero.length === 9 ? 5 : 4)}`
    }
}

    const validatePhone = (phone) => {
        const trimmedPhone = phone.trim()
        
        if (!trimmedPhone) {
            return { valid: false, message: 'Número do WhatsApp é obrigatório' }
        }
        
        return normalizeWhatsAppNumber(trimmedPhone)
    }

    // ========== FORMATAÇÃO ==========
    
    const formatPhoneInput = (value) => {
        const numbers = value.replace(/\D/g, '');
        const limited = numbers.slice(0, 13);
        
        if (limited.length === 0) return '';
        
        let formatted = '';
        
        if (limited.length >= 1) {
            formatted = '+55';
        }
        
        if (limited.length > 2) {
            formatted += ' ';
        }
        
        if (limited.length > 2) {
            formatted += '(' + limited.slice(2, 4);
        }
        
        if (limited.length >= 4) {
            formatted += ')';
        }
        
        if (limited.length > 4) {
            formatted += ' ';
        }
        
        if (limited.length > 4) {
            formatted += limited.slice(4, 9);
        }
        
        if (limited.length > 9) {
            formatted += '-' + limited.slice(9, 13);
        }
        
        return formatted;
    }

    // ========== HANDLERS ==========
    
    const handleNameChange = (e) => {
        const value = e.target.value
        setLoginData({...loginData, name: value})
        
        if (errors.name) {
            setErrors({...errors, name: ''})
        }
    }

    const handlePhoneChange = (e, isUpdate = false) => {
        const value = e.target.value;
        const currentPhone = isUpdate ? update.phone : loginData.phone;
        
        if (value.length < currentPhone.length) {
            const numbers = value.replace(/\D/g, '');
            const formatted = formatPhoneInput(numbers);
            
            if (isUpdate) {
                setUpdate({...update, phone: formatted});
                if (errors.updatePhone) {
                    setErrors({...errors, updatePhone: ''});
                }
            } else {
                setLoginData({...loginData, phone: formatted});
                if (errors.phone) {
                    setErrors({...errors, phone: ''});
                }
            }
            return;
        }
        
        const formatted = formatPhoneInput(value);
        
        if (isUpdate) {
            setUpdate({...update, phone: formatted});
            if (errors.updatePhone) {
                setErrors({...errors, updatePhone: ''});
            }
        } else {
            setLoginData({...loginData, phone: formatted});
            if (errors.phone) {
                setErrors({...errors, phone: ''});
            }
        }
    }

    // ✅ CONECTA COM API REAL
    const handleLogin = async () => {
        const newErrors = {}
        
        const nameValidation = validateName(loginData.name)
        if (!nameValidation.valid) {
            newErrors.name = nameValidation.message
        }
        
        const phoneValidation = validatePhone(loginData.phone)
        if (!phoneValidation.valid) {
            newErrors.phone = phoneValidation.message
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
        
        try {
            // ✅ DADOS ENVIADOS PARA API
            const dataToSend = {
                name: loginData.name.trim(),
                phone: phoneValidation.normalized, // Ex: 5585999999999
                devices: loginData.devices
            }
            
            console.log('📤 Enviando para API:', dataToSend)
            
            // ✅ CHAMA API REAL
            const response = await addUser(dataToSend)
            
            console.log('✅ Resposta da API:', response)
            
            if (response.sucesso) {
                alert(`✅ ${response.mensagem}\n\nNome: ${response.usuario.nome}\nWhatsApp: ${phoneValidation.formatted}\nDispositivo: ${response.usuario.sistema}\nConsumo: ${response.usuario.consumo} créditos`)
                
                // Limpa formulário
                setLoginData({ name: '', phone: '', devices: 'Android' })
                setErrors({})
            } else {
                alert('❌ ' + response.mensagem)
            }
            
        } catch (error) {
            console.error('❌ Erro no handleLogin:', error)
            alert('❌ Erro ao fazer login: ' + error.message)
        }
    }

    // ✅ CONECTA COM API REAL
    const handleUpdate = async () => {
        const newErrors = {}
        
        const phoneValidation = validatePhone(update.phone)
        if (!phoneValidation.valid) {
            newErrors.updatePhone = phoneValidation.message
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
        
        try {
            // ✅ DADOS ENVIADOS PARA API
            const dataToSend = {
                phone: phoneValidation.normalized, // Ex: 5585999999999
                newDevices: update.newDevices
            }
            
            console.log('📤 Enviando para API:', dataToSend)
            
            // ✅ CHAMA API REAL
            const response = await updateUser(dataToSend)
            
            console.log('✅ Resposta da API:', response)
            
            if (response.sucesso) {
                alert(`✅ ${response.mensagem}\n\nWhatsApp: ${phoneValidation.formatted}\nNovo Dispositivo: ${response.usuario.sistema}`)
                
                setUpdate({ phone: '', newDevices: 'Android' })
                setErrors({})
            } else {
                alert('❌ ' + response.mensagem)
            }
            
        } catch (error) {
            console.error('❌ Erro no handleUpdate:', error)
            alert('❌ Erro ao atualizar: ' + error.message)
        }
    }

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
                                <button onClick={() => {
                                    setActiveTab('login')
                                    setErrors({})
                                }} className={`relative flex-1 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'login' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl transform scale-105' : 'text-orange-800 hover:bg-white hover:bg-opacity-20'}`}> 
                                    <User className="w-5 h-5 inline mr-2" /> 
                                    ENTRAR
                                    {activeTab === 'login' && (
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-bounce"></div> 
                                    )}
                                </button>
                                <button onClick={() => {
                                    setActiveTab('update')
                                    setErrors({})
                                }} className={`relative flex-1 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'update' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl transform scale-105' : 'text-orange-800 hover:bg-white hover:bg-opacity-20'}`}>
                                    <RefreshCw className="w-5 h-5 inline mr-2" />
                                    ATUALIZAR
                                    {activeTab === 'update' && (
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-bounce"></div>
                                    )}
                                </button>
                            </div>
                        </div>

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
                                            <label className="block text-sm font-bold text-orange-800 mb-3">
                                                <User className="w-4 h-4 inline mr-2" />
                                                Nome / Apelido
                                            </label>
                                            <input 
                                                type="text" 
                                                value={loginData.name} 
                                                onChange={handleNameChange}
                                                className={`w-full px-6 py-4 border-2 rounded-2xl focus:outline-none transition-all duration-300 bg-gradient-to-r from-yellow-50 to-orange-50 text-red-900 placeholder-orange-400 text-lg shadow-inner hover:shadow-lg ${
                                                    errors.name ? 'border-red-500 focus:border-red-600' : 'border-yellow-300 focus:border-orange-500'
                                                }`}
                                                placeholder="Seu nome ou apelido"
                                                disabled={isLoading}
                                            />
                                            {errors.name && (
                                                <p className="text-red-600 text-sm mt-2 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    {errors.name}
                                                </p>
                                            )}
                                            <p className="text-xs text-orange-600 mt-1 font-semibold">
                                                ℹ️ Digite apenas seu NOME, não email
                                            </p>
                                        </div>
                                        
                                        <div className="relative">
                                            <label className="block text-sm font-bold text-orange-800 mb-3">
                                                <Phone className="w-4 h-4 inline mr-2" />
                                                Número do WhatsApp
                                            </label>
                                            <input 
                                                type="tel" 
                                                value={loginData.phone} 
                                                onChange={(e) => handlePhoneChange(e, false)}
                                                className={`w-full px-6 py-4 border-2 rounded-2xl focus:outline-none transition-all duration-300 bg-gradient-to-r from-yellow-50 to-orange-50 text-red-900 placeholder-orange-400 text-lg shadow-inner hover:shadow-lg ${
                                                    errors.phone ? 'border-red-500 focus:border-red-600' : 'border-yellow-300 focus:border-orange-500'
                                                }`}
                                                placeholder="+55 (85) 99999-9999"
                                                disabled={isLoading}
                                                inputMode="numeric"
                                            />
                                            {errors.phone && (
                                                <p className="text-red-600 text-sm mt-2 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    {errors.phone}
                                                </p>
                                            )}
                                            <p className="text-xs text-orange-600 mt-1 font-semibold">
                                                ℹ️ Use o número do WhatsApp (com 9 da operadora)
                                            </p>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-bold text-orange-800 mb-3">
                                                <Smartphone className="w-4 h-4 inline mr-2" />
                                                Dispositivo
                                            </label>
                                            <select 
                                                value={loginData.devices} 
                                                onChange={(e) => setLoginData({...loginData, devices: e.target.value})} 
                                                className="w-full px-6 py-4 border-2 border-yellow-300 rounded-2xl focus:border-orange-500 focus:outline-none transition-all duration-300 bg-gradient-to-r from-yellow-50 to-orange-50 text-red-900 text-lg shadow-inner hover:shadow-lg cursor-pointer"
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
                                            className="w-full bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"> 
                                            {isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                                    Conectando... 
                                                </>
                                            ) : (
                                                <>
                                                    <MessageCircle className="w-6 h-6 mr-3" />
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
                                                onChange={(e) => handlePhoneChange(e, true)}
                                                className={`w-full px-6 py-4 border-2 rounded-2xl focus:outline-none transition-all duration-300 bg-gradient-to-r from-yellow-50 to-orange-50 text-red-900 placeholder-orange-400 text-lg shadow-inner hover:shadow-lg ${
                                                    errors.updatePhone ? 'border-red-500 focus:border-red-600' : 'border-yellow-300 focus:border-orange-500'
                                                }`}
                                                placeholder="+55 (85) 99999-9999"
                                                disabled={isLoading}
                                                inputMode="numeric"
                                            />
                                            {errors.updatePhone && (
                                                <p className="text-red-600 text-sm mt-2 flex items-center">
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    {errors.updatePhone}
                                                </p>
                                            )}
                                            <p className="text-xs text-orange-600 mt-1 font-semibold">
                                                ℹ️ Use o número do WhatsApp cadastrado
                                            </p>
                                        </div>
                                        
                                        <div className="relative"> 
                                            <label className="block text-sm font-bold text-orange-800 mb-3">
                                                <Smartphone className="w-4 h-4 inline mr-2" />
                                                Novo Dispositivo
                                            </label>
                                            <select 
                                                value={update.newDevices} 
                                                onChange={(e) => setUpdate({...update, newDevices: e.target.value})}
                                                className="w-full px-6 py-4 border-2 border-yellow-300 rounded-2xl focus:border-orange-500 focus:outline-none transition-all duration-300 bg-gradient-to-r from-yellow-50 to-orange-50 text-red-900 text-lg shadow-inner hover:shadow-lg cursor-pointer"
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
                                            className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                                            {isLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                                    Atualizando...
                                                </>
                                            ) : (
                                                <>
                                                    <RefreshCw className="w-6 h-6 mr-3" />
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