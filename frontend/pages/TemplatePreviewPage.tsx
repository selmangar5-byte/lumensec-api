import React, { useState, useEffect } from 'react';
import { 
  Download, Printer, ArrowLeft, FileText, Shield, Loader2 
} from 'lucide-react';

interface TemplatePreviewPageProps {
  templateType: string;
  onBack: () => void;
}

const API_BASE_URL = '/api';

const TemplatePreviewPage: React.FC<TemplatePreviewPageProps> = ({ templateType, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const tenantId = localStorage.getItem('tenant_id') || '11111111-1111-1111-1111-111111111111';

  const templateNames: Record<string, string> = {
    dpo_nomination: 'Lettre de nomination DPO',
    pii_registry: 'Registre des données personnelles',
    breach_procedure: 'Procédure violation 72h',
    consent_form: 'Formulaire de consentement',
    privacy_policy: 'Politique de confidentialité'
  };

  useEffect(() => {
    fetchTemplate();
  }, [templateType]);

  const fetchTemplate = async () => {
    if (!templateType) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/templates/loi25/${templateType}`, {
        headers: { 
          'X-Tenant-ID': tenantId,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Template non disponible');
      
      const data = await response.json();
      setHtmlContent(data.html_content);
      setTitle(templateNames[templateType] || 'Document');
    } catch (err) {
      setError('Erreur lors du chargement du document');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // ✅ AJOUTÉ : Signal qu'on revient d'un template pour rouvrir Loi25
    localStorage.setItem('reopen_loi25_modal', 'true');
    onBack();
  };

  const downloadTemplate = () => {
    if (!htmlContent) return;
    const fullHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title><style>body{padding:40px;font-family:Arial,sans-serif;line-height:1.6}</style></head><body>${htmlContent}</body></html>`;
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateType}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printTemplate = () => {
    if (!htmlContent) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <style>
            @media print { 
              body { margin: 40px; font-family: Arial, sans-serif; line-height: 1.6; } 
            }
            body { padding: 40px; }
          </style>
        </head>
        <body>${htmlContent}</body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="animate-spin text-indigo-400" size={24} />
          <span>Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={handleBack} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-gray-900 border-b border-indigo-500/30 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* ✅ MODIFIÉ : handleBack au lieu de onBack */}
          <button onClick={handleBack} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm">
            <ArrowLeft size={16} /> Retour
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <FileText className="text-indigo-400" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{title}</h1>
              <p className="text-indigo-300 text-xs">Document Loi 25</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={downloadTemplate} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm">
            <Download size={16} /> Télécharger
          </button>
          <button onClick={printTemplate} className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm">
            <Printer size={16} /> Imprimer
          </button>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-8">
        {/* ✅ MODIFIÉ : Ajout de p-12 (padding 48px) pour les marges */}
        <div 
          className="max-w-5xl mx-auto bg-white shadow-2xl min-h-[800px] rounded-lg overflow-hidden p-12" 
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
      </main>
      
      <footer className="bg-gray-900 border-t border-indigo-500/30 px-6 py-4 flex justify-between text-sm text-gray-400">
        <div className="flex items-center gap-2"><Shield size={14} className="text-indigo-400" /> LumenSec</div>
        <div>Référence: Article 16 & 18 Loi 25</div>
      </footer>
    </div>
  );
};

export default TemplatePreviewPage;