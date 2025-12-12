// ✅ URL CORRETA (sem /bot)
const apiBack = 'https://cosette.uno/api/bot'

// ✅ FUNÇÃO AUXILIAR: Formatar número para padrão WhatsApp
const formatarParaWhatsApp = (numero) => {
    // Remove tudo que não é número
    let numeroLimpo = numero.replace(/\D/g, '')
    
    // Garante que começa com 55 (código do Brasil)
    if (!numeroLimpo.startsWith('55')) {
        numeroLimpo = '55' + numeroLimpo
    }
    
    // Adiciona o sufixo do WhatsApp se ainda não tiver
    if (!numeroLimpo.includes('@s.whatsapp.net')) {
        numeroLimpo = numeroLimpo + '@s.whatsapp.net'
    }
    
    console.log('📞 Número formatado:', numeroLimpo)
    return numeroLimpo
}

// ✅ Verificar se número está cadastrado
export const pesquisarNumero = async (numero) => {
    try {
        console.log('🔍 [API] Pesquisando número original:', numero)
        
        // ✅ CONVERTE PARA FORMATO WHATSAPP ANTES DE ENVIAR
        const numeroFormatado = formatarParaWhatsApp(numero)
        console.log('📱 [API] Número formatado para WhatsApp:', numeroFormatado)
        
        const response = await fetch(`${apiBack}/pesquisar-numero`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ numero: numeroFormatado })
        })
        
        if (!response.ok) {
            console.error(`❌ [API] Erro HTTP: ${response.status}`)
            return { 
                sucesso: false, 
                mensagem: 'Erro ao conectar com servidor' 
            }
        }
        
        const data = await response.json()
        console.log('✅ [API] Resultado da pesquisa:', data)
        return data
        
    } catch (erro) {
        console.error('💥 [API] Erro ao pesquisar número:', erro)
        return { 
            sucesso: false, 
            mensagem: 'Erro ao conectar com servidor' 
        }
    }
}

// ✅ Gerar pagamento PIX
export const gerarPagamento = async (valor, email, telefone, consumo) => {
    try {
        console.log('📤 [API] Enviando requisição de pagamento (original):', { 
            valor, 
            email, 
            telefone, 
            consumo 
        })
        
        // ✅ CONVERTE TELEFONE PARA FORMATO WHATSAPP
        const telefoneFormatado = formatarParaWhatsApp(telefone)
        console.log('📱 [API] Telefone formatado para WhatsApp:', telefoneFormatado)
        
        const response = await fetch(`${apiBack}/pagar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                valor, 
                email, 
                telefone: telefoneFormatado, // ✅ USA VERSÃO FORMATADA
                consumo 
            })
        })

        if (!response.ok) {
            console.error(`❌ [API] Erro HTTP: ${response.status}`)
            const errorText = await response.text()
            console.error('Resposta de erro:', errorText)
            return { 
                erro: `Erro do servidor: ${response.status}`,
                status: response.status 
            }
        }

        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
            console.warn('⚠️ [API] Resposta não é JSON')
            const textResponse = await response.text()
            console.log('Resposta como texto:', textResponse)
            return { erro: 'Resposta inválida do servidor' }
        }

        const data = await response.json()
        console.log('📦 [API] Dados recebidos:', data)
        
        if (!data) {
            console.error('❌ [API] Resposta vazia')
            return { erro: 'Resposta vazia do servidor' }
        }
      
        if (data.erro || data.error) {
            console.error('❌ [API] Erro retornado:', data.erro || data.error)
            return { 
                erro: data.erro || data.error,
                detalhes: data.detalhes,
                dadosCompletos: data 
            }
        }

        // ✅ Validar dados obrigatórios do PIX
        if (data.qr_code && data.qr_image && data.payment_id) {
            console.log('✅ [API] Dados PIX válidos!')
            
            if (!data.qr_code.trim()) {
                console.error('❌ [API] qr_code vazio')
                return { erro: 'Código PIX inválido (vazio)' }
            }

            if (data.qr_code.length < 50) {
                console.error('❌ [API] qr_code muito curto:', data.qr_code.length)
                return { erro: 'Código PIX incompleto' }
            }

            if (data.qr_image.length < 100) {
                console.error('❌ [API] qr_image muito pequeno')
                return { erro: 'Imagem QR code inválida' }
            }

            const resultado = {
                pixCode: data.qr_code,
                qrCode: `data:image/png;base64,${data.qr_image}`,
                paymentId: data.payment_id,
                valor: valor,
                consumo: consumo,
                telefoneFormatado: telefoneFormatado, // ✅ RETORNA TELEFONE FORMATADO TAMBÉM
                dadosOriginais: data
            }

            console.log('✅ [API] Resultado processado:', {
                pixCodeLength: resultado.pixCode.length,
                qrCodeLength: resultado.qrCode.length,
                paymentId: resultado.paymentId,
                telefone: resultado.telefoneFormatado
            })

            return resultado
        } else {
            console.error('❌ [API] Propriedades ausentes:', {
                temQrCode: !!data.qr_code,
                temQrImage: !!data.qr_image,
                temPaymentId: !!data.payment_id,
                todasPropriedades: Object.keys(data)
            })
            return { 
                erro: 'Dados do PIX incompletos',
                detalhes: 'qr_code, qr_image ou payment_id não retornados',
                dadosRecebidos: data
            }
        }

    } catch (erro) {
        console.error('💥 [API] Erro na requisição:', erro)
        console.error('Detalhes:', {
            message: erro.message,
            stack: erro.stack,
            name: erro.name
        })
        
        return { 
            erro: 'Erro ao conectar com servidor',
            detalhesErro: erro.message 
        }
    }
}

// ✅ Verificar status de pagamento
export const verificarStatusPagamento = async (paymentId) => {
    try {
        console.log('🔍 [API] Verificando status:', paymentId)

        const response = await fetch(`${apiBack}/pagamento/status/${paymentId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            console.error(`❌ [API] Erro ao verificar status: ${response.status}`)
            return { erro: `Erro do servidor: ${response.status}`, status: response.status }
        }

        const data = await response.json()
        console.log('✅ [API] Status recebido:', data)
        return data

    } catch (erro) {
        console.error('❌ [API] Erro ao verificar status:', erro)
        return { erro: 'Erro ao conectar com servidor', detalhesErro: erro.message }
    }
}

// ✅ Processar consumo manualmente (caso necessário)
export const processarConsumo = async (paymentId) => {
    try {
        console.log('⚙️ [API] Processando consumo para:', paymentId)
        
        const response = await fetch(`${apiBack}/processar-consumo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ payment_id: paymentId })
        })

        if (!response.ok) {
            console.error(`❌ [API] Erro ao processar: ${response.status}`)
            return { erro: `Erro do servidor: ${response.status}`, status: response.status }
        }

        const data = await response.json()
        console.log('✅ [API] Consumo processado:', data)
        return data

    } catch (erro) {
        console.error('❌ [API] Erro ao processar consumo:', erro)
        return { erro: 'Erro ao conectar com servidor', detalhesErro: erro.message }
    }
}

// ✅ Iniciar verificação automática de status
export const iniciarVerificacaoAutomatica = (paymentId, callback, intervalo = 10000) => {
    console.log('🔄 [API] Iniciando verificação automática para:', paymentId)

    const verificar = async () => {
        const resultado = await verificarStatusPagamento(paymentId)

        if (resultado.erro) {
            console.error('❌ [API] Erro na verificação:', resultado.erro)
            callback({ erro: resultado.erro })
            return
        }

        console.log('📊 [API] Status atual:', resultado.status)
        callback(resultado)

        // Para se o status for final
        if (['approved', 'rejected', 'cancelled', 'processed'].includes(resultado.status)) {
            console.log('✅ [API] Verificação finalizada:', resultado.status)
            return
        }

        // Continuar verificando se ainda está pendente
        setTimeout(verificar, intervalo)
    }
    
    verificar()
}