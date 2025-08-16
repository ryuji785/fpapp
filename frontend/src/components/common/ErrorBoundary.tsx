import React from 'react';

export class ErrorBoundary extends React.Component<{children: React.ReactNode}, {error?: Error}> {
  state: { error?: Error } = {};
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return <div style={{padding:16, color:'#b00020'}}>グラフの描画で問題が発生しました。</div>;
    }
    return this.props.children;
  }
}
