import { useState } from 'react';
import { Palette, Upload, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const presetColors = [
  { primary: '#10b981', secondary: '#0d9488', name: 'Esmeralda' },
  { primary: '#3b82f6', secondary: '#2563eb', name: 'Azul' },
  { primary: '#8b5cf6', secondary: '#7c3aed', name: 'Roxo' },
  { primary: '#ec4899', secondary: '#db2777', name: 'Rosa' },
  { primary: '#f59e0b', secondary: '#d97706', name: 'Âmbar' },
  { primary: '#ef4444', secondary: '#dc2626', name: 'Vermelho' },
  { primary: '#06b6d4', secondary: '#0891b2', name: 'Ciano' },
  { primary: '#84cc16', secondary: '#65a30d', name: 'Lima' },
];

export default function ThemeCustomizer() {
  const { theme, updateTheme } = useTheme();
  const [customPrimary, setCustomPrimary] = useState(theme.primaryColor);
  const [customSecondary, setCustomSecondary] = useState(theme.secondaryColor);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateTheme({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const applyCustomColors = () => {
    updateTheme({ primaryColor: customPrimary, secondaryColor: customSecondary });
  };

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-emerald-500" />
          Logo da Empresa
        </h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50">
            {theme.logo ? (
              <img src={theme.logo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <span className="text-slate-400 text-xs text-center px-2">Sem logo</span>
            )}
          </div>
          <div className="flex-1">
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl cursor-pointer hover:bg-emerald-100 transition-colors">
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">Upload Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            <p className="text-xs text-slate-500 mt-2">PNG, JPG ou SVG (máx. 2MB)</p>
            {theme.logo && (
              <button
                onClick={() => updateTheme({ logo: undefined })}
                className="text-xs text-red-600 hover:text-red-700 mt-2"
              >
                Remover logo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Company Name */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Nome da Empresa</h3>
        <input
          type="text"
          value={theme.companyName}
          onChange={(e) => updateTheme({ companyName: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
          placeholder="Nome da sua empresa"
        />
      </div>

      {/* Color Presets */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-emerald-500" />
          Cores do Sistema
        </h3>
        
        <p className="text-sm text-slate-500 mb-4">Escolha um tema pré-definido:</p>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {presetColors.map((color) => (
            <button
              key={color.name}
              onClick={() => updateTheme({ primaryColor: color.primary, secondaryColor: color.secondary })}
              className={`relative p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                theme.primaryColor === color.primary
                  ? 'border-slate-800 shadow-lg'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                className="w-full h-8 rounded-lg mb-2"
                style={{ background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})` }}
              />
              <span className="text-xs text-slate-600 font-medium">{color.name}</span>
              {theme.primaryColor === color.primary && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Custom Colors */}
        <div className="border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500 mb-3">Ou personalize as cores:</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Cor Primária</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customPrimary}
                  onChange={(e) => setCustomPrimary(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={customPrimary}
                  onChange={(e) => setCustomPrimary(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Cor Secundária</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customSecondary}
                  onChange={(e) => setCustomSecondary(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={customSecondary}
                  onChange={(e) => setCustomSecondary(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono"
                />
              </div>
            </div>
          </div>
          <button
            onClick={applyCustomColors}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
          >
            Aplicar Cores
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Pré-visualização</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {theme.logo && (
              <img src={theme.logo} alt="Logo" className="w-10 h-10 object-contain" />
            )}
            <span className="font-bold text-lg text-slate-800">{theme.companyName}</span>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-white rounded-xl font-medium text-sm"
              style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
            >
              Botão Primário
            </button>
            <button
              className="px-4 py-2 rounded-xl font-medium text-sm border-2"
              style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
            >
              Botão Secundário
            </button>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: `${theme.primaryColor}10` }}>
            <p className="text-sm" style={{ color: theme.primaryColor }}>
              Texto com cor primária em fundo suave
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
