import { ClusterOutlined, ExperimentOutlined, SyncOutlined } from '@ant-design/icons';
import { Card, Col, List, Progress, Row, Space, Steps, Tag, Typography } from 'antd';
import type { TrainingJob } from '../types';

const jobs: TrainingJob[] = [
  {
    id: 'train-1',
    name: 'RAG 嵌入模型 v3.2',
    owner: '刘伟',
    progress: 68,
    status: 'running',
    updatedAt: '10 分钟前',
  },
  {
    id: 'train-2',
    name: '充电策略强化学习 batch#42',
    owner: '系统',
    progress: 95,
    status: 'queued',
    updatedAt: '25 分钟前',
  },
  {
    id: 'train-3',
    name: '边缘检测模型蒸馏',
    owner: '王琳',
    progress: 32,
    status: 'running',
    updatedAt: '1 小时前',
  },
];

const pipelineSteps = [
  { title: '数据校验', status: 'finish' },
  { title: '向量化', status: 'process' },
  { title: '召回评估', status: 'wait' },
  { title: '上线审批', status: 'wait' },
];

export default function TrainingPage() {
  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        训练与编排中心
      </Typography.Title>
      <Row gutter={[24, 24]}>
        <Col lg={16} xs={24}>
          <Card
            title="训练任务队列"
            bordered={false}
            style={{ borderRadius: 18 }}
            extra={<Tag color="blue">GPU 集群占用 62%</Tag>}
          >
            <List
              dataSource={jobs}
              renderItem={(job) => (
                <List.Item
                  actions={[
                    <Tag color={job.status === 'running' ? 'green' : job.status === 'queued' ? 'gold' : 'blue'}>
                      {job.status === 'running'
                        ? '执行中'
                        : job.status === 'queued'
                        ? '排队'
                        : '完成'}
                    </Tag>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<ExperimentOutlined style={{ fontSize: 24, color: '#0B63CE' }} />}
                    title={
                      <Space split={<Typography.Text type="secondary">|</Typography.Text>}>
                        <Typography.Text strong>{job.name}</Typography.Text>
                        <Typography.Text type="secondary">{job.owner}</Typography.Text>
                      </Space>
                    }
                    description={<Typography.Text type="secondary">{job.updatedAt}</Typography.Text>}
                  />
                  <div style={{ minWidth: 200 }}>
                    <Progress percent={job.progress} size="small" status="active" />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col lg={8} xs={24}>
          <Card
            title="RAG 流水线状态"
            bordered={false}
            style={{ borderRadius: 18 }}
            extra={<SyncOutlined spin />}
          >
            <Steps
              direction="vertical"
              current={1}
              items={pipelineSteps.map((step) => ({
                title: step.title,
                status: step.status as 'finish' | 'process' | 'wait',
              }))}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col lg={12} xs={24}>
          <Card
            title="集群资源"
            bordered={false}
            style={{ borderRadius: 18 }}
            extra={<ClusterOutlined />}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card bordered={false} style={{ borderRadius: 16, background: '#EFF6FF' }}>
                  <Typography.Text type="secondary">GPU 占用</Typography.Text>
                  <Typography.Title level={3}>62%</Typography.Title>
                  <Progress percent={62} strokeColor="#0B63CE" />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false} style={{ borderRadius: 16, background: '#F5F3FF' }}>
                  <Typography.Text type="secondary">存储使用</Typography.Text>
                  <Typography.Title level={3}>48 TB</Typography.Title>
                  <Progress percent={48} strokeColor="#8B5CF6" />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col lg={12} xs={24}>
          <Card
            title="上线窗口"
            bordered={false}
            style={{ borderRadius: 18 }}
          >
            <Typography.Paragraph>
              <strong>今晚 23:00 - 01:00</strong> 为推荐上线窗口，建议完成模型验证并提交审批。
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary">
              - 华东站群即将切换夏季策略，需同步最新策略模型。<br />
              - RAG 知识库每 4 小时滚动更新，根据实际负载自动调度。
            </Typography.Paragraph>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
