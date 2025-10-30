'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Sprout, TrendingUp, Shield, Users, Wallet, CheckCircle2, AlertCircle } from 'lucide-react';
import { freighterService } from '@/lib/freighter';

export default function Home() {
  const router = useRouter();
  const [freighterInstalled, setFreighterInstalled] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkFreighter = async () => {
      try {
        const installed = await freighterService.checkConnection();
        setFreighterInstalled(installed);
      } catch (error) {
        setFreighterInstalled(false);
      } finally {
        setChecking(false);
      }
    };
    checkFreighter();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center space-y-8 mb-16">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
            <Sprout className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Capital Raíz
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl">
            Microcréditos descentralizados donde tus prácticas sustentables son tu garantía
          </p>

          {/* Freighter Status Banner */}
          {!checking && (
            <div className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-md ${
              freighterInstalled 
                ? 'bg-green-100 text-green-700' 
                : 'bg-amber-100 text-amber-700'
            }`}>
              {freighterInstalled ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Freighter Wallet detectada ✓</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">
                    Instala{' '}
                    <a
                      href="https://www.freighter.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-bold hover:text-amber-900"
                    >
                      Freighter Wallet
                    </a>
                    {' '}para continuar
                  </span>
                </>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => router.push('/auth/register')}
              className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6 shadow-lg"
              disabled={!freighterInstalled}
            >
              <Wallet className="w-5 h-5 mr-2" />
              Comenzar Ahora
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/auth/login')}
              className="text-lg px-8 py-6 shadow-lg"
              disabled={!freighterInstalled}
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card className="p-6 hover:shadow-xl transition-all border-2 hover:border-green-300">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">Para Productores</h3>
              <p className="text-gray-600">
                Obtén financiamiento para tus proyectos sustentables sin garantías tradicionales.
                Tu impacto ambiental respalda tu crédito.
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all border-2 hover:border-blue-300">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">Para Validadores</h3>
              <p className="text-gray-600">
                Verifica el impacto real de los proyectos sustentables y gana recompensas por tu trabajo.
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-all border-2 hover:border-purple-300">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold">Para Inversionistas</h3>
              <p className="text-gray-600">
                Invierte en proyectos con impacto positivo verificable y obtén retornos justos.
              </p>
            </div>
          </Card>
        </div>

        {/* How it Works Section */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold text-center mb-12">¿Cómo Funciona?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Conecta tu Wallet</h3>
                <p className="text-gray-600">
                  Usa Freighter Wallet para conectar tu cuenta de Stellar de forma segura.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Solicita o Invierte</h3>
                <p className="text-gray-600">
                  Productores solicitan préstamos, inversores aportan capital al pool.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Valida el Impacto</h3>
                <p className="text-gray-600">
                  Validadores verifican las prácticas sustentables en cada hito del proyecto.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Fondos Liberados</h3>
                <p className="text-gray-600">
                  Los fondos se liberan automáticamente al validar cada hito exitosamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
