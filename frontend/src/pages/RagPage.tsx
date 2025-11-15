import { BookOutlined, CloudSyncOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Card,
  Col,
  Input,
  List,
  Row,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import { useState } from 'react';
import { ragApi } from '../services/api';

interface DocChunk {
  id: string;
  title: string;
  source: string;
  snippet: string;
  score: number;
  tags: string[];
  updatedAt: string;
}

const seedDocs: DocChunk[] = [
  {
    id: '1',
    title: '站点功率协调策略 v2.1',
    source: 'knowledge/strategy.md',
    snippet: '在峰值负荷阶段，通过动态功率拆分提升 12% 并网效率……',
    score: 0.92,
    tags: ['策略', '峰值', '功率'],
    updatedAt: '2 小时前',
  },
  {
    id: '2',
    title: 'CAN 报文异常诊断手册',
    source: 'docs/can/troubleshooting.pdf',
    snippet: '报文 ID 0x18FF50E5 连续丢包可能意味着 BMS 内部晶振漂移……',
    score: 0.88,
    tags: ['CAN', '诊断', 'BMS'],
    updatedAt: '1 天前',
  },
];

export default function RagPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<DocChunk[]>(seedDocs);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await ragApi.search(query);
      const items = response.results ?? response.documents ?? [];
      if (items.length) {
        setDocuments(
          items.map((item: any, index: number) => ({
            id: item.id ?? `${Date.now()}-${index}`,
            title: item.title ?? `知识片段 ${index + 1}`,
            snippet: item.content ?? item.snippet ?? '暂无摘要',
            source: item.source ?? '知识库',
            score: item.score ?? 0.8,
            tags: item.tags ?? ['自动同步'],
            updatedAt: item.updated_at ?? '刚刚',
          }))
        );
      } else {
        message.info('未检索到相关知识，展示示例数据');
        setDocuments(seedDocs);
      }
    } catch (err) {
      console.error(err);
      message.error('检索失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        企业知识检索
      </Typography.Title>
      <Card
        bordered={false}
        style={{ borderRadius: 18 }}
        title="统一语义查询"
        extra={<Tag icon={<CloudSyncOutlined />} color="blue">已连接私有知识库</Tag>}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Input.Search
            size="large"
            placeholder="例如：如何处置 0x18FF50E5 报文抖动？"
            prefix={<SearchOutlined />}
            enterButton="检索"
            value={query}
            loading={loading}
            onChange={(e) => setQuery(e.target.value)}
            onSearch={handleSearch}
          />
          <Typography.Text type="secondary">
            支持自然语言、告警编号、设备序列号等多种输入；自动融合结构化/非结构化知识。
          </Typography.Text>
        </Space>
      </Card>
      <Row gutter={[24, 24]}>
        <Col lg={16} xs={24}>
          <Card
            title="相关知识片段"
            bordered={false}
            style={{ borderRadius: 18 }}
            extra={<Typography.Text type="secondary">按相关度排序</Typography.Text>}
          >
            <List
              itemLayout="vertical"
              dataSource={documents}
              renderItem={(doc) => (
                <List.Item
                  extra={
                    <Typography.Text strong style={{ fontSize: 18 }}>
                      {(doc.score * 100).toFixed(0)}%
                    </Typography.Text>
                  }
                >
                  <List.Item.Meta
                    avatar={<BookOutlined style={{ fontSize: 24, color: '#0B63CE' }} />}
                    title={
                      <Space size="small">
                        <Typography.Text strong>{doc.title}</Typography.Text>
                        <Tag>{doc.source}</Tag>
                      </Space>
                    }
                    description={
                      <Space split={<Typography.Text type="secondary">|</Typography.Text>}>
                        {doc.tags.map((tag) => (
                          <Tag color="blue" key={tag}>
                            {tag}
                          </Tag>
                        ))}
                      </Space>
                    }
                  />
                  <Typography.Paragraph>{doc.snippet}</Typography.Paragraph>
                  <Typography.Text type="secondary">{doc.updatedAt}</Typography.Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col lg={8} xs={24}>
          <Card title="上下文拼接预览" bordered={false} style={{ borderRadius: 18 }}>
            <Typography.Paragraph>
              1. 当前策略建议启用 “峰段削减 + 分段补偿” 联动方案。
            </Typography.Paragraph>
            <Typography.Paragraph>
              2. 监测到 BMS 报文 0x18FF50E5 的同步频率下降，需校验同步晶振。
            </Typography.Paragraph>
            <Typography.Paragraph>
              3. 可复用“苏南产业园”站点的调优参数，预计可提升 9% 调度效率。
            </Typography.Paragraph>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
