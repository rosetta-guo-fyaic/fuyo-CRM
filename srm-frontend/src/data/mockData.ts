
export interface Customer {
  id: string;
  name: string;
  code: string;
  tier: 'strategic' | 'core' | 'backup' | 'probation' | 'lead' | 'blacklisted';
  status: 'active' | 'inactive' | 'blacklisted';
  financial: {
    interval: string;
    anchor: string;
    period: number; // days
  };
  // Replaced performanceConfig with quotation preferences or similar if needed, 
  // but for now keeping it simple or removing.
  
  // Extended fields for Customer Profile
  healthScore?: number; // Renamed from systemScore
  healthStatus?: string; // Custom status for Lead (e.g. '未触达', '待响应')
  address?: string;
  contactPhone?: string;
  website?: string;
  structure?: string;
  opsGuide?: {
    cutoffTime: string;
    bookingReq: string;
    prohibitions: string;
  };
  quotations?: {
    id: string; // 询价编号
    transportMode: string; // 运输方式
    businessType: string; // 业务类型
    origin: string; // 起运地
    destination: string; // 目的地
    price: string; // 报价
    containerType: string; // 装载型号
    totalVolume: string; // 总体积CBM
    totalWeight: string; // 总重量 KG
    inquirer: string; // 询价人
    inquiryTime: string; // 询价时间
    status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
    remarks?: string;
  }[];
  scarceResources?: string[];
  tags?: string[];
  portalAccess: {
    quotationHub: boolean;
    orderCommand: boolean;
    walletDocs: boolean;
  };
  businessLines?: {
    type: string; // e.g. '海运', '空运', '铁路', '卡车', '报关清关'
    description?: string; // Optional tagline
    carriers?: string[]; // e.g. ['Matson', 'COSCO']
    routes?: string[]; // e.g. ['North America', 'Europe']
    contact: {
      name: string;
      title?: string;
      phone?: string;
      email?: string;
    };
  }[];
}

export const CUSTOMERS: Customer[] = [
  {
    id: 'CUST-2024-001',
    name: '泰科全球电子',
    code: 'C-TGE-SH',
    tier: 'strategic',
    status: 'active',
    address: '上海市浦东新区张江高科园区科苑路88号',
    contactPhone: '+86 21 5080 xxxx',
    website: 'www.techglobal.com',
    structure: 'TechGlobal Inc. 中国区总部，负责亚太地区采购与物流分拨。',
    financial: {
      interval: 'monthly',
      anchor: 'etd',
      period: 30
    },
    healthScore: 92,
    opsGuide: {
      cutoffTime: 'ETD-2 16:00 (截单时间)',
      bookingReq: '需提供完整装箱单与发票，HS Code 必填',
      prohibitions: '严格遵守锂电池运输规范'
    },
    quotations: [
      {
        id: 'Q-20240201-01',
        transportMode: '空运',
        businessType: '出口',
        origin: '上海 (PVG)',
        destination: '洛杉矶 (LAX)',
        price: '$3.50/kg',
        containerType: '散货',
        totalVolume: '2.5 CBM',
        totalWeight: '1000 KG',
        inquirer: '王建国',
        inquiryTime: '2024-02-01 10:30',
        status: 'accepted',
        remarks: '已确认航司舱位'
      },
      {
        id: 'Q-20240115-02',
        transportMode: '海运',
        businessType: '进口',
        origin: '汉堡 (HAM)',
        destination: '深圳 (SZX)',
        price: '$1200/TEU',
        containerType: '20GP x 2',
        totalVolume: '56 CBM',
        totalWeight: '18000 KG',
        inquirer: '李爱丽',
        inquiryTime: '2024-01-15 14:20',
        status: 'expired',
        remarks: '费率已过期'
      },
      {
        id: 'Q-20240310-03',
        transportMode: '海运',
        businessType: '转口',
        origin: '越南 (SGN)',
        destination: '长滩 (LGB)',
        price: '$3200/FEU',
        containerType: '40HQ x 5',
        totalVolume: '340 CBM',
        totalWeight: '65000 KG',
        inquirer: '陈迈克',
        inquiryTime: '2024-03-10 09:15',
        status: 'sent',
        remarks: '等待客户确认'
      }
    ],
    scarceResources: [],
    tags: ['高科技', '重点客户'],
    portalAccess: {
      quotationHub: true,
      orderCommand: true,
      walletDocs: true
    },
    businessLines: [
      {
        type: '空运出口',
        description: '高价值电子产品',
        routes: ['CN-US', 'CN-EU'],
        contact: {
          name: 'Sarah Chen',
          title: '物流经理',
          email: 'sarah.chen@techglobal.com'
        }
      },
      {
        type: '海运出口',
        description: '定期补货',
        carriers: ['Matson', 'COSCO'],
        contact: {
          name: 'David Wang',
          title: '供应链总监',
          email: 'david.wang@techglobal.com'
        }
      }
    ]
  },
  {
    id: 'LEAD-2024-001',
    name: '新世代物流',
    code: 'L-NGL-SZ',
    tier: 'lead',
    status: 'active',
    address: '深圳市南山区科技园',
    contactPhone: '+86 755 8888 9999',
    website: 'www.nextgen-log.com',
    structure: '初创电商物流平台，专注东南亚市场',
    financial: { interval: 'net30', anchor: 'etd', period: 30 },
    healthScore: 0, // 0 usually means N/A or special status
    opsGuide: { cutoffTime: '', bookingReq: '', prohibitions: '' },
    quotations: [],
    scarceResources: [],
    tags: ['电商', '东南亚'],
    portalAccess: { quotationHub: false, orderCommand: false, walletDocs: false },
    businessLines: [],
    healthStatus: '未触达' // Custom field for Lead
  },
  {
    id: 'LEAD-2024-002',
    name: '全球贸易伙伴',
    code: 'L-GTP-NB',
    tier: 'lead',
    status: 'active',
    address: '宁波市鄞州区南部商务区',
    contactPhone: '+86 574 2222 3333',
    website: 'www.gtp-ningbo.com',
    structure: '传统外贸转型跨境电商',
    financial: { interval: 'net30', anchor: 'etd', period: 30 },
    healthScore: 1, 
    opsGuide: { cutoffTime: '', bookingReq: '', prohibitions: '' },
    quotations: [],
    scarceResources: [],
    tags: ['转型期', '欧美线'],
    portalAccess: { quotationHub: false, orderCommand: false, walletDocs: false },
    businessLines: [],
    healthStatus: '待响应' // Custom field for Lead
  }
];

export const DICTIONARIES = {
  tiers: [
    { id: 'strategic', label: '复购客户', level: 1, color: 'bg-purple-100 text-purple-800' },
    { id: 'core', label: '成交客户', level: 2, color: 'bg-blue-100 text-blue-800' },
    { id: 'backup', label: '成交-储备', level: 3, color: 'bg-slate-100 text-slate-800' },
    { id: 'probation', label: '潜在客户', level: 4, color: 'bg-amber-100 text-amber-800' },
    { id: 'lead', label: '线索', level: 5, color: 'bg-slate-100 text-slate-800' },
    { id: 'blacklisted', label: '流失', level: 6, color: 'bg-red-100 text-red-800' }
  ],
  intervals: [
    { id: 'monthly', label: '月结' },
    { id: 'quarterly', label: '季结' },
    { id: 'net30', label: 'Net 30' },
    { id: 'net60', label: 'Net 60' }
  ],
  anchors: [
    { id: 'etd', label: '预计离港' },
    { id: 'eta', label: '预计到港' },
    { id: 'atd', label: '实际离港' },
    { id: 'ata', label: '实际到港' }
  ]
};

// Aliases for backward compatibility
export const SUPPLIERS = CUSTOMERS;
export type Supplier = Customer;
