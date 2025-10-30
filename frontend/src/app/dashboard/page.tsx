'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Sprout, TrendingUp, Shield, Users, Leaf, DollarSign, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const roleConfig = {
    PRODUCER: {
      icon: Sprout,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      title: 'Productor',
      description: 'Solicita préstamos con impacto sostenible',
    },
    VALIDATOR: {
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      title: 'Validador',
      description: 'Verifica entregas y libera fondos',
    },
    INVESTOR: {
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      title: 'Inversionista',
      description: 'Aporta capital y obtén retornos',
    },
    ADMIN: {
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      title: 'Administrador',
      description: 'Gestiona la plataforma',
    },
  };

  const config = roleConfig[user.role];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Capital Raíz</h1>
                <p className="text-xs text-gray-600">Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold">{user.name}</p>
                <Badge variant="outline" className="text-xs">
                  {config.title}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  useAuthStore.getState().logout();
                  router.push('/');
                }}
              >
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <Card className="mb-8 border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <div className={`w-20 h-20 ${config.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-12 h-12 ${config.color}`} />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">
                  ¡Bienvenido, {user.name}! 👋
                </h2>
                <p className="text-lg text-gray-700 mb-4">{config.description}</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium">Wallet Conectada</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                    <span className="text-xs text-gray-600">
                      {user.stellarPublicKey.slice(0, 8)}...{user.stellarPublicKey.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Balance Total</p>
                  <p className="text-2xl font-bold">$10,000</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Préstamos Activos</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Impacto Total</p>
                  <p className="text-2xl font-bold">2.5 ton</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Reputación</p>
                  <p className="text-2xl font-bold">{user.reputation?.reputationScore || 0}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {user.role === 'PRODUCER' && (
                <>
                  <Button className="h-24 flex flex-col gap-2 bg-green-600 hover:bg-green-700">
                    <Sprout className="w-6 h-6" />
                    <span>Solicitar Préstamo</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col gap-2">
                    <CheckCircle className="w-6 h-6" />
                    <span>Mis Préstamos</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col gap-2">
                    <Leaf className="w-6 h-6" />
                    <span>Mi Impacto</span>
                  </Button>
                </>
              )}

              {user.role === 'VALIDATOR' && (
                <>
                  <Button className="h-24 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700">
                    <Shield className="w-6 h-6" />
                    <span>Validar Entrega</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col gap-2">
                    <CheckCircle className="w-6 h-6" />
                    <span>Historial</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col gap-2">
                    <Users className="w-6 h-6" />
                    <span>Productores</span>
                  </Button>
                </>
              )}

              {user.role === 'INVESTOR' && (
                <>
                  <Button className="h-24 flex flex-col gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <DollarSign className="w-6 h-6" />
                    <span>Añadir Liquidez</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col gap-2">
                    <TrendingUp className="w-6 h-6" />
                    <span>Mi Portfolio</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col gap-2">
                    <Leaf className="w-6 h-6" />
                    <span>Impacto</span>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Development Notice */}
        <Card className="mt-8 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🚧</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Dashboard en Desarrollo</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Esta es la interfaz base del dashboard. Las funcionalidades específicas de cada rol están en desarrollo.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success">✓ Autenticación Funcional</Badge>
                  <Badge variant="success">✓ Integración con Wallet</Badge>
                  <Badge variant="warning">⏳ Creación de Préstamos</Badge>
                  <Badge variant="warning">⏳ Validaciones</Badge>
                  <Badge variant="warning">⏳ Inversiones</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
