import React, { useState } from 'react';
import { Tabs } from 'antd';
import TechnicianRegistration from './TechnicianRegistration';
import TechnicianTable from './TechnicianTable';
import { UnorderedListOutlined, UserAddOutlined } from '@ant-design/icons';

const TechnicianManagement = () => {

    const [activeTab, setActiveTab] = useState('list');

  const items = [
    {
      key: 'new',
      label: 'Teknisyen Oluştur',
      children: <TechnicianRegistration labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} setActiveTab={setActiveTab} />,
      icon: <UserAddOutlined style={{ fontSize: '18px' }} />
    },
    {
      key: 'list',
      label: 'Teknisyenler Listesi',
      children: <TechnicianTable activeTab={activeTab}/>,
      icon: <UnorderedListOutlined style={{ fontSize: '18px' }} />
    }
  ];

  return (
    <Tabs 
      activeKey={activeTab}
      onChange={(key) => setActiveTab(key)}
      items={items} 
      tabBarGutter={25}
      centered
      defaultActiveKey="list"
    />
  );
};


export default TechnicianManagement