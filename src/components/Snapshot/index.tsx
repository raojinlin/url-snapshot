import { snapshot } from "../../services/snapshot";
import { Input, message, Image } from "antd";
import React from "react";

interface SnapshotProps {
  defaultUrl?: string;
  demoSnapshotUrl?: string;
}

const Snapshot: React.FC<SnapshotProps> = ({ defaultUrl, demoSnapshotUrl }) => {
  const [url, setUrl] = React.useState(defaultUrl);
  const [snapshotUrl, setSnapshotUrl] = React.useState(demoSnapshotUrl);
  const [loading, setLoading] = React.useState(false);

  const takeSnapshot = React.useCallback(() => {
    if (!url) {
      message.warning('请输入URL')
      return;
    }

    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new Error('非法URL');
      }
    } catch (e) {
      message.error('非法URL');
      return;
    }

    setLoading(true);
    snapshot(url).then((snapshotUrl) => {
      setSnapshotUrl(snapshotUrl);
    }).finally(() => {
      setLoading(false);
    }).catch(err => {
      setSnapshotUrl('');
      message.error('截屏失败, 请重试');
    });
  }, [url]);

  return (
    <div className="container">
      <div>
        <Input.Search
          value={url}
          onChange={(e) => setUrl(e.target.value.trim())}
          size="large"
          style={{ width: "100%" }}
          placeholder="请输入URL, 例如: https://www.baidu.com"
          enterButton='截屏'
          loading={loading}
          onSearch={takeSnapshot}
        />
      </div>
      <div className="flex mt-4">
        <div className="w-full overflow-auto" style={{height: 300}}>
          {snapshotUrl && <Image width='100%' src={snapshotUrl} alt="snapshot" />}
        </div>
      </div>
    </div>
  );
}


export default Snapshot;
