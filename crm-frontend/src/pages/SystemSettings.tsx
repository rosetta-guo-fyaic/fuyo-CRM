
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Globe2, 
  Settings, 
  Save, 
  Search,
  Building2,
  CheckCircle2,
  Crown,
  AlertCircle,
  LayoutDashboard,
  BarChart2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SUPPLIERS, DICTIONARIES, type Supplier } from '../data/mockData';

// --- Components ---

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white border border-slate-200 rounded-xl shadow-sm", className)}>
      {children}
    </div>
  );
}

export function SystemSettings() {
  const navigate = useNavigate();

  // --- State ---
  const [suppliers, setSuppliers] = useState<Supplier[]>(SUPPLIERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'financial' | 'portal' | 'tiering' | 'performance'>('financial');
  const [isDirty, setIsDirty] = useState(false);

  // Derived state
  const selectedSupplier = suppliers.find(s => s.id === selectedId);
  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Handlers ---

  const handleSelect = (id: string) => {
    if (isDirty) {
      if (!confirm('Unsaved changes will be lost. Continue?')) return;
    }
    setSelectedId(id);
    setIsDirty(false);
    // Reset tab to financial on new selection
    setActiveTab('financial'); 
  };

  const updateFinancial = (field: keyof Supplier['financial'], value: any) => {
    if (!selectedId) return;
    setSuppliers(prev => prev.map(s => {
      if (s.id === selectedId) {
        return { ...s, financial: { ...s.financial, [field]: value } };
      }
      return s;
    }));
    setIsDirty(true);
  };

  const updatePerformance = (field: string, value: any, dimensionId?: string) => {
    if (!selectedId) return;
    setSuppliers(prev => prev.map(s => {
      if (s.id !== selectedId) return s;
      
      const currentConfig = s.performanceConfig || { dimensions: [], evaluationPeriod: 'quarterly' };
      
      if (field === 'period') {
        return { ...s, performanceConfig: { ...currentConfig, evaluationPeriod: value } };
      }
      
      if (field === 'dimension' && dimensionId) {
        const newDimensions = currentConfig.dimensions.map(d => 
          d.id === dimensionId ? { ...d, weight: Number(value) } : d
        );
        return { ...s, performanceConfig: { ...currentConfig, dimensions: newDimensions } };
      }

      return s;
    }));
    setIsDirty(true);
  };

  const updatePortal = (key: keyof Supplier['portalAccess']) => {
    if (!selectedId) return;
    setSuppliers(prev => prev.map(s => {
      if (s.id === selectedId) {
        return { 
          ...s, 
          portalAccess: { 
            ...s.portalAccess, 
            [key]: !s.portalAccess[key] 
          } 
        };
      }
      return s;
    }));
    setIsDirty(true);
  };

  const updateTier = (tierId: any) => {
    if (!selectedId) return;
    setSuppliers(prev => prev.map(s => {
      if (s.id === selectedId) {
        return { ...s, tier: tierId };
      }
      return s;
    }));
    setIsDirty(true);
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    
    // Sync to Mock DB
    suppliers.forEach(s => {
      const index = SUPPLIERS.findIndex(ms => ms.id === s.id);
      if (index !== -1) {
        SUPPLIERS[index] = s;
      }
    });

    setIsDirty(false);
    alert('Configuration saved successfully!');
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      
      {/* Header */}
      <div className="mb-6 flex-none">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Settings className="w-8 h-8 text-slate-400" />
          客户门户配置
        </h1>
        <p className="text-slate-500 mt-1 ml-11">配置客户专属门户的功能模块与权限。</p>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        
        {/* Left Panel: Supplier Directory */}
        <div className="w-1/3 flex flex-col gap-4">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex-none">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-500" />
                供应商名录
              </h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by name or code..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {filteredSuppliers.map(supplier => (
                <button
                  key={supplier.id}
                  onClick={() => handleSelect(supplier.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all hover:shadow-md",
                    selectedId === supplier.id
                      ? "bg-brand-50 border-brand-200 ring-1 ring-brand-200"
                      : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={cn(
                      "font-semibold text-sm truncate pr-2",
                      selectedId === supplier.id ? "text-brand-900" : "text-slate-900"
                    )}>
                      {supplier.name}
                    </span>
                    {supplier.status === 'blacklisted' && (
                      <AlertCircle className="w-4 h-4 text-red-500 flex-none" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-slate-400">{supplier.code}</span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded border capitalize",
                      supplier.tier === 'strategic' ? "bg-purple-50 text-purple-700 border-purple-100" :
                      supplier.tier === 'core' ? "bg-blue-50 text-blue-700 border-blue-100" :
                      "bg-slate-50 text-slate-600 border-slate-100"
                    )}>
                      {supplier.tier}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-center text-slate-500 flex-none">
              Showing {filteredSuppliers.length} suppliers
            </div>
          </Card>
        </div>

        {/* Right Panel: Configuration */}
        <div className="w-2/3 flex flex-col">
          {selectedSupplier ? (
            <Card className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
              
              {/* Toolbar */}
              <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center flex-none">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-lg">
                    {selectedSupplier.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">{selectedSupplier.name}</h2>
                    <p className="text-xs text-slate-500">正在配置策略参数...</p>
                  </div>
                </div>
                <button 
                  onClick={handleSave}
                  disabled={!isDirty}
                  className={cn(
                    "px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all",
                    isDirty 
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-700"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                >
                  <Save className="w-4 h-4" />
                  保存更改
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-200 bg-white px-4 flex-none">
                {[
                  { id: 'financial', label: '财务模型', icon: CreditCard },
                  { id: 'portal', label: '门户权限', icon: Globe2 },
                  { id: 'tiering', label: '分级权益', icon: Crown },
                  { id: 'performance', label: '绩效配置', icon: BarChart2 },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors",
                      activeTab === tab.id
                        ? "border-brand-500 text-brand-600"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-6">
                
                {/* Financial Tab */}
                {activeTab === 'financial' && (
                  <div className="space-y-6 max-w-2xl">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-500" />
                        4D 模型配置
                      </h3>
                      
                      <div className="space-y-6">
                        {/* Interval */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">1. 结算区间</label>
                          <div className="grid grid-cols-2 gap-3">
                            {DICTIONARIES.intervals.map(opt => (
                              <button
                                key={opt.id}
                                onClick={() => updateFinancial('interval', opt.id)}
                                className={cn(
                                  "px-3 py-2 text-sm text-left rounded-lg border transition-all",
                                  selectedSupplier.financial.interval === opt.id
                                    ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                )}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Anchor */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">2. 锚定节点</label>
                          <select
                            value={selectedSupplier.financial.anchor}
                            onChange={(e) => updateFinancial('anchor', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          >
                            {DICTIONARIES.anchors.map(opt => (
                              <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Period */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">3. 账期长度 (天)</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              value={selectedSupplier.financial.period}
                              onChange={(e) => updateFinancial('period', parseInt(e.target.value) || 0)}
                              className="w-24 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                            <span className="text-sm text-slate-500">Days</span>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3 text-sm text-slate-600">
                          <AlertCircle className="w-4 h-4 text-slate-400" />
                          <span>
                            当前配置: 
                            <strong className="text-slate-900 mx-1">
                              {DICTIONARIES.intervals.find(i => i.id === selectedSupplier.financial.interval)?.label}
                            </strong>
                            + 
                            <strong className="text-slate-900 mx-1">T+{selectedSupplier.financial.period}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Portal Tab */}
                {activeTab === 'portal' && (
                  <div className="space-y-6 max-w-2xl">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Globe2 className="w-5 h-5 text-brand-500" />
                        门户功能开关
                      </h3>
                      
                      <div className="space-y-4">
                        {[
                          { key: 'quotationHub', label: '询价与比价 (Quotation Hub)', desc: '一键询价 / 竞对管理 / 自动比价' },
                          { key: 'orderCommand', label: '订单指挥中心 (Order Command)', desc: '全链路可视化 / 跨供应商订单追踪' },
                          { key: 'walletDocs', label: '资金与文档 (Wallet & Docs)', desc: '资金看板 / 一键对账 / 文档云盘' },
                        ].map((module: any) => (
                          <div key={module.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                            <div>
                              <div className="font-medium text-slate-900 flex items-center gap-2">
                                {module.label}
                                {module.sensitive && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Sensitive</span>}
                              </div>
                              <div className="text-xs text-slate-500">{module.desc}</div>
                            </div>
                            <button
                              onClick={() => updatePortal(module.key)}
                              className={cn(
                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                                selectedSupplier.portalAccess[module.key as keyof typeof selectedSupplier.portalAccess] 
                                  ? "bg-brand-600" 
                                  : "bg-slate-200"
                              )}
                            >
                              <span className={cn(
                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                selectedSupplier.portalAccess[module.key as keyof typeof selectedSupplier.portalAccess] 
                                  ? "translate-x-6" 
                                  : "translate-x-1"
                              )} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-100">
                        <button
                          onClick={() => navigate(`/portal-preview/${selectedSupplier.id}`)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                        >
                          <Globe2 className="w-4 h-4" />
                          预览客户视角门户
                        </button>
                        <p className="text-center text-xs text-slate-400 mt-2">
                          将以该客户的身份打开新窗口，查看其实际可见的功能模块。
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tiering Tab */}
                {activeTab === 'tiering' && (
                  <div className="space-y-6 max-w-2xl">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Crown className="w-5 h-5 text-purple-500" />
                        等级与权益分配
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {DICTIONARIES.tiers.map(tier => (
                          <button
                            key={tier.id}
                            onClick={() => updateTier(tier.id)}
                            className={cn(
                              "flex items-center p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden",
                              selectedSupplier.tier === tier.id
                                ? tier.id === 'strategic' 
                                  ? "border-purple-500 bg-purple-50 ring-1 ring-purple-500"
                                  : tier.id === 'core'
                                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                    : tier.id === 'backup'
                                      ? "border-slate-500 bg-slate-50 ring-1 ring-slate-500"
                                      : tier.id === 'probation'
                                        ? "border-amber-500 bg-amber-50 ring-1 ring-amber-500"
                                        : "border-red-500 bg-red-50 ring-1 ring-red-500"
                                : "border-slate-100 bg-white hover:border-slate-300"
                            )}
                          >
                            <div className={cn(
                              "w-12 h-12 rounded-lg border flex flex-col items-center justify-center mr-4 z-10",
                              selectedSupplier.tier === tier.id 
                                ? tier.id === 'strategic'
                                  ? "bg-white border-purple-200 text-purple-700 shadow-sm"
                                  : tier.id === 'core'
                                    ? "bg-white border-blue-200 text-blue-700 shadow-sm"
                                    : tier.id === 'backup'
                                      ? "bg-white border-slate-200 text-slate-700 shadow-sm"
                                      : tier.id === 'probation'
                                        ? "bg-white border-amber-200 text-amber-700 shadow-sm"
                                        : "bg-white border-red-200 text-red-700 shadow-sm"
                                : "bg-slate-50 border-slate-200 text-slate-400"
                            )}>
                              <span className="text-[10px] uppercase tracking-tighter leading-none opacity-70">等级</span>
                              <span className="text-xl leading-none font-bold">{(tier as any).level}</span>
                            </div>

                            <div className="flex-1 z-10 text-left">
                              <span className={cn("font-bold block flex items-center gap-2", 
                                selectedSupplier.tier === tier.id 
                                  ? tier.id === 'strategic'
                                    ? "text-purple-900"
                                    : tier.id === 'core'
                                      ? "text-blue-900"
                                      : tier.id === 'backup'
                                        ? "text-slate-900"
                                        : tier.id === 'probation'
                                          ? "text-amber-900"
                                          : "text-red-900"
                                  : "text-slate-700"
                              )}>
                                {tier.label}
                              </span>
                            </div>
                            
                            {selectedSupplier.tier === tier.id && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <CheckCircle2 className={cn("w-6 h-6",
                                  tier.id === 'strategic' ? "text-purple-600" :
                                  tier.id === 'core' ? "text-blue-600" :
                                  tier.id === 'backup' ? "text-slate-600" :
                                  tier.id === 'probation' ? "text-amber-600" :
                                  "text-red-600"
                                )} />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>

                      <div className={cn(
                        "mt-6 p-4 rounded-lg border",
                        selectedSupplier.tier === 'strategic' ? "bg-purple-50 border-purple-100" :
                        selectedSupplier.tier === 'core' ? "bg-blue-50 border-blue-100" :
                        selectedSupplier.tier === 'backup' ? "bg-slate-50 border-slate-100" :
                        selectedSupplier.tier === 'probation' ? "bg-amber-50 border-amber-100" :
                        "bg-red-50 border-red-100"
                      )}>
                        <h4 className={cn(
                          "font-bold text-sm mb-2",
                          selectedSupplier.tier === 'strategic' ? "text-purple-900" :
                          selectedSupplier.tier === 'core' ? "text-blue-900" :
                          selectedSupplier.tier === 'backup' ? "text-slate-900" :
                          selectedSupplier.tier === 'probation' ? "text-amber-900" :
                          "text-red-900"
                        )}>已选权益:</h4>
                        <ul className={cn(
                          "list-disc list-inside text-sm space-y-1",
                          selectedSupplier.tier === 'strategic' ? "text-purple-800" :
                          selectedSupplier.tier === 'core' ? "text-blue-800" :
                          selectedSupplier.tier === 'backup' ? "text-slate-800" :
                          selectedSupplier.tier === 'probation' ? "text-amber-800" :
                          "text-red-800"
                        )}>
                          {selectedSupplier.tier === 'strategic' && (
                            <>
                              <li>账期: T+60 (月结)</li>
                              <li>优先级: 最高</li>
                              <li>返利政策: 年度 2%</li>
                            </>
                          )}
                          {selectedSupplier.tier === 'core' && (
                            <>
                              <li>账期: T+45</li>
                              <li>优先级: 高</li>
                            </>
                          )}
                          {['backup', 'probation'].includes(selectedSupplier.tier) && (
                            <>
                              <li>账期: 标准 / 预付</li>
                              <li>优先级: 标准</li>
                            </>
                          )}
                          {selectedSupplier.tier === 'blacklisted' && (
                            <>
                              <li>账期: 禁用</li>
                              <li>优先级: 无</li>
                              <li>限制: 禁止下单与付款</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Tab */}
                {activeTab === 'performance' && (
                  <div className="space-y-6 max-w-2xl">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-brand-500" />
                        绩效维度配置
                      </h3>

                      {!selectedSupplier.performanceConfig ? (
                        <div className="text-center py-8">
                          <p className="text-slate-500 mb-4">该供应商尚未配置绩效考核维度。</p>
                          <button
                            onClick={() => {
                              const defaultDims = [
                                { id: 'cost', name: '成本竞争力', weight: 40 },
                                { id: 'quality', name: '服务质量', weight: 30 },
                                { id: 'delivery', name: '交付时效', weight: 30 }
                              ];
                              // We need a new handler or use existing one cleverly? 
                              // Actually we need to update the whole object.
                              // Let's just use updatePerformance logic but we need to trigger it.
                              // Since updatePerformance is granular, let's just add a specialized one or expand updatePerformance.
                              // Or better, just direct setSuppliers here for simplicity in this tool call.
                              setSuppliers(prev => prev.map(s => {
                                if (s.id === selectedId) {
                                  return { 
                                    ...s, 
                                    performanceConfig: { 
                                      dimensions: defaultDims, 
                                      evaluationPeriod: 'quarterly' 
                                    } 
                                  };
                                }
                                return s;
                              }));
                              setIsDirty(true);
                            }}
                            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium"
                          >
                            初始化默认模板
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Evaluation Period */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">考核周期 (Evaluation Period)</label>
                            <div className="flex gap-3">
                              {['monthly', 'quarterly', 'annual'].map(period => (
                                <button
                                  key={period}
                                  onClick={() => updatePerformance('period', period)}
                                  className={cn(
                                    "px-4 py-2 text-sm rounded-lg border capitalize transition-all",
                                    selectedSupplier.performanceConfig?.evaluationPeriod === period
                                      ? "bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500"
                                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                  )}
                                >
                                  {period}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Dimensions & Weights */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                              考核维度权重 (Dimensions & Weights)
                              <span className="ml-2 text-xs font-normal text-slate-500">Total must be 100%</span>
                            </label>
                            
                            <div className="space-y-3">
                              {selectedSupplier.performanceConfig.dimensions.map(dim => (
                                <div key={dim.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                  <div className="flex-1">
                                    <div className="font-medium text-slate-900">{dim.name}</div>
                                    <div className="text-xs text-slate-500 uppercase">{dim.id}</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={dim.weight}
                                      onChange={(e) => updatePerformance('dimension', parseInt(e.target.value) || 0, dim.id)}
                                      className="w-20 px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-right"
                                    />
                                    <span className="text-slate-500 font-medium">%</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Total Weight Check */}
                            <div className="mt-4 flex justify-end">
                              <div className={cn(
                                "text-sm font-bold px-3 py-1 rounded-full border",
                                selectedSupplier.performanceConfig.dimensions.reduce((acc, curr) => acc + curr.weight, 0) === 100
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              )}>
                                Total: {selectedSupplier.performanceConfig.dimensions.reduce((acc, curr) => acc + curr.weight, 0)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200 border-dashed m-4">
              <div className="text-center max-w-sm mx-auto">
                <LayoutDashboard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">未选择供应商</h3>
                <p className="text-slate-500 mt-2">
                  请从左侧列表选择一个供应商，以为其配置财务模型、门户权限及等级权益。
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
