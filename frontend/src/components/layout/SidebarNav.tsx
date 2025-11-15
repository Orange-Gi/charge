import {
  AppstoreOutlined,
  CloudSyncOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS: MenuProps['items'] = [
  {
    key: '/dashboard',
    icon: <AppstoreOutlined />,
    label: '仪表盘',
  },
  {
    key: '/analysis',
    icon: <ExperimentOutlined />,
    label: '智能分析',
  },
  {
    key: '/rag',
    icon: <CloudSyncOutlined />,
    label: '知识检索',
  },
  {
    key: '/logs',
    icon: <DatabaseOutlined />,
    label: '运行日志',
  },
  {
    key: '/training',
    icon: <DeploymentUnitOutlined />,
    label: '训练编排',
  },
];

interface SidebarNavProps {
  collapsed: boolean;
}

export default function SidebarNav({ collapsed }: SidebarNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey = useMemo(() => {
    const match = NAV_ITEMS?.find((item) => {
      if (!item || typeof item === 'string') return false;
      return location.pathname.startsWith(item.key as string);
    });
    return (match && typeof match !== 'string' ? match.key : '/dashboard') as string;
  }, [location.pathname]);

  return (
    <Menu
      mode="inline"
      theme="dark"
      selectable
      style={{ borderInlineEnd: 'none' }}
      items={NAV_ITEMS}
      selectedKeys={[selectedKey]}
      onClick={(info) => navigate(info.key)}
      inlineCollapsed={collapsed}
    />
  );
}
