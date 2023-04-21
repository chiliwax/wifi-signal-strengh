import React, { createContext, useCallback, useMemo, useState } from 'react';

type LogContextType = {
  addLog: (data: string) => void;
  logs: Array<string>;
};

export const LogContext = createContext({} as LogContextType);

export const LogProvider: React.FC<{children: React.ReactNode}> = (props) => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((data: string) => {
    setLogs([...logs, data]);
  }, [logs]);

  const _logs = useMemo(() => logs, [logs])

  const contextValue: LogContextType = {
    addLog: addLog,
    logs: _logs,
  }

  return (
    <LogContext.Provider value={contextValue}>
      {props.children}
    </LogContext.Provider>
  );
};
