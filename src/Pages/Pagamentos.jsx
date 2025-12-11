import { Zap, Crown, CheckCircle, AlertCircle, Clock, Check, Phone, ArrowLeft, QrCode, Copy, Mail, Loader2, UserCheck } from "lucide-react";
import { useState } from "react";
// ✅ IMPORTA AS FUNÇÕES DA API
import { pesquisarNumero, gerarPagamento, iniciarVerificacaoAutomatica } from '../API/pagamentos';

const Pagamentos = () => {
const [activeStep, setActiveStep] = useState('planos')
const [selectedPlan, setSelectedPlan] = useState(null)
const [email, setEmail] = useState('')
const [phoneNumber, setPhoneNumber] = useState('')
const [copy, setCopy] = useState(false)
const [paymentStatus, setPaymentStatus] = useState(null)
const [statusMessage, setStatusMessage] = useState('')
const [loading, setLoading] = useState(false)
const [errors, setErrors] = useState({})
const [pixData, setPixData] = useState(null)
const [userRegistered, setUserRegistered] = useState(false)
const [checkingUser, setCheckingUser] = useState(false)

const planos = [{
    id: 1,
    price: 3.00,
    consumo: 50,
    popular: false,
    icon: Zap,
    color: 'from-purple-400 to-pink-300',
    bgColor: 'bg-gradient-to-br from-purple-100 to-pink-100'
},
{
    id: 2,
    price: 10.00,
    consumo: 150,
    popular: true,
    icon: Zap,
    color: 'from-blue-400 to-cyan-300',
    bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-100'
},
{
    id: 3,
    price: 15.00,
    consumo: 250,
    popular: false,
    icon: Crown,
    color: 'from-yellow-500 to-orange-400',
    bgColor: 'bg-gradient-to-br from-yellow-100 to-orange-100'
},
{
    id: 4,
    price: 20.00,
    consumo: 400,
    popular: false,
    icon: Crown,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-gradient-to-br from-red-100 to-red-200'
}]

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}

const validatePhone = (phone) => {
    const numbers = phone.replace(/\D/g, '')
    return numbers.length >= 12 && numbers.length <= 13
}

const extractPhoneNumbers = (phone) => {
    let numbers = phone.replace(/\D/g, '')
    if (!numbers.startsWith('55')) {
        numbers = '55' + numbers
    }
    return numbers
}

const formatPhone = (value) => {
    let numbers = value.replace(/\D/g, '')
    if (numbers.startsWith('55') && numbers.length > 2) {
        numbers = numbers.slice(2)
    }
    numbers = numbers.slice(0, 11)
    if (numbers.length === 0) return ''
    if (numbers.length <= 2) return `+55 (${numbers}`
    if (numbers.length <= 7) return `+55 (${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    return `+55 (${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
}

// ✅ VERIFICAR SE USUÁRIO ESTÁ CADASTRADO (USA API IMPORTADA)
const checkUserRegistration = async (phone) => {
    setCheckingUser(true)
    setUserRegistered(false)
    
    try {
        const phoneNumbers = extractPhoneNumbers(phone)
        console.log('🔍 Verificando cadastro:', phoneNumbers)
        
        // ✅ USA FUNÇÃO IMPORTADA
        const data = await pesquisarNumero(phoneNumbers)
        console.log('📋 Resultado:', data)
        
        if (data.sucesso && data.encontrado) {
            setUserRegistered(true)
            setErrors({...errors, phone: ''})
            return true
        } else {
            setUserRegistered(false)
            setErrors({
                ...errors, 
                phone: '❌ Número não cadastrado! Faça o login primeiro na aba "Entrar"'
            })
            return false
        }
        
    } catch (error) {
        console.error('❌ Erro ao verificar:', error)
        setErrors({...errors, phone: 'Erro ao verificar cadastro'})
        return false
    } finally {
        setCheckingUser(false)
    }
}

const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value)
    setPhoneNumber(formatted)
    setUserRegistered(false)
    if (errors.phone) {
        setErrors({...errors, phone: ''})
    }
}

const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (errors.email) {
        setErrors({...errors, email: ''})
    }
}

const validateForm = () => {
    const newErrors = {}
    
    if (!email.trim()) {
        newErrors.email = 'Email é obrigatório'
    } else if (!validateEmail(email)) {
        newErrors.email = 'Email inválido'
    }
    
    if (!phoneNumber.trim()) {
        newErrors.phone = 'WhatsApp é obrigatório'
    } else if (!validatePhone(phoneNumber)) {
        newErrors.phone = 'Número inválido'
    }
    
    if (!selectedPlan) {
        newErrors.plan = 'Selecione um plano'
    }
    
    if (!userRegistered) {
        newErrors.phone = 'Verifique se o número está cadastrado primeiro'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
}

// ✅ GERAR PAGAMENTO (USA API IMPORTADA)
const handleSubmit = async () => {
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
        const telefoneNumeros = extractPhoneNumbers(phoneNumber)
        
        console.log('📤 Gerando pagamento:', {
            valor: selectedPlan.price,
            email,
            telefone: telefoneNumeros,
            consumo: selectedPlan.consumo
        })
        
        // ✅ USA FUNÇÃO IMPORTADA
        const resultado = await gerarPagamento(
            selectedPlan.price,
            email,
            telefoneNumeros,
            selectedPlan.consumo
        )
        
        console.log('📦 Resultado recebido:', resultado)
        
        if (resultado.erro) {
            alert(`❌ Erro ao gerar pagamento:\n${resultado.erro}`)
            setLoading(false)
            return
        }
        
        if (!resultado.pixCode || !resultado.qrCode || !resultado.paymentId) {
            console.error('❌ Dados incompletos:', resultado)
            alert('❌ Erro: Dados do PIX incompletos')
            setLoading(false)
            return
        }
        
        setPixData(resultado)
        setActiveStep('payment')
        setPaymentStatus('pending')
        setStatusMessage('⏳ Aguardando pagamento...')
        
        // ✅ INICIA VERIFICAÇÃO AUTOMÁTICA (USA FUNÇÃO IMPORTADA)
        iniciarVerificacaoAutomatica(resultado.paymentId, (statusResult) => {
            console.log('📊 Status atualizado:', statusResult)
            
            if (statusResult.status) {
                setPaymentStatus(statusResult.status)
                
                if (statusResult.status === 'approved' || statusResult.status === 'processed') {
                    setStatusMessage('✅ Pagamento aprovado! Créditos adicionados!')
                } else if (statusResult.status === 'pending') {
                    setStatusMessage('⏳ Aguardando pagamento...')
                } else if (statusResult.status === 'rejected') {
                    setStatusMessage('❌ Pagamento rejeitado')
                }
            }
        }, 10000)
        
    } catch (error) {
        console.error('❌ Erro no handleSubmit:', error)
        alert(`❌ Erro ao processar pagamento:\n${error.message}`)
    } finally {
        setLoading(false)
    }
}

const handleBack = () => {
    setActiveStep('planos')
    setSelectedPlan(null)
    setEmail('')
    setPhoneNumber('')
    setErrors({})
    setPixData(null)
    setPaymentStatus(null)
    setUserRegistered(false)
}

const handlePlanSelect = (plan) => {
    setSelectedPlan(plan)
    if (errors.plan) {
        setErrors({...errors, plan: ''})
    }
}

const copyPixCode = () => {
    if (pixData?.pixCode) {
        navigator.clipboard.writeText(pixData.pixCode)
        setCopy(true)
        setTimeout(() => setCopy(false), 2000)
    }
}

return ( 
<div className="min-h-screen relative overflow-hidden" style={{background: 'linear-gradient(135deg, #D9BAD1 0%, #BBE8F2 25%, #A68B3C 50%, #732020 75%, #BF3939 100%)'}}>
    <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20"></div>

<div className="relative z-10 min-h-screen p-4 flex items-center justify-center">
    <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {activeStep === 'planos' ? 'Escolha seu plano' : 'Pagamento PIX'}
          </h1>
          <p className="text-white/90 text-lg">
          {activeStep === 'planos' ? 'Selecione a quantidade de créditos que deseja adquirir' : 
           'Escaneie o QR Code ou copie o código PIX'}
          </p>
        </div>

        {activeStep === 'planos' && (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {planos.map((plan) => {
                        const IconComponent = plan.icon
                        const isSelected = selectedPlan?.id === plan.id
                        return (
                            <div 
                                key={plan.id} 
                                className={`plan-card relative cursor-pointer rounded-3xl p-6 backdrop-blur-sm border-2 transition-all duration-300
                                ${isSelected ? 'border-white shadow-2xl scale-105' : 'border-white/30 hover:border-white/60'} 
                                ${plan.bgColor} ${plan.popular ? 'shine-effect' : ''}`}
                                onClick={() => handlePlanSelect(plan)} 
                                style={{boxShadow: isSelected ? '0 20px 50px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)'}}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                       <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                        MAIS POPULAR
                                        </div> 
                                    </div>
                                )}

                                <div className="text-center">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                                       <IconComponent className="w-8 h-8 text-white" /> 
                                    </div>

                                    <div className="mb-4">
                                     <div className="text-3xl font-bold text-gray-800 mb-1">
                                        R$ {plan.price.toFixed(2).replace('.', ',')}
                                     </div>
                                     <div className="text-lg font-semibold" style={{color: '#732020'}}>
                                        +{plan.consumo} consumo 
                                     </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="text-sm text-gray-600 flex items-center justify-center">
                                            <Check className="w-4 h-4 mr-2 text-green-600" />
                                            Consumo instantâneo
                                        </div>
                                        <div className="text-sm text-gray-600 flex items-center justify-center">
                                            <Check className="w-4 h-4 mr-2 text-green-600" />
                                            Sem taxas extras
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 mx-auto transition-all duration-300 flex items-center justify-center ${isSelected ? 'border-white bg-white' : 'border-gray-400'}`}>
                                        {isSelected && <Check className="w-4 h-4 text-gray-800" />}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {selectedPlan && (
                    <div className="max-w-md mx-auto">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/50">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Plano: R$ {selectedPlan.price.toFixed(2).replace('.', ',')}
                            </h3>
                            <p className="text-gray-600">+{selectedPlan.consumo} consumo</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    Email
                                </label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={handleEmailChange}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 ${
                                        errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                    }`}
                                    placeholder="seu@email.com"
                                />
                                {errors.email && (
                                    <p className="text-red-600 text-sm mt-1 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <Phone className="w-4 h-4 inline mr-2" />
                                    WhatsApp Cadastrado
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        type="tel" 
                                        value={phoneNumber} 
                                        onChange={handlePhoneChange}
                                        className={`flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-800 ${
                                            errors.phone ? 'border-red-500' : 
                                            userRegistered ? 'border-green-500' : 'border-gray-300 focus:border-blue-500'
                                        }`}
                                        placeholder="+55 (85) 99999-9999"
                                    />
                                    <button
                                        onClick={() => checkUserRegistration(phoneNumber)}
                                        disabled={!phoneNumber || checkingUser}
                                        className={`px-4 py-3 rounded-xl font-bold text-white transition-all ${
                                            userRegistered ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'
                                        } disabled:opacity-50`}
                                    >
                                        {checkingUser ? <Loader2 className="w-5 h-5 animate-spin" /> :
                                         userRegistered ? <UserCheck className="w-5 h-5" /> : 'Verificar'}
                                    </button>
                                </div>
                                {errors.phone && (
                                    <p className="text-red-600 text-sm mt-1 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.phone}
                                    </p>
                                )}
                                {userRegistered && (
                                    <p className="text-green-600 text-sm mt-1 flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        ✅ Cadastro confirmado!
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    ⚠️ Use o mesmo número que você fez login
                                </p>
                            </div>

                            <button 
                                onClick={handleSubmit} 
                                disabled={loading || !userRegistered}
                                className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center ${
                                    loading || !userRegistered ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                style={{background: 'linear-gradient(135deg, #732020, #BF3939)'}}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        GERANDO PIX...
                                    </>
                                ) : (
                                    'CONFIRMAR E GERAR PIX'
                                )}
                            </button>
                        </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {activeStep === 'payment' && selectedPlan && pixData && (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
                <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar
                </button>
                
                <div className="text-center mb-8 p-4 rounded-2xl" style={{backgroundColor: '#D9BAD1'}}>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Resumo</h3>
                    <div className="text-lg text-gray-700">
                        <span className="font-semibold">R$ {selectedPlan.price.toFixed(2).replace('.', ',')}</span>
                        <span className="mx-2">•</span>
                        <span>+{selectedPlan.consumo} Consumo</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                        {email} • {phoneNumber}
                    </div>
                </div>

                {paymentStatus && (
                    <div className={`p-4 rounded-xl mb-6 ${
                        paymentStatus === 'approved' || paymentStatus === 'processed' ? 'bg-green-100' :
                        paymentStatus === 'pending' ? 'bg-yellow-100' :
                        'bg-red-100'
                    }`}>
                        <div className="flex items-center">
                            {paymentStatus === 'approved' || paymentStatus === 'processed' ? 
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" /> :
                            paymentStatus === 'pending' ?
                                <Clock className="w-5 h-5 text-yellow-600 mr-2" /> :
                                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                            }
                            <span className={`font-semibold ${
                                paymentStatus === 'approved' || paymentStatus === 'processed' ? 'text-green-800' :
                                paymentStatus === 'pending' ? 'text-yellow-800' :
                                'text-red-800'
                            }`}>
                                {statusMessage}
                            </span>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="text-center">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-center">
                            <QrCode className="w-5 h-5 mr-2" />
                            Escaneie o QR Code
                        </h4>
                        <div className="bg-white p-4 rounded-2xl shadow-lg inline-block">
                            <img 
                                src={pixData.qrCode} 
                                alt="QR Code PIX" 
                                className="w-48 h-48 rounded-xl"
                            />
                        </div>
                    </div>

                   <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-4">
                            Ou copie o código PIX
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-xl mb-4 max-h-32 overflow-y-auto">
                            <p className="text-xs text-gray-600 break-all font-mono">
                                {pixData.pixCode}
                            </p>
                        </div>
                        <button 
                            onClick={copyPixCode}
                            className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center ${
                                copy ? 'bg-green-500' : 'hover:shadow-lg'
                            }`} 
                            style={{backgroundColor: copy ? undefined : "#732020"}}
                        >
                            <Copy className="w-5 h-5 mr-2" />
                            {copy ? 'COPIADO!' : 'COPIAR CÓDIGO'}
                        </button>
                    </div>
                </div>
                
                <div className="mt-8 p-4 rounded-xl" style={{backgroundColor: '#BBE8F2'}}>
                    <h5 className="font-bold text-gray-800 mb-2">Como pagar:</h5>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                        <li>Abra seu app bancário</li>
                        <li>Escolha PIX</li>
                        <li>Escaneie o QR Code ou cole o código</li>
                        <li>Confirme R$ {selectedPlan.price.toFixed(2).replace('.', ',')}</li>
                        <li>Créditos adicionados automaticamente ✅</li>
                    </ol>
                </div>
                </div>
            </div>
        )}
    </div>
</div>

<style>
{`
@keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}
.plan-card { 
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
}
.plan-card:hover { 
    transform: translateY(-8px) scale(1.02); 
}
.shine-effect { 
    position: relative; 
    overflow: hidden; 
}
.shine-effect::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    animation: shine 2s infinite;
}
`}
</style>
</div>
);
}
 
export default Pagamentos;