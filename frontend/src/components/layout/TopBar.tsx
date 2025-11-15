import {
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PoweroffOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Flex, Input, Space, Typography } from 'antd';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface TopBarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const routeNameMap: Record<string, string> = {
  '/dashboard': '业务总览',
  '/analysis': '智能分析',
  '/rag': '知识检索',
  '/logs': '运行日志',
  '/training': '训练编排',
};

export default function TopBar({ collapsed, onToggle }: TopBarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const title = useMemo(() => {
    const match = Object.entries(routeNameMap).find(([path]) => location.pathname.startsWith(path));
    return match?.[1] ?? '智能运营中心';
  }, [location.pathname]);

  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
        background: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 5,
      }}
    >
      <Space size="large" align="center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
        />
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            智能充电平台
          </Typography.Text>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
        </div>
      </Space>
      <Space size="large" align="center">
        <Input
          placeholder="搜索任务、用户、设备..."
          prefix={<SearchOutlined />}
          style={{ width: 280 }}
          allowClear
        />
        <Button type="text" icon={<BellOutlined />} />
        <Space size="small">
          <Avatar style={{ backgroundColor: '#0B63CE' }}>
            {user?.username?.[0]?.toUpperCase() ?? 'U'}
          </Avatar>
          <div>
            <Typography.Text strong>{user?.username ?? '未登录'}</Typography.Text>
            <Typography.Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
              {user?.role === 'admin' ? '系统管理员' : '业务用户'}
            </Typography.Text>
          </div>
        </Space>
        <Button icon={<PoweroffOutlined />} onClick={logout}>
          退出
        </Button>
      </Space>
    </Flex>
  );
}
