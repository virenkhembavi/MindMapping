import React, { useState, Fragment, useCallback } from 'react'

import localforage from 'localforage';

import ReactFlow, { removeElements, addEdge, Background, Controls, MiniMap } from 'react-flow-renderer';

const intialElements = [
    { id: '1', type: 'input', data: { label: 'Node' }, position: { x: 0, y: 0 }, animated: true }
]

const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView('')
}

function Main() {
    const [elements, setElements] = useState(intialElements);
    const [name, setName] = useState('');
    const [rfInstance, setRfInstance] = useState(null);

    const addNode = () => {
        setElements(e => e.concat({
            id: (e.length + 1).toString(),
            data: { label: `${name}` },
            position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
            animated: true
        }));
    };

    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            localforage.setItem(flowKey, flow);
        }
    }, [rfInstance]);

    const onRestore = useCallback(() => {
        const restoreFlow = async () => {
            const flow = await localforage.getItem(flowKey);

            if (flow) {
                const [x = 0, y = 0] = flow.position;
                setElements(flow.elements || []);
                transform({ x, y, zoom: flow.zoom || 0 });
            }
        };

        restoreFlow();
    }, [setElements]);

    const onConnect = (params) => setElements(e => addEdge(params, e));
    const onElementsRemove = (elementsToRemove) => setElements((e) => removeElements(elementsToRemove, e));
    return (
        <Fragment >

            <ReactFlow
                elements={elements}
                onLoad={onLoad}
                onConnect={onConnect}
                connectionLineStyle={{ stroke: "black", strokeWidth: 2 }}
                connectionLineType="SmoothStepEdge"
                snapToGrid={true}
                onElementsRemove={onElementsRemove}
                snapGrid={[16, 16]}
                style={{ width: '100vw', height: '95vh', color: 'black' }}

            >
                <Background
                    color="black"
                    gap={18}

                />
                <MiniMap
                    nodeColor={n => {
                        if (
                            n.type === 'input'
                        )
                            return ' yellow';
                        return ' blue';
                    }}
                />
                <Controls />

            </ReactFlow>

            <div>
                <input
                    style={{
                        padding: '2px',
                        height: '20px',
                        marginLeft: '10px',
                    }}
                    type="text"
                    name="title"
                    placeholder="add Node"
                    onChange={e => setName(e.target.value)} />

                <button
                    style={{
                        padding: '3px',
                        width: '60px',
                        marginLeft: '10px',
                        // backgroundColor: 'blue'
                    }}
                    type="button"
                    onClick={addNode}
                >Nodes</button>
                <button onClick={onSave}>save</button>
                <button onClick={onRestore}>restore</button>
                <button onClick={onAdd}>add node</button>
            </div>

        </Fragment>

    )
}

export default Main
