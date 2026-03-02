import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  LogOut,
  LayoutDashboard,
  ShoppingCart,
  Truck,
  Wallet,
  FileText,
  Ship,
  Plane,

  MapPin,
  CheckCircle2,
  AlertCircle,
  Download
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SUPPLIERS } from '../data/mockData';

export function CustomerPortal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = SUPPLIERS.find(s => s.id === id);
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  if (!customer) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">未找到客户</h2>
          <button 
            onClick={() => navigate('/settings')}
            className="text-brand-600 hover:text-brand-700 font-medium"
          >
            返回配置页
          </button>
        </div>
      </div>
    );
  }

  const portalAccess = customer.portalAccess;

  const modules = [
    { 
      id: 'quotation', 
      label: '询价中心', 
      icon: ShoppingCart,
      access: portalAccess.quotationHub 
    },
    { 
      id: 'orders', 
      label: '订单指挥中心', 
      icon: Truck,
      access: portalAccess.orderCommand 
    },
    { 
      id: 'wallet', 
      label: '资金与文档', 
      icon: Wallet,
      access: portalAccess.walletDocs 
    }
  ];

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-none">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">客户门户</h1>
            <p className="text-xs text-slate-400 mt-1">CRM 驱动</p>
          </div>
        </div>

        <div className="p-4">
            <div className="mb-6 px-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">欢迎</p>
                <div className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-lg">
                        {customer.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-medium text-sm truncate">{customer.name}</p>
                        <p className="text-xs text-slate-400 truncate">VIP 客户</p>
                    </div>
                </div>
            </div>

            <nav className="space-y-1">
                <button
                    onClick={() => setActiveModule('dashboard')}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        activeModule === 'dashboard' 
                            ? "bg-brand-600 text-white" 
                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                >
                    <LayoutDashboard className="w-4 h-4" />
                    仪表盘
                </button>

                <div className="pt-4 pb-2">
                    <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">功能模块</p>
                </div>

                {modules.map(module => (
                    module.access ? (
                        <button
                            key={module.id}
                            onClick={() => setActiveModule(module.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                activeModule === module.id 
                                    ? "bg-brand-600 text-white" 
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                            )}
                        >
                            <module.icon className="w-4 h-4" />
                            {module.label}
                        </button>
                    ) : (
                        <div key={module.id} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 cursor-not-allowed opacity-50" title="联系客户经理开通">
                            <module.icon className="w-4 h-4" />
                            {module.label}
                            <span className="ml-auto text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">未开通</span>
                        </div>
                    )
                ))}
            </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-800">
            <button 
                onClick={() => navigate('/settings')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
            >
                <LogOut className="w-4 h-4" />
                退出预览
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-none">
            <h2 className="text-xl font-bold text-slate-800">
                {activeModule === 'dashboard' && '概览'}
                {activeModule === 'quotation' && '询价中心'}
                {activeModule === 'orders' && '订单指挥中心'}
                {activeModule === 'wallet' && '资金与文档'}
            </h2>
            
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="搜索..." 
                        className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-full bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 w-64"
                    />
                </div>
                <button className="relative p-2 text-slate-400 hover:text-slate-600">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-slate-700">客户管理员</p>
                        <p className="text-xs text-slate-500">超级用户</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
            {activeModule === 'dashboard' && (
                <div className="space-y-6">
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-brand-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-2">欢迎回来, {customer.name}!</h2>
                            <p className="text-brand-100 max-w-xl">您的物流业务运行平稳。您有 3 票进行中的运输和 1 个待处理的询价。</p>
                            <button className="mt-6 px-6 py-2 bg-white text-brand-600 rounded-lg font-bold hover:bg-brand-50 transition-colors shadow-sm">
                                查看进行中的运输
                            </button>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                            <Ship className="w-64 h-64" />
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: '运输中', value: '12', trend: '+2', icon: Ship, color: 'text-blue-500', bg: 'bg-blue-50' },
                            { label: '待报价', value: '3', trend: '新增', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50' },
                            { label: '在途', value: '8', trend: '准时', icon: Truck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                            { label: '年度总支出', value: '¥8.4M', trend: '+15%', icon: Wallet, color: 'text-purple-500', bg: 'bg-purple-50' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={cn("p-3 rounded-lg", stat.bg)}>
                                        <stat.icon className={cn("w-6 h-6", stat.color)} />
                                    </div>
                                    <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">{stat.trend}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                <p className="text-sm text-slate-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="font-bold text-slate-900 mb-6">近期动态</h3>
                        <div className="space-y-6">
                            {[
                                { title: '运单 #SH-2024-001 已抵达目的地', time: '2 小时前', icon: CheckCircle2, color: 'text-emerald-500' },
                                { title: '收到 LAX-PVG 空运航线的新报价', time: '5 小时前', icon: FileText, color: 'text-blue-500' },
                                { title: '清关延误 - 需处理', time: '1 天前', icon: AlertCircle, color: 'text-amber-500' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="mt-1">
                                        <item.icon className={cn("w-5 h-5", item.color)} />
                                    </div>
                                    <div className="flex-1 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                                        <h4 className="font-medium text-slate-900">{item.title}</h4>
                                        <p className="text-sm text-slate-400 mt-1">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeModule === 'quotation' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">进行中的询价</h3>
                            <p className="text-slate-500 text-sm">管理您的询价单并比价</p>
                        </div>
                        <button className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 shadow-sm flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            新建询价
                        </button>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">询价单号</th>
                                    <th className="px-6 py-4">航线</th>
                                    <th className="px-6 py-4">运输方式</th>
                                    <th className="px-6 py-4">状态</th>
                                    <th className="px-6 py-4">报价数</th>
                                    <th className="px-6 py-4 text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    { id: 'RFQ-2024-089', route: '上海 (PVG) -> 洛杉矶 (LAX)', mode: '空运', status: '开放中', quotes: 3 },
                                    { id: 'RFQ-2024-088', route: '宁波 (NGB) -> 汉堡 (HAM)', mode: '海运', status: '已完成', quotes: 5 },
                                    { id: 'RFQ-2024-085', route: '深圳 (SZX) -> 纽约 (JFK)', mode: '空运', status: '已过期', quotes: 0 },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-brand-600">{row.id}</td>
                                        <td className="px-6 py-4 text-slate-700">{row.route}</td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-2 text-slate-600">
                                                {row.mode === '空运' ? <Plane className="w-4 h-4" /> : <Ship className="w-4 h-4" />}
                                                {row.mode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-full text-xs font-bold",
                                                row.status === '开放中' ? "bg-emerald-100 text-emerald-700" :
                                                row.status === '已完成' ? "bg-blue-100 text-blue-700" :
                                                "bg-slate-100 text-slate-500"
                                            )}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{row.quotes} 个方案</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-brand-600 hover:text-brand-700 font-medium">查看详情</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeModule === 'orders' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-1 min-h-[400px] flex items-center justify-center bg-slate-100 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
                            <div className="text-center z-10">
                                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <h3 className="text-slate-500 font-bold">全球物流交互地图</h3>
                                <p className="text-slate-400 text-sm">可视化展示 12 票在途货物</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bold text-slate-900">实时动态</h3>
                            {[
                                { id: 'SH-001', loc: '已从浦东机场起飞', status: '运输中', time: '10 分钟前' },
                                { id: 'SH-002', loc: '已抵达长滩港', status: '已送达', time: '1 小时前' },
                                { id: 'SH-003', loc: '正在清关', status: '待处理', time: '3 小时前' },
                                { id: 'SH-004', loc: '已预约提货', status: '已计划', time: '5 小时前' },
                            ].map((update, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-brand-600">{update.id}</span>
                                        <span className="text-xs text-slate-400">{update.time}</span>
                                    </div>
                                    <p className="text-slate-700 font-medium">{update.loc}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-xs text-slate-500">{update.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeModule === 'wallet' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-brand-500" />
                                财务概览
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                                    <span className="text-slate-600">未结余额</span>
                                    <span className="text-xl font-bold text-slate-900">¥316,960.00</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                                    <span className="text-slate-600">信用额度</span>
                                    <span className="text-xl font-bold text-slate-900">¥700,000.00</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
                                    <div className="bg-brand-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                                <p className="text-xs text-slate-400 text-right">已用额度 45%</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-brand-500" />
                                最近文档
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { name: '发票_INV-2024-001.pdf', size: '1.2 MB', date: '2024-10-24' },
                                    { name: '装箱单_SH001.pdf', size: '845 KB', date: '2024-10-23' },
                                    { name: '提单_BL882.pdf', size: '2.4 MB', date: '2024-10-22' },
                                ].map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-red-50 text-red-500 rounded flex items-center justify-center">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700 group-hover:text-brand-600">{doc.name}</p>
                                                <p className="text-xs text-slate-400">{doc.size} • {doc.date}</p>
                                            </div>
                                        </div>
                                        <Download className="w-4 h-4 text-slate-400 group-hover:text-brand-500" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
