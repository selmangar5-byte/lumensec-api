import React, { useState, useEffect } from 'react';
import { lumensecAPI } from '../services/api';

interface ConnectMicrosoftButtonProps {
  tenantId: string;
  onConnected: (data: any) => void;
  onError: (error: string) => void;
}

export const ConnectMicrosoftButton: React.FC<ConnectMicrosoftButtonProps> = ({
  tenantId,
  onConnected,
  onError
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionData, setConnectionData] = useState<any>(null);

  useEffect(() => {
    checkExistingConnection();
  }, [tenantId]);

  const checkExistingConnection = async () => {
    try {
      const response = await lumensecAPI.get(`/api/m365_credentials`, {
        headers: { 'X-Tenant-ID': tenantId }
      });
      
      if (response.data.has_credentials && response.data.active) {
        setIsConnected(true);
        setConnectionData(response.data);
      }
    } catch (error) {
      console.log('No existing M365 connection');
    }
  };

  const handleConnect = () => {
    setIsLoading(true);
    const redirectUrl = `https://symmetrical-system-wrpwxpjr57qx29wjr-3000.app.github.dev/api/auth/microsoft?tenant_id=${tenantId}`;
    window.location.href = redirectUrl;
  };

  const handleDisconnect = async () => {
    try {
      await lumensecAPI.delete(`/api/m365_credentials`, {
        headers: { 'X-Tenant-ID': tenantId }
      });
      setIsConnected(false);
      setConnectionData(null);
    } catch (error) {
      onError('Erreur lors de la déconnexion');
    }
  };

  if (isConnected) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-green-800">Microsoft 365 Connecté</p>
              <p className="text-sm text-green-600">
                Dernière synchro: {connectionData?.last_sync ? new Date(connectionData.last_sync).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Déconnecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
          <svg className="w-8 h-8" viewBox="0 0 21 21" fill="none">
            <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
            <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
            <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Connecter Microsoft 365</h3>
          <p className="text-sm text-gray-600 mt-1">
            Autorisez LumenSec à analyser votre sécurité M365 (MFA, Conditional Access, etc.) 
            pour un assessment précis et crédible pour votre assureur.
          </p>
          <div className="mt-3 flex items-center space-x-2 text-xs text-gray-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Lecture seule - Sécurisé
            </span>
            <span>•</span>
            <span>30 secondes</span>
          </div>
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="mt-3 bg-[#0078d4] hover:bg-[#106ebe] text-white font-medium py-2 px-4 rounded-md flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Connexion...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 21 21" fill="currentColor">
                  <rect x="1" y="1" width="9" height="9" />
                  <rect x="1" y="11" width="9" height="9" />
                  <rect x="11" y="1" width="9" height="9" />
                  <rect x="11" y="11" width="9" height="9" />
                </svg>
                <span>Connecter avec Microsoft</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};