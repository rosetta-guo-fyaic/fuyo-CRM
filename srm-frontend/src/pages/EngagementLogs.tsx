import React, { useState } from 'react';
import { 
  MessageSquare, 
  Zap, 
  Users, 
  Plus, 
  Filter, 
  Search,
  MoreHorizontal,
  ThumbsUp,
  MessageCircle,
  Briefcase
} from 'lucide-react';

// --- Types ---
interface LogEntry {
  id: string;
  date: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  dimensions: {
    business?: {
      insight: string;
      action?: string;
    };
    political?: {
      insight: string;
      action?: string;
    };
  };
  tags: string[];
  likes: number;
  comments: number;
}

// --- Mock Data ---
const initialLogs: LogEntry[] = [
  {
    id: '1',
    date: '2024-01-15 14:30',
    author: {
      name: 'Tommy Liu',
      avatar: 'T',
      role: 'Procurement Manager'
    },
    content: '拜访了美森轮船上海总部，与James进行了深入沟通。对方表示2024年运力会增加15%，特别是针对跨境电商专线。',
    dimensions: {
      business: {
        insight: '运力预期增长15%，主要集中在CLX+航线',
        action: '已更新供应商能力标签：[运力充沛]'
      },
      political: {
        insight: 'James似乎更关注长期合约的稳定性，而非短期高价',
        action: '建议：Q1季度谈判重点放在保量不保价'
      }
    },
    tags: ['高层拜访', '运力规划'],
    likes: 5,
    comments: 2
  },
  {
    id: '2',
    date: '2024-01-10 09:15',
    author: {
      name: 'Sarah Chen',
      avatar: 'S',
      role: 'Sourcing Specialist'
    },
    content: '处理了一起突发的甩柜事故。虽然最终解决了，但发现他们的操作团队在旺季时沟通效率明显下降。',
    dimensions: {
      business: {
        insight: '旺季操作响应延迟，SOP执行不到位',
        action: '已记录：异常事件x1'
      }
    },
    tags: ['异常处理', '操作磨合'],
    likes: 2,
    comments: 0
  }
];

export function EngagementLogs() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form State
  const [newLog, setNewLog] = useState({
    content: '',
    businessInsight: '',
    politicalInsight: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.content) return;

    const entry: LogEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      author: {
        name: 'Me',
        avatar: 'M',
        role: 'Chairman'
      },
      content: newLog.content,
      dimensions: {
        business: newLog.businessInsight ? {
          insight: newLog.businessInsight,
          action: '系统自动分析中...'
        } : undefined,
        political: newLog.politicalInsight ? {
          insight: newLog.politicalInsight,
          action: '影响力权重计算中...'
        } : undefined
      },
      tags: ['日常跟进'],
      likes: 0,
      comments: 0
    };

    setLogs([entry, ...logs]);
    setNewLog({ content: '', businessInsight: '', politicalInsight: '' });
    setIsFormOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header & Actions */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-brand-500" />
          动态维护日志 (Engagement Logs)
        </h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索日志/关键词..." 
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 w-64"
            />
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200">
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            写日志
          </button>
        </div>
      </div>

      {/* Input Form (Modal-like overlay or Inline expansion) */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-brand-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-500" />
            新增动态记录
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">事件简述 (Event Summary)</label>
              <textarea 
                value={newLog.content}
                onChange={e => setNewLog({...newLog, content: e.target.value})}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 min-h-[100px]"
                placeholder="记录今天发生了什么..."
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <label className="block text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  维度A: 主营业务洞察 (Business)
                </label>
                <input 
                  type="text"
                  value={newLog.businessInsight}
                  onChange={e => setNewLog({...newLog, businessInsight: e.target.value})}
                  className="w-full p-2 border border-blue-200 rounded bg-white text-sm"
                  placeholder="e.g. 发现车队外包..."
                />
                <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  系统动作: 自动打标/移除标签
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <label className="block text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  维度B: 决策链洞察 (Political)
                </label>
                <input 
                  type="text"
                  value={newLog.politicalInsight}
                  onChange={e => setNewLog({...newLog, politicalInsight: e.target.value})}
                  className="w-full p-2 border border-purple-200 rounded bg-white text-sm"
                  placeholder="e.g. 真正拍板人是财务..."
                />
                <p className="text-xs text-purple-600 mt-2 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  系统动作: 调整人物影响力权重
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                取消
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 font-medium shadow-sm"
              >
                发布日志
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timeline Stream */}
      <div className="space-y-6">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4 group">
            {/* Avatar Column */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-bold text-sm z-10">
                {log.author.avatar}
              </div>
              <div className="w-0.5 h-full bg-slate-200 -mt-2 group-last:hidden" />
            </div>

            {/* Content Column */}
            <div className="flex-1 pb-8">
              <div className="flex items-baseline justify-between mb-1">
                <h4 className="font-bold text-slate-900">{log.author.name} <span className="text-xs font-normal text-slate-500 ml-2">{log.author.role}</span></h4>
                <span className="text-xs text-slate-400">{log.date}</span>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative hover:shadow-md transition-shadow">
                <p className="text-slate-800 mb-4 whitespace-pre-wrap">{log.content}</p>

                {/* Dual Dimension Cards */}
                {(log.dimensions.business || log.dimensions.political) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {log.dimensions.business && (
                      <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100">
                        <div className="flex items-center gap-2 mb-1">
                           <span className="text-xs font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">业务洞察</span>
                        </div>
                        <p className="text-sm text-slate-700 mb-2">{log.dimensions.business.insight}</p>
                        {log.dimensions.business.action && (
                          <div className="flex items-start gap-1.5 text-xs text-blue-600 bg-white/50 p-2 rounded">
                            <Zap className="w-3 h-3 mt-0.5 shrink-0" />
                            <span>{log.dimensions.business.action}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {log.dimensions.political && (
                      <div className="bg-purple-50/50 rounded-lg p-3 border border-purple-100">
                        <div className="flex items-center gap-2 mb-1">
                           <span className="text-xs font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">决策链洞察</span>
                        </div>
                        <p className="text-sm text-slate-700 mb-2">{log.dimensions.political.insight}</p>
                        {log.dimensions.political.action && (
                          <div className="flex items-start gap-1.5 text-xs text-purple-600 bg-white/50 p-2 rounded">
                            <Zap className="w-3 h-3 mt-0.5 shrink-0" />
                            <span>{log.dimensions.political.action}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex gap-2">
                    {log.tags.map(tag => (
                      <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">#{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                     <button className="flex items-center gap-1 hover:text-brand-500 transition-colors text-sm">
                       <ThumbsUp className="w-4 h-4" />
                       {log.likes || '赞'}
                     </button>
                     <button className="flex items-center gap-1 hover:text-brand-500 transition-colors text-sm">
                       <MessageCircle className="w-4 h-4" />
                       {log.comments || '评论'}
                     </button>
                     <button className="hover:text-brand-500 transition-colors">
                       <MoreHorizontal className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex justify-center py-4">
          <button className="text-sm text-slate-400 hover:text-brand-500 flex items-center gap-1">
            <MoreHorizontal className="w-4 h-4" />
            查看更早的记录
          </button>
        </div>
      </div>
    </div>
  );
}
