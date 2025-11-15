import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Flex, Space, Tag, Typography } from 'antd';

interface StatCardProps {
  title: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  caption?: string;
  accentColor?: string;
}

export default function StatCard({
  title,
  value,
  trend,
  trendLabel,
  caption,
  accentColor = '#0B63CE',
}: StatCardProps) {
  const isPositive = (trend ?? 0) >= 0;

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 18,
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
        background: '#fff',
      }}
    >
      <Flex vertical gap={16}>
        <Space align="center" style={{ justifyContent: 'space-between' }}>
          <Typography.Text type="secondary">{title}</Typography.Text>
          <Tag
            color={accentColor}
            style={{ borderRadius: 999, padding: '2px 12px', background: `${accentColor}15` }}
          >
            {caption ?? '实时'}
          </Tag>
        </Space>
        <Typography.Title level={2} style={{ margin: 0 }}>
          {value}
        </Typography.Title>
        {trend !== undefined && (
          <Space>
            {isPositive ? (
              <ArrowUpOutlined style={{ color: '#16a34a' }} />
            ) : (
              <ArrowDownOutlined style={{ color: '#dc2626' }} />
            )}
            <Typography.Text type={isPositive ? 'success' : 'danger'}>
              {Math.abs(trend)}% {trendLabel ?? '相较昨日'}
            </Typography.Text>
          </Space>
        )}
      </Flex>
    </Card>
  );
}
