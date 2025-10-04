import { useState } from 'react';

const API_BASE_URL = 'https://cosette.uno'; // Ajuste conforme necessário

export const useApi = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    
    const clearError = () => setError(null)

    // Função para adicionar usuário (login)
    const addUser = async (userData) => {
        setIsLoading(true);
        setError(null);
        
        try {
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
            })

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.mensagem || 'Erro na requisição');
            }

            // Verificar se a operação foi bem-sucedida
            if (!data.sucesso) {
                throw new Error(data.mensagem || 'Operação não foi bem-sucedida');
            }

            return data
            
        } catch (error) {
            console.error('Erro ao adicionar usuário:', error)
            const errorMessage = error.message || 'Erro de conexão com o servidor'
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    };

    // Função para atualizar usuário
    const updateUser = async (updateData) => {
        setIsLoading(true)
        setError(null)
        
        try {
            const response = await fetch(`${API_BASE_URL}/atualizar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: updateData.phone,
                    newDevices: updateData.newDevices
                })
            })

            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.mensagem || 'Erro na requisição')
            }

            // Verificar se a operação foi bem-sucedida
            if (!data.sucesso) {
                throw new Error(data.mensagem || 'Operação não foi bem-sucedida')
            }

            return data
            
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error)
            const errorMessage = error.message || 'Erro de conexão com o servidor'
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    };

    // Função para listar usuários (útil para debug)
    const listUsers = async () => {
        setIsLoading(true)
        setError(null)
        
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios`)
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.mensagem || 'Erro na requisição')
            }

            return data
            
        } catch (error) {
            console.error('Erro ao listar usuários:', error)
            const errorMessage = error.message || 'Erro de conexão com o servidor'
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    };

    

    return {
        isLoading,
        error,
        clearError,
        addUser,
        updateUser,
        listUsers
    };
};