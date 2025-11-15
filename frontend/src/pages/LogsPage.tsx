import { FilterOutlined } from '@ant-design/icons';
import { Badge, Card, Select, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import type { LogEntry } from '../types';

const baseLogs: LogEntry[] = [
  {
    id: 'log-1',
    module: 'analysis',
    message: '任务 #A1023 完成，生成 3 条建议',
    severity: 'info',
    timestamp: '2025-03-15 10:24',
    owner: 'AI Agent',
  },
  {
    id: 'log-2',
    module: 'monitor',
    message: '站点 3021 连接延迟超限，已降级服务',
    severity: 'warning',
    timestamp: '2025-03-15 09:55',
    owner: '边缘网关',
  },
  {
    id: 'log-3',
    module: 'training',
    message: '最新 RAG 增量构建失败，请查看训练日志',
    severity: 'error',
    timestamp: '2025-03-15 09:32',
    owner: '训练编排',
  },
];

const severityColors: Record<LogEntry['severity'], string> = {
  info: 'blue',
  warning: 'orange',
  error: 'red',
};

export default function LogsPage() {
  const [severityFilter, setSeverityFilter] = useState<LogEntry['severity'] | 'all'>('all');

  const dataSource = useMemo(() => {
    if (severityFilter === 'all') return baseLogs;
    return baseLogs.filter((item) => item.severity === severityFilter);
  }, [severityFilter]);

  const columns: ColumnsType<LogEntry> = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 200,
    },
    {
      title: '来源模块',
      dataIndex: 'module',
      key: 'module',
      render: (value: string) => <Tag color="default">{value}</Tag>,
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: '级别',
      dataIndex: 'severity',
      key: 'severity',
      render: (value: LogEntry['severity']) => (
        <Badge color={severityColors[value]} text={value.toUpperCase()} />
      ),
    },
    {
      title: '责任主体',
      dataIndex: 'owner',
      key: 'owner',
    },
  ];

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        系统运行日志
      </Typography.Title>
      <Card
        bordered={false}
        style={{ borderRadius: 18 }}
        title="实时流日志"
        extra={
          <Space>
            <FilterOutlined />
            <Select
              size="small"
              value={severityFilter}
              style={{ width: 140 }}
              onChange={(value) => setSeverityFilter(value as LogEntry['severity'] | 'all')}
              options={[
                { value: 'all', label: '全部级别' },
                { value: 'info', label: 'Info' },
                { value: 'warning', label: 'Warning' },
                { value: 'error', label: 'Error' },
              ]}
            />
          </Space>
        }
      >
        <Table columns={columns} dataSource={dataSource} rowKey="id" pagination={false} />
      </Card>
    </Space>
  );
}
