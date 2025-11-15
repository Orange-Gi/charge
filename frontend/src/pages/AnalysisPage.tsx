import {
  BulbOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  ScheduleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Card,
  Col,
  Divider,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd';
import type { UploadProps } from 'antd';
import { useMemo } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';

const recommendationIcons = [<BulbOutlined />, <ThunderboltOutlined />, <ScheduleOutlined />];

export default function AnalysisPage() {
  const { startAnalysis, loading, progress, result, thinking, error } = useAnalysis();

  const uploadProps: UploadProps = {
    multiple: false,
    maxCount: 1,
    beforeUpload: async (file) => {
      try {
        await startAnalysis(file);
        message.success('分析任务已创建');
      } catch (err) {
        message.error(err instanceof Error ? err.message : '分析启动失败');
      }
      return Upload.LIST_IGNORE;
    },
  };

  const metrics = useMemo(() => {
    if (!result) return [];
    return [
      { title: '效率指数', value: `${result.metrics.efficiency}%`, status: '优' },
      { title: '可靠性', value: `${result.metrics.reliability}%`, status: '稳' },
      { title: '安全评分', value: `${result.metrics.safety}%`, status: '良' },
    ];
  }, [result]);

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        智能分析工作台
      </Typography.Title>
      <Row gutter={[24, 24]}>
        <Col xl={10} xs={24}>
          <Card title="上传 CAN / 运行日志" bordered={false} style={{ borderRadius: 18 }}>
            <Upload.Dragger {...uploadProps} disabled={loading} style={{ padding: '24px 0' }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域</p>
              <p className="ant-upload-hint">支持 CSV、Parquet、JSON、日志压缩包等格式</p>
            </Upload.Dragger>
            <Divider />
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <div>
                <Typography.Text type="secondary">平均耗时</Typography.Text>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  2 分 48 秒
                </Typography.Title>
              </div>
              <Statistic title="今日任务" value={17} suffix="/ 40" />
            </Space>
          </Card>
        </Col>
        <Col xl={14} xs={24}>
          <Card
            title="分析进度"
            bordered={false}
            extra={
              <Tag color={loading ? 'processing' : 'success'}>
                {loading ? '运行中' : progress >= 100 ? '完成' : '就绪'}
              </Tag>
            }
            style={{ borderRadius: 18 }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Progress percent={Math.round(progress)} status={loading ? 'active' : 'normal'} />
              {thinking && (
                <Alert
                  type="info"
                  showIcon
                  message="分析思考"
                  description={<Typography.Paragraph>{thinking}</Typography.Paragraph>}
                />
              )}
              {error && (
                <Alert
                  type="error"
                  showIcon
                  message="任务失败"
                  description={error}
                />
              )}
            </Space>
          </Card>
        </Col>
      </Row>
      <Card
        title="AI 深度洞察"
        bordered={false}
        style={{ borderRadius: 18 }}
        extra={<Tag color="blue">{result ? `任务 ${result.taskId}` : '等待任务'}</Tag>}
      >
        {result ? (
          <Row gutter={[24, 24]}>
            <Col lg={10} xs={24}>
              <Typography.Title level={4}>{result.summary}</Typography.Title>
              <List
                itemLayout="horizontal"
                dataSource={result.recommendations}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={recommendationIcons[index % recommendationIcons.length]}
                      title={`建议 ${index + 1}`}
                      description={item}
                    />
                  </List.Item>
                )}
              />
            </Col>
            <Col lg={14} xs={24}>
              <Row gutter={[16, 16]}>
                {metrics.map((metric) => (
                  <Col sm={8} xs={24} key={metric.title}>
                    <Card
                      bordered={false}
                      style={{
                        borderRadius: 16,
                        background: 'linear-gradient(145deg, #EEF2FF, #FFFFFF)',
                      }}
                    >
                      <Typography.Text type="secondary">{metric.title}</Typography.Text>
                      <Typography.Title level={3}>{metric.value}</Typography.Title>
                      <Tag color="success">{metric.status}</Tag>
                    </Card>
                  </Col>
                ))}
              </Row>
              <Divider />
              <Typography.Text strong>节点时序</Typography.Text>
              <Row gutter={[12, 12]}>
                {result.timeline?.map((item) => (
                  <Col span={12} key={item.label}>
                    <Card size="small" bordered={false} style={{ borderRadius: 12 }}>
                      <Typography.Text type="secondary">{item.label}</Typography.Text>
                      <Typography.Title level={4} style={{ margin: 0 }}>
                        {item.value}
                      </Typography.Title>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        ) : (
          <Space
            direction="vertical"
            align="center"
            style={{ width: '100%', padding: '60px 0' }}
            size="large"
          >
            <CheckCircleOutlined style={{ fontSize: 48, color: '#d4d4d8' }} />
            <Typography.Text type="secondary">
              上传文件并启动任务后，这里会展示 AI 的详细诊断与建议
            </Typography.Text>
          </Space>
        )}
      </Card>
    </Space>
  );
}
