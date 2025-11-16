import { IdcardOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space, Typography, message } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: RegisterForm) => {
    setLoading(true);
    try {
      await authApi.register(values);
      message.success('注册成功，请登录');
      navigate('/login');
    } catch (error) {
      const msg = error instanceof Error ? error.message : '注册失败，请稍后重试';
      console.error(error);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, rgba(11,99,206,0.1) 0%, rgba(42,209,210,0.1) 100%)',
        padding: 24,
      }}
    >
      <Card
        style={{ maxWidth: 460, width: '100%', borderRadius: 20 }}
        title={
          <Space direction="vertical" size={0}>
            <Typography.Text type="secondary">智能充电管理平台</Typography.Text>
            <Typography.Title level={4} style={{ margin: 0 }}>
              创建企业账号
            </Typography.Title>
          </Space>
        }
      >
        <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<IdcardOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            label="企业邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="your.name@company.com" />
          </Form.Item>
          <Form.Item
            label="设置密码"
            name="password"
            rules={[{ required: true, message: '请设置密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="至少 8 位" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              注册
            </Button>
          </Form.Item>
          <Typography.Text type="secondary">
            已有账号？<Link to="/login">返回登录</Link>
          </Typography.Text>
        </Form>
      </Card>
    </div>
  );
}
