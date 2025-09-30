import { Zap, Crown, Cherry, CheckCircle, AlertCircle, Clock, Check, Phone, ArrowLeft, QrCode, Copy, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { pesquisarNumero, gerarPagamentos, VerificarStatusPagamento, inicarVerificar, processarConsumo } from '../API/pagamentos.js'

const Pagamentos = () => {
const [particulas, setParticulas] = useState([])
const [activeStep, setActeveStep] = useState('planos') // ERA: setActeveStep
const [selectePlano, setSelectePlano] = useState(null)
const [email, setEmail] = useState('')
const [phonerNumber, setPhonerNumber] = useState('') // // ERA: phonerNumber
const [copy, setCopy] = useState(false)
const [paymentStatus, setPaymentStatus] = useState(null)
const [paymentId, setPaymentId] = useState(null)
const [statusMessage, setStatusMessage] = useState('')
const [isChecking, setIsChecking] = useState(false)
const [loading, setLoagind] = useState(false) // ERA: setLoagind
const [pixData, setPixData] = useState({
    pixCode: "",  // era qr_code
    qrCode: "",  // era qr_image
    paymentId: ""
})




//dados dos planos
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
}
]


const handEmailEnviar = async () => {
    if (!email.trim()) {
        alert('Por favor, preencha seu email')
        return
    }
    if (!phonerNumber.trim()) {
        alert('Por favor, preencha seu número do WhatsApp')
        return
    }
    if (!selectePlano) {
        alert('Selecione um plano de consumo primeiro')
        return
    }
    setLoagind(true)

    const numeroLimpo = phonerNumber.replace(/\D/g, '')
    const resultadoPesquisar = await pesquisarNumero(numeroLimpo)

    if (!resultadoPesquisar.sucesso) {
        alert('Erro ao validar número: ' + resultadoPesquisar.mensagem)
        setLoagind(false)
        return
    }

    if (!resultadoPesquisar.mensagem) {
        alert('Número não encontrado no sistema. Faça o cadastro primeiro')
        setLoagind(false)
        return
    }

    //noticar pagamentos
    const resultadoPagamentos = await gerarPagamentos(
        selectePlano.price,
        email,
        numeroLimpo,
        selectePlano.consumo
    )
    setLoagind(false)
    //const resultadoPagamento = await gerarPagamentos(selectePlano.price, email)
    
    if (resultadoPagamentos.erro) {
        alert('Erro ao gerar pagamento: ' + resultadoPagamentos.erro)
        return
    }
    
    // Verificar se os dados esperados existem
    if (!resultadoPagamentos.pixCode || !resultadoPagamentos.qrCode) {
        alert('Dados de pagamento incompletos. Tente novamente.');
        return;
    }
    
    console.log('✅ Definindo pixData com:', {
        pixCodeLength: resultadoPagamentos.pixCode?.length,
        qrCodeLength: resultadoPagamentos.qrCode?.length
    });
    
    setPixData(resultadoPagamentos)
    setPaymentId(resultadoPagamentos.paymentId)
    setActeveStep('payment')
    inicarVerificar(resultadoPagamentos.paymentId, handUpgradeStatus, 10000)
}

const handUpgradeStatus = (resultado) => {
    if (resultado.erro) {
        console.error('erro na verificação:', resultado.erro)
        return
    }

    setPaymentStatus(resultado.status)
    setStatusMessage(resultado.status_descrisao)
    setIsChecking(true)

    if (resultado.status === 'approved') {
    setStatusMessage('pagamento aprovado! processando consumo...')
    processarConsumoAprovado(resultado.payment_id)
}

}

//função par processar cunsmo aprovado
const processarConsumoAprovado = async (paymentId) => {
    try {
        const resultado = await processarConsumo(paymentId)
        if (resultado.sucesso) {
            setStatusMessage('consumo adicionado com sucesso')
            setActeveStep('success')
        } else {
            setStatusMessage('erro ao processar consumo:' + resultado.erro)
        }

    } catch (error) {
        console.error('erro ao processar consumo:', error)
        setStatusMessage('erro interno ao processar consumo')
    }
}

//função para verificar status menualmente
const verificarStatus = async () => {
    const resultado = await VerificarStatusPagamento(paymentId)

    if(resultado.erro) {
        alert('erro ao verificar status:' + resultado.erro)
    } else {
        handUpgradeStatus(resultado)
    }
    setIsChecking(false)
}


const copyPixCode = () => {
    if (!pixData.pixCode) {
        alert('Código PIX não disponível');
        return;
    }
    
    navigator.clipboard.writeText(pixData.pixCode)
    setCopy(true)
    setTimeout(() => setCopy(false), 2000)
}



const black = () => {
    setActeveStep('planos')
    setSelectePlano(null)
    setEmail('')
    setPhonerNumber('')
}

//função de formater o número do Whastapp
// Função modificada para adicionar 55 automaticamente
const formatePhoner = (value) => {
    let numbers = value.replace(/\D/g, '')
    
    // Se não começa com 55 e tem pelo menos 2 dígitos, adicionar 55
    if (numbers.length >= 2 && !numbers.startsWith('55')) {
        numbers = '55' + numbers
    }
    
    // Formatação visual
    if (numbers.length <= 2) {
        return numbers
    } else if (numbers.length <= 4) {
        return `+${numbers.slice(0, 2)} (${numbers.slice(2)})`
    } else if (numbers.length <= 9) {
        return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4)}`
    } else {
        return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 9)}-${numbers.slice(9, 13)}`
    }
}





const handPhonerChange = (e) => {
    const frontted = formatePhoner(e.target.value)
    setPhonerNumber(frontted)
}

const handPlanosSelecte = (plan) => {
    setSelectePlano(plan)
}

useEffect(() => {
    const newParticulas = []
    for (let i = 0; i < 12; i++) {
        newParticulas.push({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 6 + 3,
            speed: Math.random() * 3 + 2,
            delay: Math.random() * 3
        })
}
setParticulas(newParticulas)
}, [])

   return ( 
    <>
<div className="min-h-screen relative overflow-hidden" style={{background: 'linear-gradient(135deg, #D9BAD1 0%, #BBE8F2 25%, #A68B3C 50%, #732020 75%, #BF3939 100%)'}}>
    <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20"></div>

    <div className="absolute inset-0 pointer-events-none">
        {particulas.map((partes) => (
            <div key={partes.id} className="absolute rounded-full bg-white/20 float-payment"
            style={{ left: `${partes.x}%`, top: `${partes.y}%`, width: `${partes.size}px`, height: `${partes.size}px`, animationDirection: `${partes.speed + 2}s`, animationDelay: `${partes.delay}s`}}></div>
        ))}
    </div>

    {/* elementos */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2"></div>

<div className="relative z-10 min-h-screen p-4 flex items-center justify-center">
    <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {activeStep === 'planos' ? 'Escolha seu plano' : 
             activeStep === 'payment' ? 'Pagamento PIX' : 
             'Pagamento Aprovado!'}
          </h1>
          <p className="text-white/80 text-lg">
          {activeStep === 'planos' ? 'Selecione a quantidade de créditos que deseja adquirir' : 
           activeStep === 'payment' ? 'Escaneie o QR Code ou copie o código PIX' :
           'Seus créditos foram adicionados com sucesso!'}
          </p>
        </div>

        {activeStep === 'planos' && (
            <div className="space-y-8">
                {/*Grade de planos de consumo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {planos.map((plan) => {
                        const IconComponent = plan.icon
                        return (
                            <div key={plan.id} className={`plan-card relative cursor-pointer rounded-3xl p-6 backdrop-blur-sm border-2 transition-all duration-300
                                ${selectePlano?.id === plan.id ? 'border-white shadow-2xl scale-105' : 'border-white/30 hover:border-white/60'} ${plan.bgColor} ${plan.popular ? 'shine-effect' : ''}`}
                                onClick={() => handPlanosSelecte(plan)} style={{boxShadow: selectePlano?.id === plan.id ? '0 20px rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}}>
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                           <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                            MAIS POPULAR
                                            </div> 
                                        </div>
                                    )}

                                    <div className="text-center">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                                           <IconComponent className="w-8 h-8 text-white"></IconComponent> 
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
                                                <Check className="w-4 h-4 mr-2 text-green-600"></Check>
                                                Consumo instantâneos
                                            </div>
                                            <div className="text-sm text-gray-600 flex items-center justify-center">
                                                <Check className="w-4 h-4 mr-2 text-green-600"></Check>
                                                Sem taxas extras
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 mx-auto transition-all duration-300 ${selectePlano?.id === plan.id ? 'border-white bg-white' : 'border-gray-400'}`}>
                                            {selectePlano?.id === plan.id && (
                                                <Check className="w-4 h-4 text-gray-800 m-0.5"></Check>
                                            )}
                                        </div>
                                    </div>
                                </div>
                        )
                    })}
                </div>
                {/*formulario */}
                {selectePlano && (
                    <div className="max-w-md mx-auto">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/50">
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Plano Selecionado: R$ {selectePlano.price.toFixed(2).replace('.', ',')}
                            </h3>
                            <p className="text-gray-600">+{selectePlano.consumo} consumo</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <Mail className="w-4 h-4 inline mr-2"></Mail>
                                    Email para confirmação
                                </label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
                                placeholder="seu@email.com"></input>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <Phone className="w-4 h-4 inline mr-2"></Phone>
                                    Número do WhatsApp
                                </label>
                                <input type="tel" value={phonerNumber} onChange={handPhonerChange} maxLength={18} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
                                placeholder="(11) 99999-9999"></input>
                                <p className="text-xs text-orange-600 mt-1 font-semibold">
                                    Use o mesmo número do seu WhatsApp para evitar erros na confirmação
                                </p>
                            </div>
                           <button 
                onClick={handEmailEnviar} 
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                style={{background: 'linear-gradient(135deg, #732020, #BF3939)'}}
            >
                {loading ? 'PROCESSANDO...' : 'CONFIRMA E PAGAR'}
            </button>
                        </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Tela de pagamento */}
        {activeStep === 'payment' && selectePlano && (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
                <button onClick={black} className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2"></ArrowLeft>
                    Voltar ao pedido
                </button>
                
                <div className="text-center mb-8 p-4 rounded-2xl" style={{backgroundColor: '#D9BAD1'}}>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Resumo do Pedido
                    </h3>
                    <div className="text-lg text-gray-700">
                        <span className="font-semibold">R$ {selectePlano.price.toFixed(2).replace('.', ',')}</span>
                        <span className="mx-2">•</span>
                        <span>+{selectePlano.consumo} Consumo</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                        Email: {email} • WhatsApp: {phonerNumber}
                    </div>
                </div>

                {/* Status do pagamento */}
                {paymentStatus && (
                    <div className={`p-4 rounded-xl mb-6 ${
                        paymentStatus === 'approved' ? 'bg-green-100' :
                        paymentStatus === 'pending' ? 'bg-yellow-100' :
                        'bg-red-100'
                    }`}>
                        <div className="flex items-center justify-between">
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
                            <button 
                                onClick={verificarStatus}
                                disabled={isChecking}
                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                            >
                                {isChecking ? 'Verificando...' : 'Atualizar'}
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="text-center">
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-center">
                            <QrCode className="w-5 h-5 mr-2"></QrCode>
                            Escaneie o QR Code
                        </h4>
                        <div className="bg-white p-4 rounded-2xl shadow-lg inline-block">
                            {pixData.qrCode ? (
                                <img 
                                    src={pixData.qrCode}
                                    alt="QR Code PIX" 
                                    className="w-48 h-48 rounded-xl"
                                    onError={(e) => {
                                        console.error('Erro ao carregar imagem QR:', e);
                                    }}
                                    onLoad={() => {
                                        console.log('QR Code carregado com sucesso');
                                    }}
                                />
                            ) : (
                                <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <QrCode className="w-16 h-16 mx-auto mb-2"></QrCode>
                                        <p>Carregando QR Code...</p>
                                        <p className="text-sm">R$ {selectePlano.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/*código pix */}
                   <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-4">
                            Ou copie o código PIX
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-xl mb-4">
                            <p className="text-sm text-gray-600 break-all font-mono">
                                {pixData.pixCode || 'Carregando código PIX...'}
                            </p>
                        </div>
                        <button 
                            onClick={copyPixCode} 
                            disabled={!pixData.pixCode}
                            className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center ${
                                copy ? 'bg-green-500 hover:bg-green-600' : 'hover:shadow-lg'
                            } ${!pixData.pixCode ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            style={{backgroundColor: copy ? undefined : "#732020"}}
                        >
                            <Copy className="w-5 h-5 mr-2"></Copy>
                            {copy ? 'CÓDIGO COPIADO!' : (pixData.pixCode ? 'COPIAR CÓDIGO PIX' : 'CARREGANDO...')}
                        </button>
                    </div>
                </div>
                
                <div className="mt-8 p-4 rounded-xl" style={{backgroundColor: '#BBE8F2'}}>
                    <h5 className="font-bold text-gray-800 mb-2">Como pagar:</h5>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                        <li>Abra seu app bancário ou carteira digital</li>
                        <li>Escolha a opção PIX</li>
                        <li>Escaneie o QR Code ou cole o código</li>
                        <li>Confirme o pagamento de R$ {selectePlano.price.toFixed(2).replace('.', ',')}</li>
                        <li>Seus consumo serão adicionados automaticamente</li>
                    </ol>
                </div>
                </div>
            </div>
        )}

        {/* Tela de sucesso */}
        {activeStep === 'success' && (
            <div className="max-w-md mx-auto text-center">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                        Pagamento Aprovado!
                    </h3>
                  

                    <p className="text-gray-600 mb-6">
                        Seus {statusMessage.consumo} créditos foram adicionados com sucesso!
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full py-3 rounded-xl font-bold text-white"
                        style={{background: 'linear-gradient(135deg, #732020, #BF3939)'}}
                    >
                        FAZER NOVA RECARGA
                    </button>
                </div>
            </div>
        )}
    </div>
</div>
</div> 

  <style>
            {`
            @keyframes float-payment {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                25% { transform: translateY(-15px) rotate(2deg); }
                75% { transform: translateY(-8px) rotate(-2deg); }
            }
            
            @keyframes pulse-glow {
                0%, 100% { box-shadow: 0 0 20px rgba(217, 186, 209, 0.3); }
                50% { box-shadow: 0 0 40px rgba(217, 186, 209, 0.6); }
            }
            
            @keyframes bounce-slow {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes shine {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            .float-payment { animation: float-payment 4s ease-in-out infinite; }
            .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
            .bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
            .plan-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
            .plan-card:hover { transform: translateY(-8px) scale(1.02); }
            .shine-effect { position: relative; overflow: hidden; }
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
</>    
);
}
 
export default Pagamentos;