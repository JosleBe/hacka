'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sprout } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { useWalletStore } from '@/store/walletStore';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [publicKey, setPublicKey] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'PRODUCER' as 'PRODUCER' | 'VALIDATOR' | 'INVESTOR',
    phone: '',
    location: '',
  });

  const setAuth = useAuthStore((state) => state.setAuth);
  const connectWallet = useWalletStore((state) => state.connect);

  const handleConnectWallet = async () => {
    setLoading(true);
    setError('');

    try {
      const key = await authService.connectWallet();
      setPublicKey(key);
      setStep(2);
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Error al conectar con Freighter Wallet. Asegúrate de tener la extensión instalada y de dar permiso a la aplicación.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.register({
        ...formData,
        stellarPublicKey: publicKey,
      });

      if (result.success) {
        setAuth(result.data.user, result.data.token);
        connectWallet(publicKey);
        router.push('/dashboard');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al registrarse';
      
      // Si el usuario ya existe, sugerir hacer login
      if (errorMessage.includes('ya registrado')) {
        setError(errorMessage + '. Por favor, ve a Iniciar Sesión.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <Sprout className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Únete a Capital Raíz</CardTitle>
          <p className="text-gray-600">
            Crea tu cuenta y comienza a {formData.role === 'PRODUCER' ? 'solicitar préstamos' : formData.role === 'VALIDATOR' ? 'validar impacto' : 'invertir con propósito'}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Paso 1: Conecta tu Wallet</h3>
                <p className="text-sm text-gray-600">
                  Necesitamos tu clave pública de Stellar para crear tu cuenta
                </p>
              </div>

              <Button
                onClick={handleConnectWallet}
                disabled={loading}
                className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Conectando...' : 'Conectar Freighter Wallet'}
              </Button>

              <p className="text-xs text-center text-gray-500">
                Al conectar aceptas nuestros términos y condiciones
              </p>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center space-y-2 mb-6">
                <h3 className="font-semibold text-lg">Paso 2: Completa tu Perfil</h3>
                <p className="text-xs text-gray-600 font-mono break-all bg-gray-100 p-2 rounded">
                  {publicKey.slice(0, 20)}...{publicKey.slice(-20)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Juan Pérez"
                    required
                    className="h-11"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="juan@ejemplo.com"
                    required
                    className="h-11"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full h-11 rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="PRODUCER">Productor (Solicitar Préstamos)</option>
                    <option value="VALIDATOR">Validador (Verificar Impacto)</option>
                    <option value="INVESTOR">Inversionista (Aportar Capital)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+52 777 123 4567"
                    className="h-11"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Xochitepec, Morelos"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-11"
                >
                  Atrás
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-11 bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Registrando...' : 'Crear Cuenta'}
                </Button>
              </div>
            </form>
          )}

          <div className="text-center text-sm text-gray-600 pt-4 border-t">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => router.push('/auth/login')}
              className="text-green-600 hover:underline font-semibold"
            >
              Iniciar Sesión
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
