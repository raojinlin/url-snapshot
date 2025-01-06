import React from "react";

import { createFromIconfontCN } from '@ant-design/icons'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4534042_mi8spltn0z.js',
});


interface IconProps {
  type: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = (props: IconProps) => {
  const { type, className, style, onClick } = props;
  return <IconFont type={type} className={className} style={style} onClick={onClick} />
}

export default Icon;
