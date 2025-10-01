import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Trophy, 
  Users, 
  Shield, 
  Zap, 
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { ROUTES, BETTING_MODALITIES } from '../types/constants';
import { useAppStore } from '../stores/useAppStore';

const Home: React.FC = () => {
  const { isAuthenticated } = useAppStore();

  const features = [
    {
      icon: Shield,
      title: 'Seguro e Confiável',
      description: 'Plataforma licenciada com criptografia de ponta para proteger seus dados e transações.'
    },
    {
      icon: Zap,
      title: 'Resultados Instantâneos',
      description: 'Acompanhe os sorteios ao vivo e receba os resultados em tempo real.'
    },
    {
      icon: Trophy,
      title: 'Grandes Prêmios',
      description: 'Concorra a prêmios milionários com as melhores odds do mercado.'
    },
    {
      icon: Users,
      title: 'Comunidade Ativa',
      description: 'Junte-se a milhares de jogadores que já confiam na nossa plataforma.'
    }
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      location: 'São Paulo, SP',
      text: 'Ganhei R$ 50.000 no meu primeiro mês! A plataforma é muito fácil de usar.',
      rating: 5
    },
    {
      name: 'João Santos',
      location: 'Rio de Janeiro, RJ', 
      text: 'Excelente atendimento e pagamentos sempre em dia. Recomendo!',
      rating: 5
    },
    {
      name: 'Ana Costa',
      location: 'Belo Horizonte, MG',
      text: 'A melhor plataforma de apostas que já usei. Interface intuitiva e segura.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">JBest</h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Recursos
              </a>
              <a href="#modalities" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Modalidades
              </a>
              <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Depoimentos
              </a>
              {isAuthenticated ? (
                <Link
                  to={ROUTES.DASHBOARD}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to={ROUTES.LOGIN}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Entrar
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Sua sorte está aqui!
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              A melhor plataforma de apostas do Brasil com prêmios milionários
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to={ROUTES.REGISTER}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                  >
                    <Play className="mr-2" size={20} />
                    Começar Agora
                  </Link>
                  <Link
                    to={ROUTES.LOGIN}
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    Já tenho conta
                  </Link>
                </>
              ) : (
                <Link
                  to={ROUTES.BETTING}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <Play className="mr-2" size={20} />
                  Fazer Aposta
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Por que escolher a JBest?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              A plataforma mais confiável e inovadora do mercado
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-blue-600 dark:text-blue-400" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Betting Modalities Section */}
      <section id="modalities" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Modalidades de Apostas
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Escolha sua modalidade favorita e concorra a grandes prêmios
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(BETTING_MODALITIES).map(([key, modality]) => (
              <div key={key} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {modality.name}
                  </h3>
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                    R$ {modality.minBet.toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {modality.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {modality.numbers} números
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    Até {modality.maxPrize}x
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              O que nossos jogadores dizem
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Histórias reais de sucesso na nossa plataforma
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para começar a ganhar?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Cadastre-se agora e receba um bônus de boas-vindas!
          </p>
          {!isAuthenticated ? (
            <Link
              to={ROUTES.REGISTER}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Cadastrar Grátis
              <ArrowRight className="ml-2" size={20} />
            </Link>
          ) : (
            <Link
              to={ROUTES.BETTING}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Fazer Primeira Aposta
              <ArrowRight className="ml-2" size={20} />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">J</span>
                </div>
                <h3 className="text-xl font-bold">JBest</h3>
              </div>
              <p className="text-gray-400">
                A melhor plataforma de apostas do Brasil, oferecendo segurança, transparência e grandes prêmios.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Recursos</a></li>
                <li><a href="#modalities" className="hover:text-white">Modalidades</a></li>
                <li><a href="#testimonials" className="hover:text-white">Depoimentos</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/help" className="hover:text-white">Central de Ajuda</a></li>
                <li><a href="/contact" className="hover:text-white">Contato</a></li>
                <li><a href="/terms" className="hover:text-white">Termos de Uso</a></li>
                <li><a href="/privacy" className="hover:text-white">Privacidade</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Segurança</h4>
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="text-green-400" size={20} />
                <span className="text-gray-400">Licenciado</span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="text-green-400" size={20} />
                <span className="text-gray-400">Criptografia SSL</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-400" size={20} />
                <span className="text-gray-400">Jogo Responsável</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 JBest. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;