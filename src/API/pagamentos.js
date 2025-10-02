
var apiBack = 'http://br3.bronxyshost.com:4032' // api do bank normal

export const pesquisarNumero = async (numero) => {
    try {
        const responde = await fetch(`${apiBack}/pesquisar-numero`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ numero })
        })
        
        const data = await responde.json()
        return data
        
    } catch (erro) {
        console.log('Erro ao pesquisar número:', erro)
        return { 
            sucesso: false, 
            mensagem: 'Erro ao conectar com servidor' 
        }
    }
}



export const gerarPagamentos = async (valor, email, telefone, consumo) => {
    try {
        console.log('📤 Enviando requisição para API:', { valor, email, telefone, consumo });
        
        const response = await fetch(`${apiBack}/pagar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ valor, email, telefone, consumo })
        });

        if (!response.ok) {
            console.error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
            return { 
                erro: `Erro do servidor: ${response.status}`,
                status: response.status 
            };
        }

        // 2. Verificar se há conteúdo na resposta
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);

        if (!contentType || !contentType.includes('application/json')) {
            console.warn('Resposta não é JSON válido');
            const textResponse = await response.text();
            console.log('Resposta como texto:', textResponse);
            return { erro: 'Resposta inválida do servidor' };
        }

        const data = await response.json();
        
        // 4. Verificar se os dados esperados existem
        if (!data) {
            console.error('❌ Resposta vazia da API');
            return { erro: 'Resposta vazia do servidor' };
        }
      
        if (data.error || data.erro) {
            console.error('❌ Erro retornado pela API:', data.error || data.erro);
            return { 
                erro: data.error || data.erro,
                dadosCompletos: data 
            };
        }

        // 7. Validar dados obrigatórios antes de processar
        if (data.qr_code && data.qr_image) {
            console.log('✅ Dados válidos recebidos, processando...');
            
            // Validar se qr_code não está vazio
            if (!data.qr_code.trim()) {
                console.error('❌ qr_code está vazio');
                return { erro: 'Código PIX inválido' };
            }

            // Validar se qr_image é base64 válido
            if (data.qr_image.length < 100) { // Base64 de imagem deve ter pelo menos alguns caracteres
                console.error('❌ qr_image muito pequeno, pode estar inválido');
                return { erro: 'Imagem QR code inválida' };
            }

            const resultado = {
                pixCode: data.qr_code,
                qrCode: `data:image/png;base64,${data.qr_image}`,
                paymentId: data.payment_id,
                dadosOriginais: data
            };

            console.log(' Resultado processado com sucesso:', {
                pixCodeLength: resultado.pixCode.length,
                qrCodeLength: resultado.qrCode.length,
               paymentId: resultado.paymentId
            });

            return resultado;
        } else {
            console.error('Propriedades obrigatórias ausentes:', {
                temQrCode: !!data.qr_code,
                temQrImage: !!data.qr_image,
                todasPropriedades: Object.keys(data)
            });
        }

        // Se chegou até aqui, retorna os dados como estão
        console.log('Retornando dados sem processamento específico');
        return data;

    } catch (erro) {
        console.error('Erro na requisição:', erro);
        console.error('Detalhes do erro:', {
            message: erro.message,
            stack: erro.stack,
            name: erro.name
        });
        
        return { 
            erro: 'Erro ao conectar com servidor',
            detalhesErro: erro.message 
        };
    }
}

// verificar status de pagamento
export const VerificarStatusPagamento = async (paymentId) => {
    try {
        console.log('verificando status de pagamento:', paymentId)

        const responde = await fetch(`${apiBack}/pagamento/status/${paymentId}`, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        })

        if (!responde.ok) {
            console.error(`erro ao verficar status: ${response.status}`)
            return { erro: `erro do servidor: ${response.status}`, status: responde.status}
        }

        const data = await responde.json()

        console.log('status recebido:', data)
        return data

    } catch (erro) {
        console.error('erro ao verficar status:', erro)
        return { erro: 'erro ao conectar com servidor', detalhesErro: erro.mensagem }
    }
}


export const processarConsumo = async (paymentId) => {
    try {
        console.log('processando consumo para:', paymentId)
        const responde = await fetch(`${apiBack}/processar-consumo`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({ payment_id: paymentId})
        })

        if (!responde.ok) {
            console.error(`erro ap processar consumo: ${responde.status}`)
                return { erro: `erro do servidor: ${responde.status}`, status: responde.status}
        }

        const data = await responde.json()
        console.log('consumo processado:', data)
        return data

    } catch (erro){
        console.error('erro ao processar consumo:', erro)
        return { erro: 'erro ao conectar com servidor', detalhesErro: erro.mensagem }
    }
}



//função para verificar status automaticamente
export const inicarVerificar = (paymentId, callback, intervalos = 30000) => {
    console.log('iniciando verificação automatica para:', paymentId)

    const verificar = async () => {
        const resultado = await VerificarStatusPagamento(paymentId)

        if (resultado.erro) {
            console.error('erro na verificação automatica:', resultado.erro)
            callback({ erro: resultado.erro })
            return
        }

        console.log('status atual:', resultado.status)
        callback(resultado)

        if (['approved', 'rejected', 'cancelled', 'processed'].includes(resultado.status)) {
            console.log('verificação automatica finalizada:', resultado.status)
            return
        }

        //continuar verificando se aindat está pedente
        setTimeout(verificar, intervalos)
    }
    verificar()
}


const adicionarConsumoBot = async (telefone, consumo) => {
    try {
        consoele.log(`adicionado ${consumo} consumo para ${telefone}`)

        const responde = await fetch(`${apiBack}/add-consumo`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                numero: telefone,
                consumo: parseInt(consumo)
            })
        })

        if (!responde.ok) {
            console.error(`erro no HTTP ao adicionar consumo: ${responde.status}`)
            return { sucesso: false, erro: `erro HTTP ${responde.status}`}
        }

        const resultado = await responde.json()
        console.log('resultado de adição de consumo:', resultado)

        return resultado

    } catch (error) {
        console.error('erro ao adicionar consumo no bot:', error)
        return {
            sucesso: false, erro: 'erro de conexão com o bot',
            datalhes: error.mensagem
        }
    }
}

