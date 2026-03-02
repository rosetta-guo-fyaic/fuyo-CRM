import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Crown,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  UserCheck,
  Ban,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { CreateCustomerModal } from '../components/CreateCustomerModal';
import { CUSTOMERS } from '../data/mockData';
import type { CustomerSummary } from '../models';

// --- Mock Data ---
const initialCustomers: CustomerSummary[] = CUSTOMERS.map(c => {
  let status: CustomerSummary['status'] = 'Core';
  switch (c.tier) {
    case 'strategic': status = 'Strategic'; break;
    case 'core': status = 'Core'; break;
    case 'backup': status = 'Backup'; break;
    case 'probation': status = 'Trial'; break;
    case 'lead': status = 'Lead'; break;
    case 'blacklisted': status = 'Blacklisted'; break;
  }
  
  return {
    id: c.id,
    name: c.name,
    localName: c.name, 
    category: c.tier === 'lead' ? 'Target' : 'Direct Client',
    status,
    location: c.address || 'China',
    createDate: '2024-0' + (Math.floor(Math.random() * 5) + 1) + '-' + (Math.floor(Math.random() * 20) + 10),
    healthScore: c.healthScore || 0,
    healthStatus: c.healthStatus,
    tags: c.tags || [],
    logoText: c.name.substring(0, 1).toUpperCase(),
    // Mock values for potential/lead specific fields
    source: 'LinkedIn', 
    interactionFreq: 'Medium',
    advantageLevel: 'Medium',
    potentialStage: 'Uncontacted'
  };
});

const statusConfig = {
  Strategic: { label: '复购客户', color: 'bg-purple-50 text-purple-700 border-purple-100', activeColor: 'bg-purple-600 text-white border-purple-600', icon: Crown },
  Core: { label: '成交客户', color: 'bg-blue-50 text-blue-700 border-blue-100', activeColor: 'bg-blue-600 text-white border-blue-600', icon: ShieldCheck },
  Backup: { label: '储备', color: 'bg-slate-50 text-slate-700 border-slate-100', activeColor: 'bg-slate-600 text-white border-slate-600', icon: TrendingUp },
  Trial: { label: '潜在客户', color: 'bg-amber-50 text-amber-700 border-amber-100', activeColor: 'bg-amber-500 text-white border-amber-500', icon: UserCheck },
  Lead: { label: '线索', color: 'bg-slate-50 text-slate-600 border-slate-200', activeColor: 'bg-slate-500 text-white border-slate-500', icon: UserPlus },
  Blacklisted: { label: '黑名单', color: 'bg-red-50 text-red-700 border-red-100', activeColor: 'bg-red-600 text-white border-red-600', icon: Ban },
};

// --- Add Partner Modal Component ---
const AddPartnerModal = ({ 
  isOpen, 
  onClose, 
  sourceList, 
  onAdd 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  sourceList: CustomerSummary[];
  onAdd: (selectedIds: string[]) => void;
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">选择要晋升的客户</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-0 max-h-[60vh] overflow-y-auto">
          {sourceList.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100 sticky top-0">
                <tr>
                  <th className="px-6 py-3 w-10">
                    {/* Checkbox Header could go here */}
                  </th>
                  <th className="px-6 py-3">客户名称</th>
                  <th className="px-6 py-3">当前状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sourceList.map(s => (
                  <tr 
                    key={s.id} 
                    className={cn(
                      "hover:bg-slate-50 transition-colors cursor-pointer",
                      selectedIds.has(s.id) ? "bg-brand-50 hover:bg-brand-50" : ""
                    )}
                    onClick={() => toggleSelection(s.id)}
                  >
                    <td className="px-6 py-4">
                      <div className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                        selectedIds.has(s.id) ? "bg-brand-500 border-brand-500" : "border-slate-300 bg-white"
                      )}>
                        {selectedIds.has(s.id) && <Plus className="w-3 h-3 text-white rotate-45" />} 
                        {/* Using rotate-45 Plus as a checkmark substitute or just use Check icon */}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.localName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2 py-0.5 rounded text-xs border", statusConfig[s.status as keyof typeof statusConfig]?.color)}>
                        {statusConfig[s.status as keyof typeof statusConfig]?.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-slate-500">
              没有可供选择的客户
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200 rounded-lg transition-all"
          >
            取消
          </button>
          <button 
            onClick={() => {
              onAdd(Array.from(selectedIds));
              onClose();
            }}
            disabled={selectedIds.size === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm shadow-brand-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            确认添加 ({selectedIds.size})
          </button>
        </div>
      </div>
    </div>
  );
};

export function CustomerList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [customersList, setCustomersList] = useState<CustomerSummary[]>(initialCustomers);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);
  
  // Get active filter from URL or default to 'all'
  const activeType = searchParams.get('type') || 'all';

  // Map URL types to Statuses
  const getFilteredCustomers = () => {
    switch (activeType) {
      case 'strategic': return customersList.filter(s => s.status === 'Strategic');
      case 'active': return customersList.filter(s => ['Core', 'Backup'].includes(s.status));
      case 'potential': return customersList.filter(s => s.status === 'Trial');
      case 'lead': return customersList.filter(s => s.status === 'Lead');
      case 'blacklist': return customersList.filter(s => s.status === 'Blacklisted');
      default: return customersList;
    }
  };

  const filteredCustomers = getFilteredCustomers();

  const handleCreateCustomer = (newCustomer: CustomerSummary) => {
    setCustomersList(prev => [newCustomer, ...prev]);
  };

  const handleAddPartners = (selectedIds: string[]) => {
    // In a real app, this would update the status of selected customers
    // For mock demo, we'll just simulate moving them to the current tab's status
    const targetStatus = activeType === 'strategic' ? 'Strategic' : 'Core'; // Simplified logic
    
    setCustomersList(prev => prev.map(s => {
      if (selectedIds.includes(s.id)) {
        return { ...s, status: targetStatus };
      }
      return s;
    }));
  };



  // Determine source list for Add Partner Modal
  const getSourceListForAdd = () => {
    if (activeType === 'strategic') {
      // Promoting from Active (Core/Backup) to Strategic
      return customersList.filter(s => ['Core', 'Backup'].includes(s.status));
    } else if (activeType === 'active') {
      // Promoting from Potential (Trial) to Active
      return customersList.filter(s => s.status === 'Trial');
    }
    return [];
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-brand-500" />
              客户名录 (Customer Directory)
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              共找到 {filteredCustomers.length} 家 
              {activeType !== 'all' && <span className="font-bold mx-1">{activeType}</span>} 
              客户
            </p>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索客户..." 
                className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 w-64"
              />
            </div>
            
            {activeType === 'potential' ? (
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors shadow-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                新建档案
              </button>
            ) : activeType !== 'all' && activeType !== 'blacklist' && (
              <button 
                onClick={() => setIsAddPartnerModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium"
              >
                <UserPlus className="w-4 h-4 text-brand-500" />
                新增伙伴
              </button>
            )}
          </div>
        </div>


      </div>

      {/* List View (Table) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">客户名称</th>
              <th className="px-6 py-3">服务类别</th>
              {activeType === 'potential' ? (
                <>
                  <th className="px-6 py-3">来源渠道</th>
                  <th className="px-6 py-3">现有阶段</th>
                  <th className="px-6 py-3">互动频率</th>
                  <th className="px-6 py-3">优势评级/详情</th>
                </>
              ) : (
                <>
                  <th className="px-6 py-3">状态</th>
                  <th className="px-6 py-3">创建时间</th>
                  <th className="px-6 py-3">跟进状态</th>
                </>
              )}
              <th className="px-6 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.map(customer => (
              <tr key={customer.id} className="hover:bg-slate-50/50 group cursor-pointer" onClick={() => navigate(`/customer-profile/${customer.id}`)}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      {customer.logoText}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{customer.name}</div>
                      <div className="text-xs text-slate-500">{customer.localName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{customer.category}</td>
                
                {activeType === 'potential' ? (
                  <>
                    <td className="px-6 py-4 text-slate-600">{customer.source || '-'}</td>
                    <td className="px-6 py-4">
                       <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-bold border",
                        customer.potentialStage === 'Negotiating' ? "bg-blue-50 text-blue-700 border-blue-100" :
                        customer.potentialStage === 'IntentConfirmed' ? "bg-green-50 text-green-700 border-green-100" :
                        "bg-slate-50 text-slate-600 border-slate-100"
                      )}>
                        {customer.potentialStage || '未接触'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-bold",
                        customer.interactionFreq === 'High' ? "bg-green-100 text-green-700" :
                        customer.interactionFreq === 'Medium' ? "bg-blue-100 text-blue-700" :
                        "bg-slate-100 text-slate-600"
                      )}>
                        {customer.interactionFreq || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-xs font-bold px-1.5 py-0.5 rounded",
                            customer.advantageLevel === 'High' ? "bg-purple-100 text-purple-700" :
                            customer.advantageLevel === 'Medium' ? "bg-blue-100 text-blue-700" :
                            "bg-slate-100 text-slate-600"
                          )}>
                            {customer.advantageLevel || '-'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {customer.coreAdvantages?.map((adv, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-500 px-1 rounded">
                              {adv}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4">
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 w-fit", statusConfig[customer.status].color)}>
                        {React.createElement(statusConfig[customer.status].icon, { className: "w-3 h-3" })}
                        {statusConfig[customer.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-900">{customer.createDate}</td>
                    <td className="px-6 py-4">
                      {customer.healthStatus ? (
                        <span className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded border",
                          customer.healthStatus === '未触达' ? "bg-slate-50 text-slate-500 border-slate-200" :
                          customer.healthStatus === '待响应' ? "bg-amber-50 text-amber-600 border-amber-200" :
                          "bg-slate-50 text-slate-700 border-slate-200"
                        )}>
                          {customer.healthStatus}
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full rounded-full", 
                                customer.healthScore >= 90 ? "bg-emerald-500" : 
                                customer.healthScore >= 80 ? "bg-blue-500" : "bg-amber-500"
                              )}
                              style={{ width: `${customer.healthScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{customer.healthScore}</span>
                        </div>
                      )}
                    </td>
                  </>
                )}
                
                <td className="px-6 py-4 text-right">
                  <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredCustomers.length === 0 && (
          <div className="p-12 text-center text-slate-500 bg-slate-50/50">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">未找到相关客户</h3>
            <p className="text-slate-500 mt-1">没有符合当前筛选条件的客户记录</p>
          </div>
        )}
      </div>

      <CreateCustomerModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCustomer}
      />

      <AddPartnerModal
        isOpen={isAddPartnerModalOpen}
        onClose={() => setIsAddPartnerModalOpen(false)}
        sourceList={getSourceListForAdd()}
        onAdd={handleAddPartners}
      />
    </div>
  );
}
