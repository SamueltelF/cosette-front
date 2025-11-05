import React, { useState, useEffect } from 'react';
import { 
  Home, ChevronDown, Download, Edit, Shuffle, 
  Package, Search, Menu, X, Sun, Moon, User,
  Eye, Globe, Battery, Clock
} from 'lucide-react';

// ============================================
// StatCard Component
// ============================================
const StatCard = ({ icon: Icon, title, value, gradient }) => (
  <div className="relative overflow-hidden rounded-xl shadow-lg group hover:shadow-xl transition-all duration-300">
    <div className={`p-6 ${gradient}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm group-hover:scale-110 transition-transform">
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
);

// ============================================
// Dashboard Component
// ============================================
const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [ip, setIp] = useState('Carregando...');
  const [currentPath, setCurrentPath] = useState('/');
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    setTimeout(() => setIp('192.168.1.1'), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuItems = [
    {
      id: 'home',
      name: 'Painel',
      icon: Home,
      path: '/'
    },
    {
      id: 'aleatorios',
      name: 'Aleatórios',
      icon: Package,
      submenu: [
        { name: 'Gerar Nick', path: '/docs/gerar-nick' },
        { name: 'ATTP', path: '/docs/attp' },
        { name: 'Sticker', path: '/docs/sticker' },
        { name: 'Emojimix', path: '/docs/emojimix' }
      ]
    },
    {
      id: 'baixador',
      name: 'Baixador',
      icon: Download,
      submenu: [
        { name: 'Instagram', path: '/docs/instagram' },
        { name: 'TikTok', path: '/docs/tiktok' },
        { name: 'YouTube', path: '/docs/youtube' },
        { name: 'Twitter', path: '/docs/twitter' }
      ]
    },
    {
      id: 'editor',
      name: 'Editor Imagem',
      icon: Edit,
      submenu: [
        { name: 'Superman', path: '/docs/superman' },
        { name: 'Gato Quadro', path: '/docs/gato-quadro' },
        { name: 'Trigger', path: '/docs/trigger' }
      ]
    },
    {
      id: 'random',
      name: 'Random-IMG',
      icon: Shuffle,
      submenu: [
        { name: 'Aesthetic', path: '/docs/aesthetic' },
        { name: 'Cosplay', path: '/docs/cosplay' },
        { name: 'Wallpaper', path: '/docs/wallpaper' }
      ]
    },
    {
      id: 'pesquisas',
      name: 'Procurar',
      icon: Search,
      submenu: [
        { name: 'YouTube', path: '/docs/youtube-search' },
        { name: 'Google', path: '/docs/google-search' },
        { name: 'Pinterest', path: '/docs/pinterest' }
      ]
    }
  ];

  const MenuItem = ({ item, isMobile = false }) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isOpen = openMenus[item.id];
    const isActive = currentPath === item.path;
    const hasActiveSubmenu = hasSubmenu && item.submenu.some(sub => sub.path === currentPath);

    return (
      <li className="relative">
        <button
          onClick={() => {
            if (hasSubmenu) {
              toggleMenu(item.id);
            } else {
              setCurrentPath(item.path);
              if (isMobile) setIsMobileOpen(false);
            }
          }}
          className={`inline-flex items-center justify-between w-full px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg
            ${isActive || hasActiveSubmenu
              ? 'bg-gradient-to-r from-[#733816] to-[#59210C] text-white shadow-md'
              : 'text-[#59210C] dark:text-[#F2DEC4] hover:bg-[#F2DEC4] dark:hover:bg-[#59210C]/30'
            }`}
        >
          <span className="inline-flex items-center gap-3">
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </span>
          {hasSubmenu && (
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </button>
        
        {hasSubmenu && isOpen && (
          <ul className="mt-2 ml-4 space-y-1 border-l-2 border-[#F2C894] pl-4">
            {item.submenu.map((subItem, idx) => {
              const isSubActive = currentPath === subItem.path;
              return (
                <li key={idx}>
                  <button
                    onClick={() => {
                      setCurrentPath(subItem.path);
                      if (isMobile) setIsMobileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200
                      ${isSubActive
                        ? 'bg-[#733816] text-white font-semibold shadow-sm'
                        : 'text-[#59210C] dark:text-[#F2C894] hover:bg-[#F2DEC4] dark:hover:bg-[#59210C]/20'
                      }`}
                  >
                    {subItem.name}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-[#401A0C]' : 'bg-gradient-to-br from-[#F2DEC4] to-[#F2C894]'}`}>
      
      {/* ========== SIDEBAR DESKTOP ========== */}
      <aside className="z-20 hidden md:flex md:flex-col w-72 bg-white dark:bg-[#59210C] shadow-2xl border-r-2 border-[#733816]">
        <div className="p-6 border-b-2 border-[#F2C894]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#733816] to-[#59210C] rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-xl">🤖</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#733816] to-[#59210C] bg-clip-text text-transparent">
              COSETTE APIS
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t-2 border-[#F2C894]">
          <div className="p-3 rounded-lg bg-gradient-to-r from-[#733816]/10 to-[#59210C]/10 dark:from-[#733816]/30 dark:to-[#59210C]/30">
            <p className="text-xs text-[#59210C] dark:text-[#F2C894] text-center font-medium">
              Versão 2.0 - Premium
            </p>
          </div>
        </div>
      </aside>

      {/* ========== MOBILE SIDEBAR ========== */}
      {isMobileOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#59210C] shadow-2xl md:hidden transform transition-transform duration-300">
            <div className="p-6 border-b-2 border-[#F2C894] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#733816] to-[#59210C] rounded-lg flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-[#733816] to-[#59210C] bg-clip-text text-transparent">
                  COSETTE
                </h1>
              </div>
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-[#F2DEC4] dark:hover:bg-[#733816] transition-colors"
              >
                <X className="w-6 h-6 text-[#59210C] dark:text-[#F2C894]" />
              </button>
            </div>
            
            <nav className="overflow-y-auto h-[calc(100vh-88px)] p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <MenuItem key={item.id} item={item} isMobile={true} />
                ))}
              </ul>
            </nav>
          </aside>
        </>
      )}

      {/* ========== MAIN CONTENT ========== */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        
        {/* ========== HEADER ========== */}
        <header className="z-30 bg-white/80 dark:bg-[#59210C]/80 backdrop-blur-xl shadow-lg border-b-2 border-[#733816]/20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                className="p-2 rounded-lg md:hidden hover:bg-[#F2DEC4] dark:hover:bg-[#733816] transition-colors"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              >
                <Menu className="w-6 h-6 text-[#59210C] dark:text-[#F2C894]" />
              </button>
              
              <div className="hidden md:block">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#733816] to-[#59210C] bg-clip-text text-transparent">
                  Dashboard
                </h2>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-[#F2DEC4] dark:hover:bg-[#733816] transition-all"
                >
                  {darkMode ? 
                    <Sun className="w-5 h-5 text-[#F2C894]" /> : 
                    <Moon className="w-5 h-5 text-[#59210C]" />
                  }
                </button>
                <button className="relative group">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#733816] to-[#59210C] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ========== MAIN CONTENT AREA ========== */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            
            {/* Banner do Canal */}
            <div className="bg-white dark:bg-[#59210C] rounded-2xl shadow-xl p-8 border-2 border-[#F2C894]">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#733816] to-[#59210C] rounded-2xl flex items-center justify-center shadow-lg mb-4 transform hover:scale-105 transition-transform">
                  <span className="text-4xl">🤖</span>
                </div>
                <h3 className="text-xl font-bold text-[#59210C] dark:text-[#F2C894] mb-2">
                  Canal do WhatsApp
                </h3>
                <a 
                  href="https://whatsapp.com/channel/0029VaC8bK0EAKW6cvmOFX1E" 
                  className="text-[#733816] dark:text-[#F2C894] hover:underline font-semibold mb-3"
                >
                  DESTINY-BOT General Notice
                </a>
                <p className="text-sm text-[#59210C]/70 dark:text-[#F2C894]/70">
                  Site ainda em mudança
                </p>
              </div>
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={Eye}
                title="Visitantes"
                value="1,005"
                gradient="bg-gradient-to-br from-[#733816] to-[#59210C]"
              />
              <StatCard
                icon={Globe}
                title="Seu IP"
                value={ip}
                gradient="bg-gradient-to-br from-[#59210C] to-[#401A0C]"
              />
              <StatCard
                icon={Battery}
                title="Sua Bateria"
                value="Apenas Android"
                gradient="bg-gradient-to-br from-[#733816] to-[#59210C]"
              />
              <StatCard
                icon={Clock}
                title="Horário"
                value={time.toLocaleTimeString('pt-BR')}
                gradient="bg-gradient-to-br from-[#59210C] to-[#401A0C]"
              />
            </div>

            {/* Verificar API Key */}
            <div className="bg-white dark:bg-[#59210C] rounded-2xl shadow-xl p-8 border-2 border-[#F2C894]">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-3xl">🔑</span>
                <h3 className="text-xl font-bold text-[#59210C] dark:text-[#F2C894]">
                  Verifique sua API Key
                </h3>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  className="w-full px-4 py-3 text-center rounded-xl border-2 border-[#F2C894] bg-[#F2DEC4]/30 dark:bg-[#401A0C] text-[#59210C] dark:text-[#F2C894] placeholder-[#733816]/50 focus:outline-none focus:border-[#733816] focus:ring-2 focus:ring-[#733816]/20 transition-all"
                  placeholder="Digite sua APIKEY"
                />
                <button className="w-full px-6 py-4 text-white font-semibold bg-gradient-to-r from-[#733816] to-[#59210C] rounded-xl hover:shadow-xl transform hover:scale-[1.02] transition-all">
                  Verificar Chave
                </button>
              </div>
            </div>

            {/* Banner Destiny Bot */}
            <div className="bg-gradient-to-br from-[#733816] via-[#59210C] to-[#401A0C] rounded-2xl shadow-2xl p-10 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
              </div>
              
              <div className="relative z-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  DESTINY-BOT
                </h1>
                <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                  Bot completo para WhatsApp com mais de 500 comandos
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button className="px-8 py-4 text-white bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-all font-semibold shadow-lg">
                    Saiba mais
                  </button>
                  <button className="px-8 py-4 text-[#59210C] bg-white rounded-xl hover:bg-[#F2DEC4] transition-all font-bold shadow-lg">
                    Download
                  </button>
                </div>
              </div>
            </div>

          </div>
          
          {/* ========== FOOTER ========== */}
          <footer className="p-6">
            <div className="bg-white dark:bg-[#59210C] rounded-2xl shadow-xl p-6 border-2 border-[#F2C894]">
              <p className="text-center text-sm text-[#59210C] dark:text-[#F2C894]">
                <a 
                  href="https://github.com/SamueltelF" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#733816] dark:text-[#F2C894] hover:underline font-bold"
                >
                  SamuelTal
                </a>
                {' '} © {new Date().getFullYear()} - COSETTE APIS
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;