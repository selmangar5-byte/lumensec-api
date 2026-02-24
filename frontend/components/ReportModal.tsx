import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Download, Printer, ChevronLeft, FileDown, 
  Shield, CheckCircle, AlertTriangle, Eye
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ReportModalProps {
  onClose: () => void;
}

interface ReportType {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  color: string;
  accent: string;
}

const reportTypes: ReportType[] = [
  {
    id: 'soc',
    label: 'Rapport SOC Complet',
    shortLabel: 'SOC Complet',
    icon: Shield,
    color: 'text-purple-400',
    accent: 'bg-purple-500'
  },
  {
    id: 'insurance',
    label: 'Évaluation Cyber Assurance',
    shortLabel: 'Cyber Assurance',
    icon: CheckCircle,
    color: 'text-cyan-400',
    accent: 'bg-cyan-500'
  },
  {
    id: 'm365',
    label: 'Audit M365 Security',
    shortLabel: 'Audit M365',
    icon: AlertTriangle,
    color: 'text-orange-400',
    accent: 'bg-orange-500'
  },
  {
    id: 'compliance',
    label: 'Conformité Loi 25',
    shortLabel: 'Loi 25',
    icon: FileText,
    color: 'text-emerald-400',
    accent: 'bg-emerald-500'
  }
];

export default function ReportModal({ onClose }: ReportModalProps) {
  const [selectedReport, setSelectedReport] = useState<string>('soc');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>('1'); // Par défaut 1 jour (le plus pertinent pour SOC)
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeHistory, setIncludeHistory] = useState(true);
  const [includeRemediation, setIncludeRemediation] = useState(false);
  
  const pdfRef = useRef<jsPDF | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!pdfUrl && !isGenerating) {
      handleGenerate();
    }
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []);

  const generatePDFContent = () => {
    const doc = new jsPDF();
    const report = reportTypes.find(r => r.id === selectedReport);
    
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 32, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('LUMENSEC', 15, 18);
    
    doc.setTextColor(147, 197, 253);
    doc.setFontSize(9);
    doc.text('Security Operations Center', 15, 26);
    
    doc.setFillColor(88, 28, 135);
    doc.rect(0, 32, 210, 2, 'F');
    
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.text(report?.label || 'Rapport', 15, 45);
    
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    const periodLabel = period === '1' ? '1 jour' : period === '7' ? '7 jours' : period === '30' ? '30 jours' : period === '90' ? '3 mois' : period === '180' ? '6 mois' : '1 an';
    doc.text(`${new Date().toLocaleDateString('fr-FR')} • Période: ${periodLabel}`, 15, 52);
    
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 57, 195, 57);
    
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.text('Résumé Exécutif', 15, 67);
    
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(9);
    const summary = `Analyse complète: ${report?.label.toLowerCase()}. Période analysée: ${periodLabel}.`;
    doc.text(doc.splitTextToSize(summary, 180), 15, 74);
    
    if (typeof (doc as any).autoTable === 'function') {
      (doc as any).autoTable({
        startY: 82,
        head: [['Métrique', 'Valeur', 'Statut', 'Évol.']],
        body: [
          ['Alertes Critiques', '3', '⚠️ Attention', '↓ 12%'],
          ['Conformité', '87%', '✓ Bon', '↑ 5%'],
          ['Temps Réponse', '2.3h', '✓ Optimal', '↓ 18%'],
          ['Patchs', '94%', '✓ Bon', '→ 0%'],
        ],
        theme: 'grid',
        headStyles: {
          fillColor: [88, 28, 135],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [15, 23, 42],
          fontSize: 9
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        margin: { left: 15, right: 15 }
      });
    }
    
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 287, 210, 10, 'F');
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8);
      doc.text(`LumenSec © ${new Date().getFullYear()} - Page ${i}/${pageCount}`, 15, 293);
    }
    
    return doc;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const doc = generatePDFContent();
      pdfRef.current = doc;
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url + '#zoom=page-width');
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (pdfRef.current) {
      const report = reportTypes.find(r => r.id === selectedReport);
      pdfRef.current.save(`LumenSec_${report?.label.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    }
  };

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };

  const selectedReportData = reportTypes.find(r => r.id === selectedReport);

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col">
      
      <div className="h-11 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour</span>
          </button>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-md ${selectedReportData?.accent} flex items-center justify-center`}>
              <selectedReportData.icon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-medium text-sm">{selectedReportData?.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pdfUrl && (
            <>
              <button onClick={handlePrint} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs font-medium flex items-center gap-2 border border-slate-700 transition-colors">
                <Printer className="w-3.5 h-3.5" />
                Imprimer
              </button>
              <button onClick={handleDownload} className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-md text-xs font-medium flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all">
                <FileDown className="w-3.5 h-3.5" />
                Télécharger
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        <div className="w-[580px] bg-slate-900 border-r border-slate-800 p-6 flex flex-col shrink-0">
          
          {/* 4 Documents */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              const isSelected = selectedReport === report.id;
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 flex flex-col items-center text-center gap-3 h-[160px] ${
                    isSelected 
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/15' 
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl ${isSelected ? report.accent : 'bg-slate-700'} ${isSelected ? 'text-white' : report.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <div className={`font-bold text-base mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {report.shortLabel}
                    </div>
                    <div className="text-xs text-slate-500 leading-snug">
                      {report.label.replace('Rapport ', '').replace('Évaluation ', '').replace('Audit ', '').replace('Conformité ', '')}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-b-xl" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Options */}
          <div className="mb-6">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Inclure</div>
            <div className="flex gap-3">
              {[
                { label: 'Graphiques', val: includeCharts, set: setIncludeCharts },
                { label: 'Historique', val: includeHistory, set: setIncludeHistory },
                { label: 'Recos', val: includeRemediation, set: setIncludeRemediation }
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => opt.set(!opt.val)}
                  className={`flex-1 py-3 px-2 rounded-lg border text-xs font-bold transition-all flex flex-col items-center gap-2 ${
                    opt.val ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-slate-700 bg-slate-900 text-slate-400'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${opt.val ? 'bg-purple-500' : 'bg-slate-600'}`} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* mt-auto pousse vers le bas */}
          <div className="mt-auto mb-6">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Période d'analyse</div>
            <div className="grid grid-cols-6 gap-2">
              {[
                { value: '1', label: '1j' },    // AJOUTÉ : 1 jour (le plus pertinent pour SOC)
                { value: '7', label: '7j' },
                { value: '30', label: '30j' },
                { value: '90', label: '3m' },
                { value: '180', label: '6m' },
                { value: '365', label: '1an' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPeriod(opt.value)}
                  className={`py-3 rounded-lg border text-xs font-bold transition-all ${
                    period === opt.value ? 'border-purple-500 bg-purple-500 text-white' : 'border-slate-700 bg-slate-800 text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bouton */}
          <div className="mb-auto">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl text-base font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-purple-500/20 ${
                isGenerating ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
              {pdfUrl ? 'Régénérer le PDF' : 'Générer l\'aperçu'}
            </button>
          </div>

        </div>

        <div className="flex-1 bg-slate-200 overflow-hidden">
          {!pdfUrl ? (
            <div className="h-full flex items-center justify-center bg-slate-100">
              <div className="animate-pulse text-slate-400 flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-slate-300 border-t-purple-500 rounded-full animate-spin mb-3" />
                <span className="text-sm font-medium">Chargement...</span>
              </div>
            </div>
          ) : (
            <div className="h-full w-full bg-white">
              <iframe 
                ref={iframeRef}
                src={pdfUrl} 
                className="w-full h-full bg-white"
                style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
                title="PDF Preview"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}