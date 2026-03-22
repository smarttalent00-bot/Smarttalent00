import { useState } from "react";

export default function Builder() {
  const [nodes, setNodes] = useState([]);

  const addNode = (type) => {
    setNodes([...nodes, { id: Date.now(), type }]);
  };

  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <div style={{ width: 200 }}>
        <h3>Blocks</h3>
        <button onClick={() => addNode("trigger")}>Trigger</button>
        <button onClick={() => addNode("reply")}>Reply</button>
        <button onClick={() => addNode("action")}>Action</button>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, border: "1px solid #ccc" }}>
        {nodes.map(node => (
          <div key={node.id} style={{
            padding: 10,
            margin: 10,
            border: "1px solid black"
          }}>
            {node.type}
          </div>
        ))}
      </div>
    </div>
  );
}
