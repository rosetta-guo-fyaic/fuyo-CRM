import { useState } from 'react';
import { 
  AlertCircle, 
  MoreHorizontal,
  Plus,
  X
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

// --- UI Components ---
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden", className)}>
    {children}
  </div>
);

const CardHeader = ({ title, action }: { title: string; action?: React.ReactNode }) => (
  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
    <h3 className="font-semibold text-slate-900">{title}</h3>
    {action}
  </div>
);

// --- Mock Data ---

const initialTaskList = [
  { id: 1, title: "审核 '宁波港通' 准入申请", type: "Approval", due: "Today", status: "High", supplierId: 'SUP-2024-004', targetTab: 'asset', action: 'verify', assignee: "Tommy", source: "System" },
  { id: 2, title: "填写 '美森轮船' Q1 绩效评估", type: "Review", due: "Tomorrow", status: "Medium", supplierId: 'SUP-2024-001', targetTab: 'performance', action: 'score_modal', assignee: "Tommy", source: "System" },
  { id: 3, title: "更新 '中欧班列' 2026 合同归档", type: "Doc", due: "Feb 10", status: "Low", supplierId: 'SUP-2024-003', targetTab: 'contract', action: '', assignee: "Sarah", source: "System" },
  { id: 4, title: "跟进 '盐田堆场' 异常处理结果", type: "Follow-up", due: "Feb 12", status: "High", supplierId: 'SUP-2024-002', targetTab: 'engagement', action: 'log_modal', assignee: "Tommy", source: "System" },
];

const riskList = [
  { id: 1, supplier: "TechGiant Corp", issue: "年度服务合同即将到期 (15天)", level: "High" },
  { id: 2, supplier: "Speedy Retail", issue: "客户投诉超过 48 小时未处理", level: "Medium" },
  { id: 3, supplier: "Global Trade Inc", issue: "关键决策人变更，需重新跟进", level: "High" },
];

const personalPerformanceData = [
  { month: 'Jan', revenue: 420000, profit: 85000, volume: 120 },
  { month: 'Feb', revenue: 380000, profit: 72000, volume: 105 },
  { month: 'Mar', revenue: 550000, profit: 110000, volume: 158 },
  { month: 'Apr', revenue: 490000, profit: 95000, volume: 142 },
  { month: 'May', revenue: 620000, profit: 125000, volume: 180 },
  { month: 'Jun', revenue: 750000, profit: 155000, volume: 210 },
];

const businessPerformanceData = [
  { month: 'Jan', revenue: 4200000, profit: 850000, volume: 1200 },
  { month: 'Feb', revenue: 3800000, profit: 720000, volume: 1050 },
  { month: 'Mar', revenue: 5500000, profit: 1100000, volume: 1580 },
  { month: 'Apr', revenue: 4900000, profit: 950000, volume: 1420 },
  { month: 'May', revenue: 6200000, profit: 1250000, volume: 1800 },
  { month: 'Jun', revenue: 7500000, profit: 1550000, volume: 2100 },
];

const personalFunnelData = [
  { value: 120, name: '线索', fill: '#fdba74', label: '120 (100%)' },      // Orange 300
  { value: 80, name: '潜在', fill: '#fb923c', label: '80 (67%)' },   // Orange 400
  { value: 50, name: '成交', fill: '#f97316', label: '50 (63%)' },      // Orange 500
  { value: 35, name: '复购', fill: '#ea580c', label: '35 (70%)' },   // Orange 600
];

const businessFunnelData = [
  { value: 1200, name: '线索', fill: '#fdba74', label: '1200 (100%)' },      // Orange 300
  { value: 800, name: '潜在', fill: '#fb923c', label: '800 (67%)' },   // Orange 400
  { value: 500, name: '成交', fill: '#f97316', label: '500 (63%)' },      // Orange 500
  { value: 350, name: '复购', fill: '#ea580c', label: '350 (70%)' },   // Orange 600
];

export function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(initialTaskList);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', due: '', status: 'Medium' });
  const [perfTab, setPerfTab] = useState<'business' | 'personal'>('business');
  const [perfDimension, setPerfDimension] = useState('revenue');
  const [perfPeriod, setPerfPeriod] = useState('H1');

  const handleAddTask = () => {
    if (!newTask.title) return;
    const task = {
      id: tasks.length + 1,
      title: newTask.title,
      type: "Personal",
      due: newTask.due || "No Date",
      status: newTask.status,
      supplierId: '',
      targetTab: '',
      assignee: "Me",
      source: "Personal"
    };
    // @ts-ignore
    setTasks([task, ...tasks]);
    setIsAddTaskOpen(false);
    setNewTask({ title: '', due: '', status: 'Medium' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div className="space-y-6">
        
        {/* 2. 异常看板 */}
        <Card className="border-t-4 border-t-red-500">
          <CardHeader 
             title="异常看板" 
             action={<button className="p-1 hover:bg-slate-100 rounded"><MoreHorizontal className="w-5 h-5 text-slate-400" /></button>}
          />
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3 font-medium">客户名称</th>
                  <th className="px-6 py-3 font-medium">异常情况</th>
                  <th className="px-6 py-3 font-medium">等级</th>
                  <th className="px-6 py-3 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {riskList.map((risk) => (
                  <tr key={risk.id} className="border-b border-slate-50 hover:bg-red-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{risk.supplier}</td>
                    <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      {risk.issue}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded border text-xs font-bold",
                        risk.level === 'High' ? "bg-red-50 text-red-700 border-red-100" : "bg-amber-50 text-amber-700 border-amber-100"
                      )}>
                        {risk.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-brand-600 hover:text-brand-700 font-medium text-xs hover:underline">处理</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* 3. 我的任务 */}
        <Card className="flex flex-col border-t-4 border-t-blue-500 relative h-[400px]">
          <CardHeader 
             title="我的任务" 
             action={
               <div className="flex items-center gap-2">
                 <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full">{tasks.length} 待处理</span>
                 <button 
                   onClick={() => setIsAddTaskOpen(true)}
                   className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-brand-600 transition-colors"
                   title="新增个人任务"
                 >
                   <Plus className="w-4 h-4" />
                 </button>
               </div>
             }
          />
          <div className="p-0 flex-1 overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 font-medium">任务</th>
                  <th className="px-4 py-3 font-medium text-right">截止</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tasks.map((task) => (
                  <tr 
                    key={task.id} 
                    onClick={() => {
                      if (task.supplierId) {
                        // @ts-ignore
                        const actionParam = task.action ? `&action=${task.action}` : '';
                        navigate(`/supplier-profile/${task.supplierId}?tab=${task.targetTab}${actionParam}`);
                      }
                    }}
                    className={cn(
                      "hover:bg-slate-50 transition-colors group",
                      task.supplierId ? "cursor-pointer" : "cursor-default"
                    )}
                  >
                    <td className="px-4 py-3">
                       <div className="flex items-start gap-2">
                         <div className={cn(
                           "mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0",
                           task.status === 'High' ? "bg-red-500" : task.status === 'Medium' ? "bg-amber-500" : "bg-slate-300"
                         )} />
                         <div>
                           <div className="font-medium text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1" title={task.title}>
                             {task.title}
                           </div>
                           <div className="flex items-center gap-2 mt-1">
                             {task.source === 'Personal' ? (
                               <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-amber-50 text-amber-700 border-amber-100">
                                 个人
                               </span>
                             ) : (
                               <span className={cn(
                                 "text-[10px] font-bold px-1.5 py-0.5 rounded border",
                                 task.type === 'Approval' ? "bg-purple-50 text-purple-600 border-purple-100" :
                                 task.type === 'Review' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                 "bg-slate-50 text-slate-500 border-slate-100"
                               )}>
                                 {task.type}
                               </span>
                             )}
                             <span className="text-[10px] text-slate-400">{task.assignee}</span>
                           </div>
                         </div>
                       </div>
                    </td>
                    <td className="px-4 py-3 text-right align-top">
                      <span className={cn(
                        "text-xs font-bold",
                        task.due === 'Today' ? "text-red-500" : "text-slate-400"
                      )}>{task.due}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-slate-100 text-center mt-auto">
            <button 
              className="text-xs font-medium text-slate-500 hover:text-brand-600 w-full py-1"
            >
              查看全部
            </button>
          </div>

          {/* Add Task Modal (Inline Absolute) */}
          {isAddTaskOpen && (
            <div className="absolute inset-0 bg-white z-10 flex flex-col p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-900">新增个人任务</h4>
                <button onClick={() => setIsAddTaskOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">任务标题</label>
                  <input 
                    type="text" 
                    value={newTask.title}
                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="例如: 联系 James 确认 Q3 报价"
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">截止日期</label>
                    <input 
                      type="text" 
                      value={newTask.due}
                      onChange={e => setNewTask({...newTask, due: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="例如: 明天"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">优先级</label>
                    <select 
                      value={newTask.status}
                      onChange={e => setNewTask({...newTask, status: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="High">高</option>
                      <option value="Medium">中</option>
                      <option value="Low">低</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button 
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded"
                >
                  取消
                </button>
                <button 
                  onClick={handleAddTask}
                  disabled={!newTask.title}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-brand-600 hover:bg-brand-700 rounded disabled:opacity-50"
                >
                  确认添加
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* 3.5 Global Visit Calendar - Moved next to Tasks */}
        <Card className="h-[400px] flex flex-col">
          <CardHeader 
            title="全域拜访日历" 
            action={
              <div className="flex items-center gap-4">
                 <div className="flex gap-3 text-xs">
                   <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> 计划中</span>
                   <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> 已完成</span>
                 </div>
                 <select className="text-xs border-slate-200 rounded-lg py-1.5 px-2 bg-slate-50">
                   <option>2026年 2月</option>
                 </select>
              </div>
            }
          />
          <div className="p-6 flex-1 overflow-hidden">
             <div className="grid grid-cols-7 bg-slate-200 gap-px border border-slate-200 rounded-lg overflow-hidden h-full">
               {['周日', '周一', '周二', '周三', '周四', '周五', '周六'].map(day => (
                 <div key={day} className="bg-slate-50 p-2 text-center text-[10px] font-semibold text-slate-500 h-8 flex items-center justify-center">
                   {day}
                 </div>
               ))}
               
               {/* Mock Calendar Days (35 slots) */}
               {Array.from({length: 35}).map((_, i) => {
                  // 2026 Feb 1st is Sunday (index 0)
                  const date = i + 1; 
                  const isCurrentMonth = date > 0 && date <= 28;
                  const day = isCurrentMonth ? date : '';
                  
                  // Mock Events
                  const events = [];
                  if (day === 5) events.push({ type: 'done', title: 'Dinner: James' });
                  if (day === 15) events.push({ type: 'done', title: 'Review: Linda' });
                  if (day === 22) events.push({ type: 'plan', title: 'QBR: Ningbo' });
                  if (day === 24) events.push({ type: 'plan', title: 'Visit: Maersk' });
                  
                  return (
                    <div key={i} className={cn(
                      "bg-white p-1 transition-colors relative flex flex-col",
                      isCurrentMonth ? "hover:bg-slate-50" : "bg-slate-50/50"
                    )}>
                      <span className={cn(
                        "text-[10px] font-medium block mb-0.5", 
                        isCurrentMonth ? "text-slate-700" : "text-slate-300"
                      )}>{day}</span>
                      
                      <div className="space-y-0.5 flex-1 overflow-y-auto custom-scrollbar">
                        {events.map((evt, idx) => (
                          <div key={idx} className={cn(
                            "px-1 py-0.5 rounded text-[8px] truncate border leading-none",
                            evt.type === 'plan' ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                          )} title={evt.title}>
                            {evt.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
               })}
             </div>
          </div>
        </Card>
      </div>
      </div>

      {/* 4. 绩效看板 (Performance Dashboard) */}
      <Card className="mt-6">
          <CardHeader 
            title="我的绩效看板" 
            action={
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setPerfTab('business')}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                    perfTab === 'business' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  业务绩效
                </button>
                <button 
                  onClick={() => setPerfTab('personal')}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                    perfTab === 'personal' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  个人绩效
                </button>
              </div>
            }
          />
          
          <div className="p-6">
            {/* Filters (Shared) */}
            <div className="flex items-center gap-4 mb-6">
              <select 
                className="text-sm border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                value={perfPeriod}
                onChange={(e) => setPerfPeriod(e.target.value)}
              >
                <option value="H1">2026 上半年</option>
                <option value="Q1">2026 Q1</option>
                <option value="Q2">2026 Q2</option>
              </select>

              <div className="flex gap-2">
                {['revenue', 'profit', 'volume'].map(dim => (
                  <button
                    key={dim}
                    onClick={() => setPerfDimension(dim)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
                      perfDimension === dim 
                        ? "bg-brand-50 border-brand-200 text-brand-700" 
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    )}
                  >
                    {dim === 'revenue' ? '营收 (Revenue)' : dim === 'profit' ? '毛利 (Profit)' : '单量 (Volume)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-8">
              {/* Left: Trend Chart (60%) */}
              <div className="col-span-3 flex flex-col h-64">
                <h4 className="text-sm font-medium text-slate-700 mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-brand-500 rounded-full"></div>
                  {perfTab === 'business' ? '业务' : '个人'}
                  {perfDimension === 'revenue' ? '营收' : perfDimension === 'profit' ? '毛利' : '单量'}趋势
                </h4>
                <div className="flex-1 min-h-0 bg-slate-50/50 rounded-lg p-2 border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={perfTab === 'business' ? businessPerformanceData : personalPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 12, fill: '#64748b'}} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 12, fill: '#64748b'}} 
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={perfDimension} 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                        dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}}
                        activeDot={{r: 6}} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right: Funnel Chart (40%) */}
              <div className="col-span-2 flex flex-col h-64 pl-6 border-l border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
                    {perfTab === 'business' ? '业务漏斗 (Business Funnel)' : '个人漏斗 (Personal Funnel)'}
                  </h4>
                </div>

                <div className="flex-1 min-h-0 relative flex items-center">
                   <ResponsiveContainer width="100%" height="100%">
                     <FunnelChart>
                       <Tooltip />
                       <Funnel
                         dataKey="value"
                         data={perfTab === 'business' ? businessFunnelData : personalFunnelData}
                         isAnimationActive
                       >
                         {/* 1. Category Name Inside */}
                         <LabelList position="inside" fill="#fff" stroke="none" dataKey="name" fontSize={12} fontWeight="bold" />
                         {/* 2. Stats Outside */}
                         <LabelList position="right" fill="#64748b" stroke="none" dataKey="label" fontSize={11} />
                       </Funnel>
                     </FunnelChart>
                   </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Bottom Key Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              {perfTab === 'business' ? (
                <>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">总营收 (Total Revenue)</div>
                    <div className="text-xl font-bold text-slate-900">¥24.5M <span className="text-xs font-normal text-emerald-600">↑ 12%</span></div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">平均毛利率 (Avg GP Margin)</div>
                    <div className="text-xl font-bold text-slate-900">22.5% <span className="text-xs font-normal text-emerald-500">↑ 1.2%</span></div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">总活跃客户 (Total Active)</div>
                    <div className="text-xl font-bold text-slate-900">1,420 <span className="text-xs font-normal text-slate-400">家</span></div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">个人营收 (My Revenue)</div>
                    <div className="text-xl font-bold text-slate-900">¥2.4M <span className="text-xs font-normal text-emerald-600">S级</span></div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">个人毛利率 (My GP Margin)</div>
                    <div className="text-xl font-bold text-slate-900">24.8% <span className="text-xs font-normal text-slate-400">Top 3</span></div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">我的客户 (My Customers)</div>
                    <div className="text-xl font-bold text-slate-900">142 <span className="text-xs font-normal text-slate-400">家</span></div>
                  </div>
                </>
              )}
            </div>

          </div>
      </Card>
    </div>
  );
}
