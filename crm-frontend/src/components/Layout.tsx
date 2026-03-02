import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Bell, 
  Search,
  ChevronRight,
  UserPlus,
  UserCheck,
  Crown,
  Ban,
  LifeBuoy,
  TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

interface LayoutProps {
  children: React.ReactNode;
}

type MenuItem = {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: { label: string; path: string }[];
};

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]); 

  const menuStructure: MenuItem[] = [
    { 
      label: '驾驶舱', 
      icon: LayoutDashboard, 
      path: '/' 
    },
    { 
      label: '线索', 
      icon: UserPlus,
      path: '/customer-profile?type=lead'
    },
    { 
      label: '潜在客户', 
      icon: UserCheck,
      path: '/customer-profile?type=potential'
    },
    { 
      label: '成交客户', 
      icon: Users,
      path: '/customer-profile?type=active'
    },
    { 
      label: '复购客户', 
      icon: Crown, 
      path: '/customer-profile?type=strategic'
    },
    { 
      label: '黑名单', 
      icon: Ban, 
      path: '/customer-profile?type=blacklist'
    },
    { 
      label: '业务配置', 
      icon: Settings, 
      path: '/settings' 
    },
    {
      label: '支持中心',
      icon: LifeBuoy,
      children: [
        { label: 'ODC审计', path: '/support/odc-audit' },
      ]
    }
  ];

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isPathActive = (path?: string) => {
    if (!path) return false;
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10 overflow-y-auto custom-scrollbar">
        <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0 sticky top-0 bg-white z-20">
          <img src={logo} alt="Didadi SRM" className="h-8 w-auto" />
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuStructure.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus.includes(item.label);
            const isActive = isPathActive(item.path) || (hasChildren && item.children?.some(child => isPathActive(child.path)));

            return (
              <div key={item.label}>
                <button
                  onClick={() => hasChildren ? toggleMenu(item.label) : navigate(item.path!)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group",
                    isActive && !hasChildren
                      ? "bg-brand-50 text-brand-600" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("w-5 h-5", isActive ? "text-brand-500" : "text-slate-400 group-hover:text-slate-500")} />
                    {item.label}
                  </div>
                  {hasChildren && (
                    <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform", isExpanded && "rotate-90")} />
                  )}
                </button>

                {hasChildren && isExpanded && (
                  <div className="ml-9 mt-1 space-y-0.5 border-l border-slate-100 pl-2">
                    {item.children?.map(child => {
                      const isChildActive = isPathActive(child.path);
                      return (
                        <button
                          key={child.path}
                          onClick={() => navigate(child.path)}
                          className={cn(
                            "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                            isChildActive
                              ? "text-brand-600 bg-brand-50/50 font-medium"
                              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                          )}
                        >
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xs">
              JD
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">John Doe</p>
              <p className="text-xs text-slate-500">采购经理</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-slate-500 text-sm">
              <span className="text-slate-900 font-bold text-lg">
                {/* Simple breadcrumb logic */}
                {menuStructure.find(m => 
                  m.path === location.pathname || 
                  m.children?.some(c => c.path === location.pathname)
                )?.label.split(' (')[0]}
              </span>
            </div>

            {/* Dashboard Stats Injection */}
            {location.pathname === '/' && (
              <div className="ml-6 flex items-center border border-slate-200 rounded-lg p-1.5 gap-4 bg-white shadow-sm">
                 <div className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600 self-stretch flex items-center">
                    经营看板
                 </div>
                 <div className="flex items-center gap-6">
                   <div className="flex flex-col items-start">
                      <p className="text-[10px] text-slate-400 leading-none mb-1">客户总数</p>
                      <div className="flex items-center gap-1.5 leading-none">
                         <span className="text-sm font-bold text-slate-900">1,280</span>
                         <span className="text-[10px] text-emerald-600 font-medium flex items-center bg-emerald-50 px-1 py-0.5 rounded">
                           <TrendingUp className="w-2 h-2 mr-0.5" /> +15
                         </span>
                      </div>
                   </div>
                   <div className="flex flex-col items-start">
                      <p className="text-[10px] text-slate-400 leading-none mb-1">本月销售额</p>
                      <div className="flex items-center gap-1.5 leading-none">
                         <span className="text-sm font-bold text-slate-900">¥12.5M</span>
                         <span className="text-[10px] text-emerald-600 font-medium flex items-center bg-emerald-50 px-1 py-0.5 rounded">
                           <TrendingUp className="w-2 h-2 mr-0.5" /> +8%
                         </span>
                      </div>
                   </div>
                   <div className="flex flex-col items-start">
                      <p className="text-[10px] text-slate-400 leading-none mb-1">客户满意度</p>
                      <div className="flex items-center gap-1.5 leading-none">
                         <span className="text-sm font-bold text-slate-900">98%</span>
                         <span className="text-[10px] text-emerald-600 font-medium flex items-center bg-emerald-50 px-1 py-0.5 rounded">
                           <TrendingUp className="w-2 h-2 mr-0.5" /> +1%
                         </span>
                      </div>
                   </div>
                   <div className="flex flex-col items-start">
                      <p className="text-[10px] text-slate-400 leading-none mb-1">平均成交周期</p>
                      <div className="flex items-center gap-1.5 leading-none">
                         <span className="text-sm font-bold text-slate-900">28<span className="text-[10px] font-normal text-slate-400 ml-0.5">天</span></span>
                      </div>
                   </div>
                 </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索供应商 / 资源..." 
                className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-full w-64 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
