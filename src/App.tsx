import React, { useState, useCallback, DragEvent } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Connection,
  Edge,
  Node,
  useReactFlow,
  Panel,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './components/Sidebar';
import { Hand, MousePointer } from 'lucide-react';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { project } = useReactFlow();
  const [selectionMode, setSelectionMode] = useState(false);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, nodes, setNodes]
  );

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      fitView
      selectionOnDrag={true}
      selectionMode={selectionMode ? 'partial' : 'full'}
      panOnDrag={!selectionMode}
      className={selectionMode ? 'selection-mode' : 'move-mode'}
      selectNodesOnDrag={selectionMode}
      selectionKeyCode={null}
    >
      <Background />
      <Controls />
      <Panel position="top-right">
        <button
          onClick={toggleSelectionMode}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          title={selectionMode ? "Switch to move mode" : "Switch to selection mode"}
        >
          {selectionMode ? <Hand size={20} /> : <MousePointer size={20} />}
        </button>
      </Panel>
    </ReactFlow>
  );
}

function App() {
  return (
    <div className="flex h-screen">
      <ReactFlowProvider>
        <Sidebar />
        <div className="flex-grow h-full">
          <Flow />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default App;