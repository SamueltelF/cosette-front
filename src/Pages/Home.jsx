import images from '../assets/imges' 
import React, { useState, useEffect } from 'react';
import '../assets/css/styles.css'
import Footer from '../Componestes/Footer';
//import image from '../assets/imges'

// Texto para seção 
const sesoes = [
    {
        titulo: "Serviços",
        number: "#1",
        color: "has-text-info", 
        descricao: "Destiny estará disponível em três plataformas, porém, não pretendo deixá-la online 24 horas por dia para público. Isso gera custos. No entanto, posso disponibilizar o download para acesso ou venda. Os sistemas serão diferentes entre si, exigência de cada plataforma.",
        image: images.servico,
        alt: "imagem das redes sociais como WhatsApp, Discord e Telegram",
        reverse: false
    },
    {
        titulo: "Ferramentas",
        number: "#2",
        color: "has-text-info",
        descricao: "Ferramentas de entretenimento com comandos básicos e simples, além de configurações avançadas para seu grupo e usuário que utilizam o serviço. Controle seu grupo diretamente pelo privado ou site, de forma prática e eficiente",
        image: images.ferramentas,
        alt: "ferramentas como controle, administração, função e anti-link etc...",
        reverse: true
    },
    {
        titulo: "Jogos",
        number: "#3",
        color: "has-text-warning",
        descricao: "Na parte de diversão, oferecemos jogos e minijogos para entreter seu público, como campo minado, jogo de cartas, duelo e, possivelmente, até mesmo xadrez no futuro.",
        image: images.jogos,
        alt: "Jogos como jogo da velha e cartas ou até xadrez",
        reverse: false
    },
    {
        titulo: "Download",
        number: "#4",
        color: "has-text-info", 
        descricao: "Conte também com ferramentas de download para diversas plataformas, como Youtube (em vídeos e áudios), TikTok, Instagram, Twitter, Facebook, Kwai, SoundCloud e muito mais.",
        image: images.download,
        alt: "download de mídias",
        reverse: true
    }
]

const HomeSesao = () => {
    const [showMarging, setMarging] = useState(false)
    const [carregar, setCarregar] = useState(true)
    const [error, setErros] = useState(null)

    const [status, setStatus] = useState({
        totalUsuarios: 0,
        androidCount: 0,
        iphoneCount: 0, 
        webCount: 0, 
        semregistroCount: 0 
    })

    const [porcentagens, setPorcentagens] = useState({
        android: "0%", 
        iphone: "0%",
        web: "0%",
        semRegistro: "0%"
    })

    // Função para animar contadores
    const animateCount = (target, setter, duration = 2000) => {
        let start = 0
        const end = target 
        const increment = end / (duration / 16) 

        const tempo = setInterval(() => { 
            start += increment
            if (start >= end) {
                setter(Math.round(end)) 
                clearInterval(tempo)
            } else {
                setter(Math.round(start))
            }
        }, 16)
    }

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                setCarregar(true)
                const res = await fetch('https://cosette.uno/api/usuario/client/stats')
                if (!res.ok) {
                    throw new Error('Erro ao carregar dados')
                }

                const data = await res.json()

                if (data.sucesso) {
                    const apiStatus = {
                        totalUsuarios: data.total_usuarios,
                        androidCount: data.sistemas.android,
                        iphoneCount: data.sistemas.iphone, 
                        webCount: data.sistemas.web, 
                        semregistroCount: data.sistemas.sem_sistema 
                    }

                    // Animar contadores após pequeno delay
                    setTimeout(() => {
                        animateCount(apiStatus.totalUsuarios, (val) => setStatus(prev => ({ ...prev, totalUsuarios: val })))
                        animateCount(apiStatus.androidCount, (val) => setStatus(prev => ({ ...prev, androidCount: val })))
                        animateCount(apiStatus.iphoneCount, (val) => setStatus(prev => ({ ...prev, iphoneCount: val })))
                        animateCount(apiStatus.webCount, (val) => setStatus(prev => ({ ...prev, webCount: val })))
                        animateCount(apiStatus.semregistroCount, (val) => setStatus(prev => ({ ...prev, semregistroCount: val })))
                    }, 500)

                    setPorcentagens(data.porcentagens)
                    setMarging(data.sistemas.sem_sistema > 0)
                } else {
                    throw new Error('Resposta da API indica falha')
                }
            } catch (err) {
                setErros(err.message)
                console.log('Erro ao buscar dados:', err)
            } finally {
                setCarregar(false)
            }
        }
        fetchStatus()
    }, [])

    if (carregar) {
        return (
            <section id='status' className='section' style={{ background: 'white', paddingTop: '4rem', paddingBottom: '4rem' }}>
                <div className='container'>
                    <div className='has-text-centered'>
                        <div className='is-loading' style={{ 
                            width: '50px', 
                            height: '50px', 
                            border: '3px solid #667eea', 
                            borderTop: '3px solid transparent', 
                            borderRadius: '50%', 
                            margin: '0 auto', 
                            animation: 'spin 1s linear infinite' 
                        }}></div>
                        <p className='mt-4 title is-5'>Carregando dados...</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <>
            {/* seção principal */}
            <section className='hero is-fullheight bg-[#D9D9D9]'>
                <div className='hero-body m-4'>
                    <div className='container'>
                        <div className='columns is-vcentered'>
                            <div className='column is-6'>
                                <p className='title is-2 has-text-white has-text-weight-bold'>
                                    Hora de adicionar <mark>DESTINY</mark> em seu grupo
                                </p>
                                <p className='subtitle texto is-size-6 mt-3'>
                                    🎮 Jogos interativos para entreter todo mundo.<br />
                                    😂 Comandos divertidos para animar o chat.<br />
                                    🛡️ Proteção contra spam e usuários indesejados.<br /><br />
                                    Adicione agora e aproveite!
                                </p>
                                <div className='buttons'>
                                    <a href='#' className='button is-danger is-info'>
                                        <strong>Add BOT</strong>
                                    </a>
                                    <a href='#' className='button is-warning is-outlined has-text-white'>
                                        <strong><i className='fas fa-crown'></i> Premium</strong>
                                    </a>
                                    <a href='#' className='button is-info is-outlined' style={{ borderColor: '#BBE8F2', background: '#BBE882' }}>
                                        <strong><i className='fa-solid fa-plug'></i> API</strong>
                                    </a>
                                </div>
                            </div>
                            <div className='column mt-6' data-aos="fade-left">
                                <img className='image has-image-centered vert-move mt-4 pro-des' src={images.destiny} alt='foto da destiny' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='has-text-centered pb-6'>
                    <a href='#features'>
                        <i className='fa-solid fa-circle-chevron-down fa-2x has-text-white' style={{ animation: 'bounce 2s infinite' }}></i>
                    </a>
                </div>
            </section>

            {/* SVG Wave */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style={{ display: 'block' }}>
                <path 
                    fill="#D9D9D9" 
                    fillOpacity="1"
                    d="M0,288L24,261.3C48,235,96,181,144,154.7C192,128,240,128,288,149.3C336,171,384,213,432,202.7C480,192,528,128,576,133.3C624,139,672,213,720,213.3C768,213,816,139,864,101.3C912,64,960,64,1008,106.7C1056,149,1104,235,1152,240C1200,245,1248,171,1296,144C1344,117,1392,139,1416,149.3L1440,160L1440,0L1416,0C1392,0,1344,0,1296,0C1248,0,1200,0,1152,0C1104,0,1056,0,1008,0C960,0,912,0,864,0C816,0,768,0,720,0C672,0,624,0,576,0C528,0,480,0,432,0C384,0,336,0,288,0C240,0,192,0,144,0C96,0,48,0,24,0L0,0Z">
                </path>
            </svg>

            {/* seção de login e consumo */}
            <section className='section'>
                <div className='container'>
                    <div className='columns is-vcentered'>
                        <div className='column is-6'>
                            <div className='box' style={{
                                background: 'rgba(255, 255, 255, 0.95)', 
                                borderRadius: '20px',
                                padding: '3rem',
                                boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
                            }}>
                                <div className='has-text-centered mb-4'>
                                    <span className='icon is-large has-text-primary'>
                                        <i className='fa-solid fa-user-plus fa-3x'></i>
                                    </span>
                                </div>
                                <h3 className='title is-4 has-text-centered has-text-primary'>Login</h3>
                                <p className='has-text-centered mb-4'>Faça login no sistema para gerenciar o bot diretamente do site</p>
                                <div className='has-text-centered'>
                                    <a href='/loginBot' className='button is-primary is-large is-fullwidth'>
                                        <strong><i className='fa-solid fa-sign-in-alt mr-2'></i>Fazer Login</strong>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className='column is-6'>
                            <div className="box" style={{ 
                                background: 'rgba(255, 255, 255, 0.95)', 
                                borderRadius: '20px',
                                padding: '3rem',
                                boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
                            }}>
                                <div className='has-text-centered mb-4'>
                                    <span className='icon is-large has-text-warning'>
                                        <i className='fa-solid fa-shopping-cart fa-3x'></i>
                                    </span>
                                </div>
                                <h3 className='title is-4 has-text-centered has-text-warning'>Comprar Consumo</h3>
                                <p className='has-text-centered mb-4'>Adquira mais consumo sobre bot e mantenha todas as funcionalidades ativas.
                                    Diferentes planos disponíveis para atender suas necessidades 
                                </p>
                                <div className='has-text-centered'>
                                    <a href='/consumo' className='button is-warning is-large is-fullwidth'>
                                        <strong><i className='fas fa-credit-card mr-2'></i>Comprar Consumo</strong>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* seção de conteúdo sobre bot */}
            <section id='sesoes' className='section' style={{ background: '#f5f5f5', paddingTop: '4rem', paddingBottom: '4rem' }}>
                <div className='container'>
                    <div className='has-text-centered mb-6'>
                        <h1 className='title is-2'>Descrição</h1>
                        <div style={{ width: '100px', height: '4px', background: '#667eea', margin: '0 auto', borderRadius: '2px' }}></div>
                    </div>
                    {sesoes.map((sesao, index) => ( 
                        <div key={index} className='mb-6'>
                            <div className={`columns is-vcentered ${sesao.reverse ? 'is-reverse-mobile' : ''}`}>
                                <div className={`column is-6 ${sesao.reverse ? 'is-offset-1' : ''}`}>
                                    <div className='box' style={{ border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', borderRadius: '15px' }}>
                                        <h4 className='title is-4'>
                                            {sesao.titulo} <span className={sesao.color}>{sesao.number}</span>
                                        </h4>
                                        <p className='subtitle is-6 mt-3'>
                                            {sesao.descricao}
                                        </p>
                                    </div>
                                </div>
                                <div className={`column is-5 has-text-centered ${sesao.reverse ? '' : 'is-offset-1'}`}>
                                    <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                                        <img src={sesao.image} alt={sesao.alt} style={{ width: '100%', height: '200px', objectFit: 'contain' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> 
            </section>

            {/* Seção de status */}
            <section id='status' className='section' style={{ background: 'white', paddingTop: '4rem', paddingBottom: '4rem' }}>
                <div className='container'>
                    {error && (
                        <div className='notification is-warning is-light mb-5' style={{ borderRadius: '10px' }}>
                            <p className='has-text-weight-semibold'>
                                <i className='fas fa-exclamation-triangle mr-2'></i>
                                <strong>Aviso:</strong> Não foi possível carregar os dados em tempo real
                            </p>
                        </div>
                    )}
                    <div className='has-text-centered mb-6'>
                        <p className='title is-2 has-text-weight-bold'>
                            Total de usuários: <span style={{ color: '#667eea' }}>{status.totalUsuarios.toLocaleString()}</span>
                        </p>
                    </div>
                    <div className='columns is-multiline is-centered'>
                        <div className='column is-4 has-text-centered'> 
                            <div className='box' style={{ 
                                borderRadius: '15px', 
                                border: '3px solid #48c774', 
                                background: 'linear-gradient(135deg, #48c774 0%, #56d682 100%)' 
                            }}>
                                <span className='icon is-large has-text-white'>
                                    <i className='fab fa-android fa-3x'></i>
                                </span>
                                <p className='title is-4 has-text-white mt-3'>Android</p>
                                <p className='title is-2 has-text-white'>{status.androidCount}</p>
                                <p className='subtitle is-6 has-text-white-ter'>({porcentagens.android})</p>
                            </div>
                        </div>
                        <div className='column is-4 has-text-centered'>
                            <div className='box' style={{ 
                                borderRadius: '15px', 
                                border: '3px solid #3273dc', 
                                background: 'linear-gradient(135deg, #3273dc 0%, #4258f4 100%)' 
                            }}>
                                <span className='icon is-large has-text-white'>
                                    <i className='fab fa-apple fa-3x'></i> 
                                </span>
                                <p className='title is-4 has-text-white mt-3'>iPhone</p>
                                <p className='title is-2 has-text-white'>{status.iphoneCount}</p>
                                <p className='subtitle is-6 has-text-white-ter'>({porcentagens.iphone})</p>
                            </div>
                        </div>
                        <div className='column is-4 has-text-centered'>
                            <div className='box' style={{ 
                                borderRadius: '15px', 
                                border: '3px solid #00d1b2', 
                                background: 'linear-gradient(135deg, #00d1b2 0%, #00e6cc 100%)' 
                            }}>
                                <span className='icon is-large has-text-white'>
                                    <i className='fa-solid fa-globe fa-3x'></i>
                                </span>
                                <p className='title is-4 has-text-white mt-3'>Web</p>
                                <p className='title is-2 has-text-white'>{status.webCount}</p>
                                <p className='subtitle is-6 has-text-white-ter'>({porcentagens.web})</p>
                            </div>
                        </div>
                    </div>
                    {showMarging && (
                        <div className='notification is-warning is-light mt-5' style={{ borderRadius: '10px' }}>
                            <p className='has-text-weight-semibold'>
                                <i className='fas fa-exclamation-triangle mr-2'></i>
                                <strong>Aviso:</strong> Nem todos os usuários registrados informaram seu sistema operacional. Os números por plataforma podem não somar o total de usuários registrados.
                            </p>
                            <p className='mt-2'>
                                <small>Usuários sem sistema identificado: <span>{status.semregistroCount}</span> ({porcentagens.semRegistro})</small>
                            </p>
                        </div>
                    )}
                </div>
                <style jsx>{`
                    @keyframes spin { 
                        0% { transform: rotate(0deg); } 
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </section>
        </>
    );
}

const Home = () => {
    useEffect(() => {
        // Add custom styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
                100% { transform: translateY(0px); }
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            
            .navbar-burger span {
                background-color: white !important;
            }
            
            .box:hover {
                transform: translateY(-5px);
                transition: all 0.3s ease;
            }
            
            .button:hover {
                transform: translateY(-2px);
                transition: all 0.3s ease;
            }
            
            html {
                scroll-behavior: smooth;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <>
            <link 
                rel="stylesheet" 
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" 
            />
            <link 
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css"
            />
            
            <HomeSesao />
            <Footer />
        </>
    );
};

export default Home;