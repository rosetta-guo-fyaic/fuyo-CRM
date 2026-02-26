import { useState } from 'react';
import { 
  GitCommit, 
  Search, 
  MoreHorizontal, 
  AlertTriangle, 
  Clock, 
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';

// Types
type LifecycleStage = 'leads' | 'probation' | 'active' | 'blacklist';

interface SupplierCard {
  id: string;
  name: string;
  code?: string;
  stage: LifecycleStage;
  tags: string[];
  score?: number;
  probationTask?: {
    name: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    deadline: string;
  };
}

// Mock Data
const initialSuppliers: SupplierCard[] = [
  { 
    id: 'S001', name: 'Global Freight Logistics', stage: 'leads', 
    tags: ['NVOCC', 'US-East'], 
  },
  { 
    id: 'S002', name: 'Shenzhen Trans Co.', stage: 'leads', 
    tags: ['Trucking', 'South-CN'], 
  },
  { 
    id: 'S003', name: 'Pacific Star Line', stage: 'probation', code: 'V-PSL-SH',
    tags: ['Carrier', 'SE-Asia'], 
    probationTask: {
      name: 'Trial Shipment: 10x40HQ to LAX',
      status: 'in_progress',
      deadline: '2024-03-15'
    }
  },
  { 
    id: 'S004', name: 'Matson Navigation', stage: 'active', code: 'V-MSK-SH',
    tags: ['Strategic', 'US-West'], score: 92
  },
  { 
    id: 'S005', name: 'Evergreen Marine', stage: 'active', code: 'V-EMC-TW',
    tags: ['Core', 'Global'], score: 88
  },
  { 
    id: 'S006', name: 'Unreliable Trucking Inc.', stage: 'blacklist', code: 'V-BAD-01',
    tags: ['Fraud Risk'], score: 45
  }
];

export function LifecycleManagement() {
  const [suppliers] = useState<SupplierCard[]>(initialSuppliers);

  const columns: { id: LifecycleStage; label: string; color: string; count: number }[] = [
    { id: 'leads', label: '线索公海 (Leads)', color: 'bg-slate-100 border-slate-200', count: suppliers.filter(s => s.stage === 'leads').length },
    { id: 'probation', label: '考察/试用 (Probation)', color: 'bg-blue-50 border-blue-200', count: suppliers.filter(s => s.stage === 'probation').length },
    { id: 'active', label: '合作中 (Active)', color: 'bg-green-50 border-green-200', count: suppliers.filter(s => s.stage === 'active').length },
    { id: 'blacklist', label: '黑名单/冻结 (Exit)', color: 'bg-red-50 border-red-200', count: suppliers.filter(s => s.stage === 'blacklist').length },
  ];

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <GitCommit className="w-8 h-8 text-slate-400" />
            生命周期看板 (Lifecycle Pipeline)
          </h1>
          <p className="text-slate-500 mt-1">全流程可视化管理：从线索录入、试单考察到优胜劣汰。</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search suppliers..." 
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-brand-500 w-64"
            />
          </div>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2 text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 h-full min-w-[1200px]">
          {columns.map((col) => (
            <div key={col.id} className="flex-1 flex flex-col min-w-[300px]">
              {/* Column Header */}
              <div className={cn("p-3 rounded-t-xl border-t border-x mb-0 flex justify-between items-center", col.color)}>
                <h3 className="font-bold text-slate-700">{col.label}</h3>
                <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold text-slate-600">
                  {col.count}
                </span>
              </div>

              {/* Drop Zone (Visual Only for now) */}
              <div className="flex-1 bg-slate-50/50 border rounded-b-xl p-3 space-y-3 overflow-y-auto">
                {suppliers.filter(s => s.stage === col.id).map((supplier) => (
                  <div key={supplier.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-900 line-clamp-1">{supplier.name}</span>
                      <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {supplier.code && (
                      <div className="text-xs font-mono text-slate-500 mb-2 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                        {supplier.code}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mb-3">
                      {supplier.tags.map((tag, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded border border-slate-200">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Special Logic per Column */}
                    {col.id === 'probation' && supplier.probationTask && (
                      <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded text-xs">
                        <div className="flex items-center gap-1.5 font-semibold text-blue-800 mb-1">
                          <Clock className="w-3 h-3" />
                          试单任务 (Trial)
                        </div>
                        <p className="text-blue-700 mb-1">{supplier.probationTask.name}</p>
                        <div className="flex justify-between text-[10px] text-blue-600/80">
                          <span>Deadline: {supplier.probationTask.deadline}</span>
                          <span className="capitalize font-medium">{supplier.probationTask.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                    )}

                    {col.id === 'active' && supplier.score && (
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Performance Score</span>
                        <span className={cn(
                          "font-bold px-1.5 py-0.5 rounded",
                          supplier.score >= 90 ? "bg-green-100 text-green-700" :
                          supplier.score >= 70 ? "bg-blue-100 text-blue-700" :
                          "bg-amber-100 text-amber-700"
                        )}>
                          {supplier.score}
                        </span>
                      </div>
                    )}

                    {col.id === 'blacklist' && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                        <AlertTriangle className="w-3 h-3" />
                        永久拉黑 (Permanent Ban)
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Empty State / Drop Area */}
                {col.count === 0 && (
                  <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                    No suppliers
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
