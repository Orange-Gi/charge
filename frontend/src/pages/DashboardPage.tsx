import {
  AlertOutlined,
  CheckCircleTwoTone,
  FieldTimeOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Card,
  Col,
  List,
  Progress,
  Row,
  Space,
  Table,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from '../components/common/StatCard';

const statConfig = [
  { title: '当日充电量', value: '126.4 MWh', trend: 8.2, caption: '实时' },
  { title: '站点可用率', value: '97.3%', trend: 1.6, caption: '全网', accentColor: '#2AD1D2' },
  { title: '告警处理时效', value: '12 min', trend: -3.5, caption: '均值', accentColor: '#FFB020' },
  { title: 'AI 建议采纳率', value: '72%', trend: 4.4, caption: '周累计', accentColor: '#8B5CF6' },
];

const energyTrend = [
  { label: '周一', output: 112, efficiency: 91 },
  { label: '周二', output: 134, efficiency: 92 },
  { label: '周三', output: 142, efficiency: 95 },
  { label: '周四', output: 138, efficiency: 93 },
  { label: '周五', output: 155, efficiency: 96 },
  { label: '周六', output: 160, efficiency: 94 },
  { label: '周日', output: 149, efficiency: 95 },
];

const taskColumns = [
  { title: '任务', dataIndex: 'name', key: 'name' },
  { title: '责任人', dataIndex: 'owner', key: 'owner' },
  {
    title: '进度',
    dataIndex: 'progress',
    key: 'progress',
    render: (value: number) => <Progress percent={value} size="small" />,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (value: string) => (
      <Tag color={value === 'on-track' ? 'green' : value === 'risk' ? 'orange' : 'blue'}>
        {value === 'on-track' ? '正常' : value === 'risk' ? '关注' : '已完成'}
      </Tag>
    ),
  },
];

const taskData = [
  { key: 1, name: '华北站群功率优化', owner: '李晨', progress: 76, status: 'on-track' },
  { key: 2, name: '西南新站点联调', owner: '张璐', progress: 42, status: 'risk' },
  { key: 3, name: '算法版本 2.3 灰度', owner: '赵明', progress: 100, status: 'done' },
];

const actions = [
  {
    title: '站点 1023 电流波动超阈值，已切换至备份策略',
    time: '08:42',
    type: '告警',
    icon: <AlertOutlined style={{ color: '#FF6B6B' }} />,
  },
  {
    title: 'AI 建议对 4 个站点执行削峰控制，待确认',
    time: '09:15',
    type: '建议',
    icon: <ThunderboltOutlined style={{ color: '#0B63CE' }} />,
  },
  {
    title: '苏州-产业园区站点能效巡检完成',
    time: '10:20',
    type: '任务',
    icon: <CheckCircleTwoTone twoToneColor="#22C55E" />,
  },
];

const timelineData = [
  { color: 'green', label: '06:30', children: '夜间充电策略切换完成' },
  { color: 'blue', label: '08:10', children: 'RAG 知识库增量同步成功' },
  { color: 'orange', label: '09:35', children: '检测到 SOC 偏差，AI 自动重标定' },
];

export default function DashboardPage() {
  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        企业运营驾驶舱
      </Typography.Title>
      <Row gutter={[24, 24]}>
        {statConfig.map((item) => (
          <Col xl={6} lg={12} xs={24} key={item.title}>
            <StatCard {...item} />
          </Col>
        ))}
      </Row>
      <Row gutter={[24, 24]}>
        <Col xl={16} xs={24}>
          <Card
            title="站群功率输出与效率"
            extra={<Tag color="blue">实时监控</Tag>}
            style={{ borderRadius: 18 }}
          >
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={energyTrend}>
                <defs>
                  <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B63CE" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#0B63CE" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="output"
                  stroke="#0B63CE"
                  fillOpacity={1}
                  fill="url(#colorOutput)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xl={8} xs={24}>
          <Card
            title="异常与自动处置"
            extra={<Tag color="geekblue">AI 实时守护</Tag>}
            style={{ borderRadius: 18 }}
          >
            <List
              itemLayout="horizontal"
              dataSource={actions}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge
                        count={item.type}
                        style={{ backgroundColor: '#0B63CE' }}
                        offset={[-8, 0]}
                      >
                        {item.icon}
                      </Badge>
                    }
                    title={item.title}
                    description={<Typography.Text type="secondary">{item.time}</Typography.Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xl={14} xs={24}>
          <Card
            title="关键任务追踪"
            extra={
              <Space>
                <FieldTimeOutlined />
                <Typography.Text type="secondary">近 24 小时</Typography.Text>
              </Space>
            }
            style={{ borderRadius: 18 }}
          >
            <Table columns={taskColumns} dataSource={taskData} pagination={false} />
          </Card>
        </Col>
        <Col xl={10} xs={24}>
          <Card title="运营时间轴" style={{ borderRadius: 18 }}>
            <Timeline
              items={timelineData.map((item) => ({
                color: item.color,
                label: item.label,
                children: item.children,
              }))}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
