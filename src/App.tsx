import React from 'react';
import './App.css';
import Snapshot from './components/Snapshot';
import { Typography } from 'antd';

function App() {
  return (
    <div className="container mx-auto px-4">
      <div className='container mx-auto text-center py-14'>
        <Typography.Title>获取网站截屏</Typography.Title>
        <Typography.Text>简单、可扩展、可定制</Typography.Text>
      </div>
      <Snapshot demoSnapshotUrl='/demo.png' />
    </div>
  );
}

export default App;
