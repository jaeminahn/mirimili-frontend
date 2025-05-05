import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  onError?: () => void;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-red-500">
          <p className="text-xl">문제가 발생했습니다.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 text-white bg-red-500 rounded-xl"
          >
            닫기
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
