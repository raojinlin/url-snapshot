import { snapshot, type SnapshotOption } from "../../services/snapshot";
import { Input, message, Image, Form, Checkbox, Select, Typography } from "antd";
import React from "react";
import Icon from "../Icon";
import devices from '../../emulateDevices.json';

interface SnapshotProps {
  defaultUrl?: string;
  demoSnapshotUrl?: string;
}

interface OptionsProps {
  value?: SnapshotOption;
  onChange?: (value: SnapshotOption) => void;
}

const Options: React.FC<OptionsProps> = ({ value, onChange }) => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = React.useState<SnapshotOption>({
    width: 1920,
    height: 1080,
    full: false,
  });

  const handleChange = React.useCallback((key: keyof SnapshotOption, value: number|boolean) => {
    if (onChange) {
      const newFormValues = {
        ...formValues,
        [key]: value,
      };
      setFormValues(newFormValues);
      onChange(newFormValues);
    }
  }, [onChange, formValues]);

  return (
    <div className="container py-2">
      <Form layout="inline" form={form} initialValues={formValues}>
        <Form.Item label='设备' name='device'>
          <Select
            className="min-w-72"
            options={devices.map(it => {
              return {
                label: `${it.title} (${it.screen.width}x${it.screen.height})`,
                value: [it.screen.width, it.screen.height, it.title].join(','),
              }
            })}
            onChange={(value) => {
              const [width, height, device] = value.split(',');
              form.setFieldValue('device', device);
              form.setFieldValue('width', Number(width));
              form.setFieldValue('height', Number(height));

              const newFormValues = {...formValues, device, width, height};
              setFormValues(newFormValues);
              onChange?.(newFormValues);
            }}
          />
        </Form.Item>

        <Form.Item label='屏幕宽度' name='width'>
          <Input
            placeholder="请输入屏幕宽度, 例如: 1920"
            style={{ width: 200 }}
            value={formValues.width}
            defaultValue={formValues.width}
            onChange={e => handleChange('width', Number(e.target.value))}
            type='number'
          />
        </Form.Item>
        <Form.Item label='屏幕高度' name='height'>
          <Input
            type='number'
            placeholder="请输入屏幕高度, 例如: 1080"
            value={formValues.height}
            onChange={e => handleChange('height', Number(e.target.value))}
            disabled={formValues?.full}
            style={{ width: 200 }}
          />
        </Form.Item>
        <Form.Item label='全屏' name='full'>
          <Checkbox checked={formValues?.full} onChange={e => handleChange('full', e.target.checked)} />
        </Form.Item>
      </Form>
    </div>
  )
}

const Snapshot: React.FC<SnapshotProps> = ({ defaultUrl, demoSnapshotUrl }) => {
  const [url, setUrl] = React.useState(defaultUrl);
  const [snapshotUrl, setSnapshotUrl] = React.useState(demoSnapshotUrl);
  const [snapshotOption, setSnapshotOption] = React.useState<SnapshotOption>({
    width: 1920,
    height: 1080,
    full: false,
  });
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
    snapshot(url, snapshotOption).then((snapshotUrl) => {
      setSnapshotUrl(snapshotUrl);
    }).finally(() => {
      setLoading(false);
    }).catch(err => {
      setSnapshotUrl('');
      message.error('截屏失败, 请重试');
    });
  }, [url, snapshotOption]);

  return (
    <div className="container">
      <div>
        <Input.Search
          value={url}
          onChange={(e) => setUrl(e.target.value.trim())}
          size="large"
          style={{ width: "100%" }}
          placeholder="请输入URL, 例如: https://www.baidu.com"
          enterButton={<Icon style={{ color: 'white', fontSize: 24 }} type="icon-snapshot2" />}
          loading={loading}
          onSearch={takeSnapshot}
        />
        <Typography.Text type="secondary">
          参数设置
        </Typography.Text>
        <Options value={snapshotOption} onChange={setSnapshotOption} />
      </div>
      <div className="flex mt-4">
        <div className="w-full overflow-auto" style={{ height: 500 }}>
          {snapshotUrl && <Image width={snapshotOption.width > 1000 ? '100%' : 'auto'} src={snapshotUrl} alt="snapshot" />}
        </div>
      </div>
    </div>
  );
}

export default Snapshot;
