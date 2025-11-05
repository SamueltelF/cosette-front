import { Zap, Crown, CheckCircle, AlertCircle, Clock, Check, Phone, ArrowLeft, QrCode, Copy, Mail, Loader2 } from "lucide-react";
import { useState } from "react";

const Pagamentos = () => {
const [activeStep, setActiveStep] = useState('planos')
const [selectedPlan, setSelectedPlan] = useState(null)
const [email, setEmail] = useState('')
const [phoneNumber, setPhoneNumber] = useState('')
const [copy, setCopy] = useState(false)
const [paymentStatus, setPaymentStatus] = useState(null)
const [statusMessage, setStatusMessage] = useState('')
const [isChecking, setIsChecking] = useState(false)
const [loading, setLoading] = useState(false)
const [errors, setErrors] = useState({})

// Dados dos planos
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

// Validações
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}

const validatePhone = (phone) => {
    const numbers = phone.replace(/\D/g, '')
    return numbers.length >= 12 && numbers.length <= 13 // 55 + DDD + número
}

// Formatação de telefone CORRIGIDA
const formatPhone = (value) => {
    let numbers = value.replace(/\D/g, '')
    
    // Remove 55 inicial se já existe para evitar duplicação
    if (numbers.startsWith('55') && numbers.length > 2) {
        numbers = numbers.slice(2)
    }
    
    // Limita a 11 dígitos (DDD + número)
    numbers = numbers.slice(0, 11)
    
    // Formatação visual: +55 (XX) XXXXX-XXXX
    if (numbers.length === 0) return ''
    if (numbers.length <= 2) return `+55 (${numbers}`
    if (numbers.length <= 7) return `+55 (${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    return `+55 (${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
}

const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value)
    setPhoneNumber(formatted)
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

// Validação do formulário
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
        newErrors.phone = 'Número inválido (deve ter DDD + 9 dígitos)'
    }
    
    if (!selectedPlan) {
        newErrors.plan = 'Selecione um plano'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
    if (!validateForm()) return
    
    setLoading(true)
    
    // Simula chamada API
    setTimeout(() => {
        setLoading(false)
        setActiveStep('payment')
        setPaymentStatus('pending')
        setStatusMessage('Aguardando pagamento...')
    }, 2000)
}

const handleBack = () => {
    setActiveStep('planos')
    setSelectedPlan(null)
    setEmail('')
    setPhoneNumber('')
    setErrors({})
}

const handlePlanSelect = (plan) => {
    setSelectedPlan(plan)
    if (errors.plan) {
        setErrors({...errors, plan: ''})
    }
}

const copyPixCode = () => {
    navigator.clipboard.writeText('00020126360014BR.GOV.BCB.PIX...')
    setCopy(true)
    setTimeout(() => setCopy(false), 2000)
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
                {/* Grade de planos */}
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

                {/* Formulário MELHORADO */}
                {selectedPlan && (
                    <div className="max-w-md mx-auto">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/50">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Plano Selecionado: R$ {selectedPlan.price.toFixed(2).replace('.', ',')}
                            </h3>
                            <p className="text-gray-600">+{selectedPlan.consumo} consumo</p>
                        </div>
                        
                        <div className="space-y-4">
                            {/* Campo Email */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    Email para confirmação
                                </label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={handleEmailChange}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 ${
                                        errors.email ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-500'
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

                            {/* Campo WhatsApp */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <Phone className="w-4 h-4 inline mr-2" />
                                    Número do WhatsApp
                                </label>
                                <input 
                                    type="tel" 
                                    value={phoneNumber} 
                                    onChange={handlePhoneChange}
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 ${
                                        errors.phone ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-500'
                                    }`}
                                    placeholder="+55 (11) 99999-9999"
                                />
                                {errors.phone && (
                                    <p className="text-red-600 text-sm mt-1 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.phone}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Use o mesmo número do seu WhatsApp cadastrado
                                </p>
                            </div>

                            {/* Botão de Submissão */}
                            <button 
                                onClick={handleSubmit} 
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                style={{background: 'linear-gradient(135deg, #732020, #BF3939)'}}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        PROCESSANDO...
                                    </>
                                ) : (
                                    'CONFIRMAR E PAGAR'
                                )}
                            </button>
                        </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Tela de pagamento */}
        {activeStep === 'payment' && selectedPlan && (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
                <button onClick={handleBack} className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar ao pedido
                </button>
                
                <div className="text-center mb-8 p-4 rounded-2xl" style={{backgroundColor: '#D9BAD1'}}>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Resumo do Pedido</h3>
                    <div className="text-lg text-gray-700">
                        <span className="font-semibold">R$ {selectedPlan.price.toFixed(2).replace('.', ',')}</span>
                        <span className="mx-2">•</span>
                        <span>+{selectedPlan.consumo} Consumo</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                        Email: {email} • WhatsApp: {phoneNumber}
                    </div>
                </div>

                {/* Status do pagamento */}
                {paymentStatus && (
                    <div className={`p-4 rounded-xl mb-6 ${
                        paymentStatus === 'approved' ? 'bg-green-100' :
                        paymentStatus === 'pending' ? 'bg-yellow-100' :
                        'bg-red-100'
                    }`}>
                        <div className="flex items-center">
                            {paymentStatus === 'approved' ? 
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" /> :
                            paymentStatus === 'pending' ?
                                <Clock className="w-5 h-5 text-yellow-600 mr-2" /> :
                                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                            }
                            <span className={`font-semibold ${
                                paymentStatus === 'approved' ? 'text-green-800' :
                                paymentStatus === 'pending' ? 'text-yellow-800' :
                                'text-red-800'
                            }`}>
                                {statusMessage}
                            </span>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                   {/* QR Code */}
                   <div className="text-center">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-center">
                            <QrCode className="w-5 h-5 mr-2" />
                            Escaneie o QR Code
                        </h4>
                        <div className="bg-white p-4 rounded-2xl shadow-lg inline-block">
                            <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <QrCode className="w-16 h-16 mx-auto mb-2" />
                                    <p className="text-sm font-semibold">QR Code PIX</p>
                                    <p className="text-xs">R$ {selectedPlan.price.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Código PIX */}
                   <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-4">
                            Ou copie o código PIX
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-xl mb-4">
                            <p className="text-sm text-gray-600 break-all font-mono">
                                00020126360014BR.GOV.BCB.PIX...
                            </p>
                        </div>
                        <button 
                            onClick={copyPixCode}
                            className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center ${
                                copy ? 'bg-green-500 hover:bg-green-600' : 'hover:shadow-lg'
                            }`} 
                            style={{backgroundColor: copy ? undefined : "#732020"}}
                        >
                            <Copy className="w-5 h-5 mr-2" />
                            {copy ? 'CÓDIGO COPIADO!' : 'COPIAR CÓDIGO PIX'}
                        </button>
                    </div>
                </div>
                
                <div className="mt-8 p-4 rounded-xl" style={{backgroundColor: '#BBE8F2'}}>
                    <h5 className="font-bold text-gray-800 mb-2">Como pagar:</h5>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                        <li>Abra seu app bancário ou carteira digital</li>
                        <li>Escolha a opção PIX</li>
                        <li>Escaneie o QR Code ou cole o código</li>
                        <li>Confirme o pagamento de R$ {selectedPlan.price.toFixed(2).replace('.', ',')}</li>
                        <li>Seus créditos serão adicionados automaticamente</li>
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