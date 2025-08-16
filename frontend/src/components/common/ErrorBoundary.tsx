import React from 'react';

export class ErrorBoundary extends React.Component<{children: React.ReactNode}, {error?: Error}> {
  state: { error?: Error } = {};
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 16, color: '#b00020' }}>
          グラフ描画で問題が発生しました（再読み込みしてください）。開発者向け情報はコンソールを参照。
        </div>
      );
    }
    return this.props.children;
  }
}
