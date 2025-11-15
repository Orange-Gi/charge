import { Layout, Typography } from 'antd';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarNav from './SidebarNav';
import TopBar from './TopBar';

const { Sider, Content } = Layout;

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={260}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        style={{
          position: 'sticky',
          left: 0,
          top: 0,
          bottom: 0,
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            padding: '20px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#fff',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #2AD1D2, #0B63CE)',
            }}
          />
          {!collapsed && (
            <div>
              <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
                Charge IQ
              </Typography.Title>
              <Typography.Text style={{ color: 'rgba(255,255,255,0.65)' }}>
                Enterprise Suite
              </Typography.Text>
            </div>
          )}
        </div>
        <SidebarNav collapsed={collapsed} />
      </Sider>
      <Layout>
        <TopBar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
        <Content
          style={{
            padding: '24px 32px',
            background: '#F5F8FB',
          }}
        >
          <div style={{ minHeight: 'calc(100vh - 160px)' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
