import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { BankOutlined, AppstoreOutlined, BuildOutlined, UserOutlined } from '@ant-design/icons';
import { getCompaniesApi } from '../../api/companyApi';
import { getJobsApi } from '../../api/jobApi';
import { getSkillsApi } from '../../api/skillApi';

function DashboardPage() {
    const userString = localStorage.getItem('user');
    const user = userString && userString !== 'undefined' ? JSON.parse(userString) : null;

    const [stats, setStats] = useState({
        companies: 0,
        jobs: 0,
        skills: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch just 1 item to get the 'total' from metadata
                const [compRes, jobRes, skillRes] = await Promise.all([
                    getCompaniesApi(1, 1),
                    getJobsApi(1, 1),
                    getSkillsApi(1, 1)
                ]);

                setStats({
                    companies: compRes?.data?.data?.meta?.total || 0,
                    jobs: jobRes?.data?.data?.meta?.total || 0,
                    skills: skillRes?.data?.data?.meta?.total || 0
                });
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px' }}>
                    Welcome back, {user?.name || 'Admin'}! 👋
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
                    Here is what's happening with your platform today.
                </p>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={8}>
                    <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Statistic
                            title={<span style={{ fontSize: '16px', fontWeight: 500 }}>Total Companies</span>}
                            value={stats.companies}
                            valueStyle={{ color: '#3f8600', fontSize: '32px', fontWeight: 700 }}
                            prefix={<BankOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Statistic
                            title={<span style={{ fontSize: '16px', fontWeight: 500 }}>Active Jobs</span>}
                            value={stats.jobs}
                            valueStyle={{ color: '#1890ff', fontSize: '32px', fontWeight: 700 }}
                            prefix={<AppstoreOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Statistic
                            title={<span style={{ fontSize: '16px', fontWeight: 500 }}>Available Skills</span>}
                            value={stats.skills}
                            valueStyle={{ color: '#cf1322', fontSize: '32px', fontWeight: 700 }}
                            prefix={<BuildOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default DashboardPage;