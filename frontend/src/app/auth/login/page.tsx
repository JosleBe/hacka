'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sprout, Wallet } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { useWalletStore } from '@/store/walletStore';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const connectWallet = useWalletStore((state) => state.connect);

  const handleWalletLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await authService.loginWithWallet();
      
      if (result.success) {
        setAuth(result.data.user, result.data.token);
        connectWallet(result.data.user.stellarPublicKey);
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Error al conectar con Freighter Wallet. Asegúrate de tener la extensión instalada y de dar permiso a la aplicación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <Sprout className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Bienvenido a Capital Raíz</CardTitle>
          <p className="text-gray-600">
            Conecta tu wallet de Stellar para acceder a la plataforma
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleWalletLogin}
            disabled={loading}
            className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Conectando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Conectar con Freighter
              </span>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">¿No tienes cuenta?</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => router.push('/auth/register')}
            className="w-full h-12 text-lg border-2"
          >
            Registrarse
          </Button>

          <div className="text-center text-sm text-gray-600 space-y-2 pt-4">
            <p>
              <strong>Nota:</strong> Necesitas tener instalada la extensión{' '}
              <a
                href="https://www.freighter.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline font-semibold"
              >
                Freighter Wallet
              </a>
            </p>
            <p className="text-xs">
              Y una cuenta de Stellar con fondos en la red Testnet
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
