import { useState } from 'react';

// ✅ URL correta do backend principal
const API_BASE_URL = 'https://https://cosette.uno/api/bot';

export const useApi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const clearError = () => setError(null);

    // ✅ Função para adicionar usuário (login/cadastro)
    const addUser = async (userData) => {
        setIsLoading(true);
        setError(null);
        
        try {
            console.log('📤 Enviando dados para cadastro:', userData);
            
            // ✅ CORRIGIDO: fetch com parênteses
            const response = await fetch(`${API_BASE_URL}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userData.name,
                    phone: userData.phone,
                    devices: userData.devices
                })
            });

            const data = await response.json();
            console.log('📥 Resposta do servidor:', data);
            
            if (!response.ok) {
                throw new Error(data.mensagem || 'Erro na requisição');
            }

            // Verificar se a operação foi bem-sucedida
            if (!data.sucesso) {
                throw new Error(data.mensagem || 'Operação não foi bem-sucedida');
            }

            console.log('✅ Usuário adicionado com sucesso!');
            return data;
            
        } catch (error) {
            console.error('❌ Erro ao adicionar usuário:', error);
            const errorMessage = error.message || 'Erro de conexão com o servidor';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Função para atualizar usuário
    const updateUser = async (updateData) => {
        setIsLoading(true);
        setError(null);
        
        try {
            console.log('📤 Enviando dados para atualização:', updateData);
            
            // ✅ CORRIGIDO: fetch com parênteses
            const response = await fetch(`${API_BASE_URL}/atualizar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: updateData.phone,
                    newDevices: updateData.newDevices
                })
            });

            const data = await response.json();
            console.log('📥 Resposta do servidor:', data);
            
            if (!response.ok) {
                throw new Error(data.mensagem || 'Erro na requisição');
            }

            // Verificar se a operação foi bem-sucedida
            if (!data.sucesso) {
                throw new Error(data.mensagem || 'Operação não foi bem-sucedida');
            }

            console.log('✅ Usuário atualizado com sucesso!');
            return data;
            
        } catch (error) {
            console.error('❌ Erro ao atualizar usuário:', error);
            const errorMessage = error.message || 'Erro de conexão com o servidor';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Função para listar usuários
    const listUsers = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            console.log('📤 Buscando lista de usuários...');
            
            // ✅ CORRIGIDO: fetch com parênteses
            const response = await fetch(`${API_BASE_URL}/usuarios`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            console.log('📥 Resposta do servidor:', data);
            
            if (!response.ok) {
                throw new Error(data.mensagem || 'Erro na requisição');
            }

            console.log('✅ Usuários listados com sucesso!');
            return data;
            
        } catch (error) {
            console.error('❌ Erro ao listar usuários:', error);
            const errorMessage = error.message || 'Erro de conexão com o servidor';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Função para pesquisar se número existe
    const searchUser = async (phone) => {
        setIsLoading(true);
        setError(null);
        
        try {
            console.log('🔍 Pesquisando número:', phone);
            
            const response = await fetch(`${API_BASE_URL}/pesquisar-numero`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ numero: phone })
            });

            const data = await response.json();
            console.log('📥 Resultado da pesquisa:', data);
            
            if (!response.ok) {
                throw new Error(data.mensagem || 'Erro na requisição');
            }

            return data;
            
        } catch (error) {
            console.error('❌ Erro ao pesquisar usuário:', error);
            const errorMessage = error.message || 'Erro de conexão com o servidor';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    return {
        isLoading,
        error,
        clearError,
        addUser,
        updateUser,
        listUsers,
        searchUser
    };
};