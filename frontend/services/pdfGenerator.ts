import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateDailyReport = (stats: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(79, 70, 229);
  doc.text('LUMENSEC', 20, 20);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Security Operations Center', 20, 27);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Rapport Journalier - Activites 24h', 20, 45);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const today = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text('Genere le ' + today, 20, 52);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Indicateurs Cles', 20, 65);
  
  autoTable(doc, {
    startY: 70,
    head: [['Metrique', 'Valeur', 'Statut']],
    body: [
      ['Alertes Actives', String(stats?.active_alerts || 102), 'NORMAL'],
      ['Auto-Neutralises', String(stats?.auto_neutralized || 42), 'EXCELLENT'],
      ['Taux Reduction Bruit', String(stats?.noise_reduction || 128) + ' filtres', 'OPTIMAL'],
      ['Niveau Menace', (stats?.threat_level || 2.1) + '/5', 'FAIBLE'],
    ],
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] }
  });
  
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.text('Resume Executif', 20, finalY);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('Activite normale. 42 incidents auto-neutralises.', 20, finalY + 7, { maxWidth: 170 });
  doc.text('128 faux positifs filtres via SMA-256.', 20, finalY + 14, { maxWidth: 170 });
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('(c) 2025 Lumensec - Confidentiel', 20, 280);
  
  doc.save('Lumensec_Rapport_Journalier_' + new Date().toISOString().split('T')[0] + '.pdf');
};

export const generateWeeklyReport = (stats: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(79, 70, 229);
  doc.text('LUMENSEC', 20, 20);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Security Operations Center', 20, 27);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Rapport Hebdomadaire - Tendances 7j', 20, 45);
  
  const today = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Periode: ' + today + ' (7 derniers jours)', 20, 52);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Analyse Hebdomadaire', 20, 65);
  
  autoTable(doc, {
    startY: 70,
    head: [['Categorie', 'Total', 'Evolution']],
    body: [
      ['Incidents detectes', '714', '+12%'],
      ['Neutralisations auto', '294', '+8%'],
      ['Interventions manuelles', '18', '-15%'],
      ['Temps moyen resolution', '12 min', '-22%'],
    ],
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] }
  });
  
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.text('Faits Marquants', 20, finalY);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('Reduction 22% temps resolution via automatisation', 20, finalY + 7, { maxWidth: 170 });
  doc.text('294 incidents neutralises auto (41% du total)', 20, finalY + 14, { maxWidth: 170 });
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('(c) 2025 Lumensec - Confidentiel', 20, 280);
  
  doc.save('Lumensec_Rapport_Hebdo_' + new Date().toISOString().split('T')[0] + '.pdf');
};

export const generateMonthlyReport = (stats: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(79, 70, 229);
  doc.text('LUMENSEC', 20, 20);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Security Operations Center', 20, 27);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Bilan Mensuel - Securite Globale', 20, 45);
  
  const today = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Periode: ' + today, 20, 52);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Performance Mensuelle', 20, 65);
  
  autoTable(doc, {
    startY: 70,
    head: [['Indicateur', 'Valeur', 'Objectif', 'Statut']],
    body: [
      ['Incidents traites', '3,142', '3,000', 'DEPASSE'],
      ['Taux automatisation', '68%', '60%', 'ATTEINT'],
      ['Disponibilite', '99.97%', '99.9%', 'EXCELLENT'],
      ['Faux positifs reduits', '87%', '80%', 'DEPASSE'],
    ],
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] }
  });
  
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.text('Recommandations', 20, finalY);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text('1. Maintenir automatisation 68%', 20, finalY + 7, { maxWidth: 170 });
  doc.text('2. Deployer 3 nouvelles regles', 20, finalY + 14, { maxWidth: 170 });
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('(c) 2025 Lumensec - Confidentiel', 20, 280);
  
  doc.save('Lumensec_Bilan_Mensuel_' + new Date().toISOString().split('T')[0] + '.pdf');
};