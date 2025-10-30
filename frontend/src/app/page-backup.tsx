'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sprout, TrendingUp, Users, Shield, ArrowRight, Leaf, Heart, Coins } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
            <Sprout className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700">
              Financiando el futuro desde las raíces
            </span>
          </div>

          <h1 className="text-6xl font-bold tracking-tight">
            Capital Raíz
          </h1>

          <p className="text-2xl text-gray-600 max-w-3xl">
            Microcréditos DeFi colateralizados por{' '}
            <span className="text-green-600 font-semibold">impacto sostenible verificable</span>
          </p>

          <p className="text-lg text-gray-500 max-w-2xl">
            Redefine la garantía financiera: en lugar de propiedades o historial crediticio,
            garantiza préstamos con compromisos verificables de prácticas sostenibles.
          </p>

          <div className="flex gap-4 mt-8">
            <Button
              size="lg"
              onClick={() => router.push('/auth/register')}
              className="bg-green-600 hover:bg-green-700"
            >
              Comenzar Ahora
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/auth/login')}
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <Coins className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-3xl font-bold">$500K+</div>
            <div className="text-sm text-gray-600">Préstamos Otorgados</div>
          </Card>
          <Card className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-3xl font-bold">150+</div>
            <div className="text-sm text-gray-600">Productores Activos</div>
          </Card>
          <Card className="p-6 text-center">
            <Leaf className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
            <div className="text-3xl font-bold">50 ton</div>
            <div className="text-sm text-gray-600">Residuos Gestionados</div>
          </Card>
          <Card className="p-6 text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <div className="text-3xl font-bold">98%</div>
            <div className="text-sm text-gray-600">Tasa de Cumplimiento</div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">¿Cómo Funciona?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Solicita tu Préstamo</h3>
            <p className="text-gray-600">
              Conecta tu wallet de Stellar y solicita el monto que necesitas. 
              En lugar de garantías tradicionales, te comprometes a entregar impacto sostenible medible.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Entrega y Verifica</h3>
            <p className="text-gray-600">
              Cumple con tu compromiso sostenible (bagazo, sargazo, reciclaje). 
              Un validador local escanea tu QR y confirma la entrega.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Coins className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Recibe tus Fondos</h3>
            <p className="text-gray-600">
              El smart contract libera automáticamente los fondos en USDC a tu wallet. 
              Sin intermediarios, 100% on-chain en Stellar.
            </p>
          </Card>
        </div>
      </section>

      {/* Roles Section */}
      <section className="container mx-auto px-4 py-20 bg-gray-50 rounded-3xl">
        <h2 className="text-4xl font-bold text-center mb-12">Únete como...</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 bg-white">
            <Sprout className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Productor</h3>
            <p className="text-gray-600 mb-6">
              Agricultores, micro-empresarios y emprendedores que necesitan capital 
              y están comprometidos con prácticas sostenibles.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Sin historial crediticio requerido</li>
              <li>✓ Garantía basada en impacto</li>
              <li>✓ Construye reputación on-chain</li>
            </ul>
          </Card>

          <Card className="p-8 bg-white">
            <Shield className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Validador</h3>
            <p className="text-gray-600 mb-6">
              ONGs, cooperativas y organizaciones locales que verifican el 
              cumplimiento de compromisos sostenibles.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Interfaz simple de validación</li>
              <li>✓ Escaneo QR rápido</li>
              <li>✓ Incentivos por validaciones</li>
            </ul>
          </Card>

          <Card className="p-8 bg-white">
            <TrendingUp className="w-12 h-12 text-emerald-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Inversionista</h3>
            <p className="text-gray-600 mb-6">
              Fondos, fundaciones e individuos que aportan liquidez al pool 
              y obtienen retornos con impacto social.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Rendimientos competitivos</li>
              <li>✓ Impacto medible y verificable</li>
              <li>✓ Transparencia total on-chain</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">¿Listo para comenzar?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Únete a Capital Raíz y sé parte de la revolución financiera que 
          combina inclusión, tecnología blockchain e impacto sostenible.
        </p>
        <Button
          size="lg"
          onClick={() => router.push('/auth/register')}
          className="bg-green-600 hover:bg-green-700"
        >
          Registrarse Ahora
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Sprout className="w-6 h-6 text-green-600" />
              <span className="font-bold text-xl">Capital Raíz</span>
            </div>
            <div className="text-sm text-gray-600">
              © 2025 Capital Raíz. Powered by Stellar & Soroban.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
