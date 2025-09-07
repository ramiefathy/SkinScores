import type { Tool, CalculationResult } from '@/lib/types';

export interface ExportData {
  tool: {
    name: string;
    condition: string;
    sourceType: string;
  };
  result: CalculationResult;
  inputs: Record<string, any>;
  metadata: {
    timestamp: string;
    exportFormat: 'csv' | 'pdf' | 'json';
  };
}

// CSV Export
export function exportToCSV(data: ExportData): void {
  const headers = ['Field', 'Value'];
  const rows = [
    ['Tool Name', data.tool.name],
    ['Condition', data.tool.condition],
    ['Date/Time', new Date(data.metadata.timestamp).toLocaleString()],
    ['Score', String(data.result.score)],
    ['Interpretation', data.result.interpretation],
    ['', ''], // Empty row
    ['Input Parameters', ''],
  ];

  // Add input values
  Object.entries(data.inputs).forEach(([key, value]) => {
    const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    rows.push([formattedKey, String(value)]);
  });

  // Add details if available
  if (data.result.details && Object.keys(data.result.details).length > 0) {
    rows.push(['', '']); // Empty row
    rows.push(['Detailed Results', '']);
    
    const addDetails = (details: Record<string, any>, prefix = '') => {
      Object.entries(details).forEach(([key, value]) => {
        const formattedKey = prefix + key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          addDetails(value as Record<string, any>, formattedKey + ' - ');
        } else {
          rows.push([formattedKey, String(value)]);
        }
      });
    };
    
    addDetails(data.result.details);
  }

  // Convert to CSV string
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  // Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${data.tool.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// JSON Export (for data interchange)
export function exportToJSON(data: ExportData): void {
  const exportData = {
    skinscores_export: {
      version: '1.0',
      ...data,
    }
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${data.tool.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

// HTML Export (for PDF via print)
export function generatePrintableHTML(data: ExportData): string {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    return String(value);
  };

  const formatDetails = (details: Record<string, any>, level = 0): string => {
    let html = '';
    const indent = '  '.repeat(level);
    
    Object.entries(details).forEach(([key, value]) => {
      const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        html += `${indent}<div class="detail-group">
          ${indent}  <strong>${formattedKey}:</strong>
          ${indent}  <div class="nested-details">
          ${formatDetails(value as Record<string, any>, level + 1)}
          ${indent}  </div>
          ${indent}</div>`;
      } else {
        html += `${indent}<div class="detail-item">
          ${indent}  <span class="detail-label">${formattedKey}:</span>
          ${indent}  <span class="detail-value">${formatValue(value)}</span>
          ${indent}</div>`;
      }
    });
    
    return html;
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${data.tool.name} - Clinical Calculation Report</title>
  <style>
    @page { 
      size: A4; 
      margin: 2cm; 
    }
    
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .header {
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .header h1 {
      margin: 0;
      color: #1e293b;
      font-size: 28px;
    }
    
    .metadata {
      margin-top: 10px;
      font-size: 14px;
      color: #64748b;
    }
    
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    
    .section h2 {
      color: #1e293b;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
      font-size: 20px;
    }
    
    .result-box {
      background: #f0f9ff;
      border: 2px solid #3b82f6;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .score {
      font-size: 36px;
      font-weight: bold;
      color: #3b82f6;
      margin: 10px 0;
    }
    
    .interpretation {
      font-size: 16px;
      color: #1e293b;
      margin-top: 10px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    
    th, td {
      text-align: left;
      padding: 10px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    th {
      background: #f8fafc;
      font-weight: 600;
      color: #475569;
    }
    
    .detail-group {
      margin: 10px 0;
    }
    
    .nested-details {
      margin-left: 20px;
      padding-left: 20px;
      border-left: 3px solid #e2e8f0;
    }
    
    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .detail-label {
      font-weight: 500;
      color: #64748b;
    }
    
    .detail-value {
      color: #1e293b;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #94a3b8;
      text-align: center;
    }
    
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
      
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>SkinScores Clinical Calculation Report</h1>
    <div class="metadata">
      <p><strong>Tool:</strong> ${data.tool.name}</p>
      <p><strong>Condition:</strong> ${data.tool.condition}</p>
      <p><strong>Date:</strong> ${new Date(data.metadata.timestamp).toLocaleString()}</p>
    </div>
  </div>

  <div class="section">
    <h2>Calculation Result</h2>
    <div class="result-box">
      <div class="score">Score: ${formatValue(data.result.score)}</div>
      <div class="interpretation">${data.result.interpretation}</div>
    </div>
  </div>

  <div class="section">
    <h2>Input Parameters</h2>
    <table>
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(data.inputs).map(([key, value]) => `
          <tr>
            <td>${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
            <td>${formatValue(value)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  ${data.result.details && Object.keys(data.result.details).length > 0 ? `
    <div class="section">
      <h2>Detailed Results</h2>
      ${formatDetails(data.result.details)}
    </div>
  ` : ''}

  <div class="footer">
    <p>Generated by SkinScores Clinical Tools</p>
    <p>This report is for clinical reference only and should not replace professional medical judgment.</p>
  </div>
</body>
</html>
  `;
}

// Open printable HTML in new window for PDF generation
export function exportToPDF(data: ExportData): void {
  const html = generatePrintableHTML(data);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}