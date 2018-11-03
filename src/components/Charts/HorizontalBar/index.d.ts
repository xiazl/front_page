import * as React from 'react';
export interface IHorizontalBarProps {
  title: React.ReactNode;
  color?: string;
  padding?: [number, number, number, number];
  height: number;
  data: Array<{
    x: string;
    y: number;
  }>;
  autoLabel?: boolean;
  style?: React.CSSProperties;
  relation: Object;
}

export default class Bar extends React.Component<IHorizontalBarProps, any> {}
