import React, { useState, useCallback, useRef } from 'react';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { Zoom } from '@visx/zoom';
import styled from 'styled-components';

const initialBubbles = [
  { id: 1, size: 20, data: 'Data 1', color: '#5c4baf', x: 150, y: 300, text: 'Bubble 1'},
  { id: 2, size: 30, data: 'Data 2', color: '#00715d', x: 200, y: 400, text: 'Bubble 2'},
  { id: 3, size: 40, data: 'Data 3', color: '#b2403f', x: 450, y: 350, text: 'Bubble 3'},
  { id: 4, size: 50, data: 'Data 4', color: '#a77b2d', x: 600, y: 250, text: 'Bubble 4'},
  { id: 5, size: 60, data: 'Data 5', color: '#4036a7', x: 750, y: 400, text: 'Bubble 5'}
];

const BubbleStyle = styled.circle`
  &:hover {
    cursor: pointer;
    r: ${props => props.r * 1.1};
  }
`;

const TextLabel = styled.text`
  font-size: 12px;
  fill: #fff;
  text-anchor: middle;
  pointer-events: none; // Ignore mouse events for text elements
`;

const BubbleChart = () => {
  const [bubbles, setBubbles] = useState(initialBubbles);
  const [currentBubble, setCurrentBubble] = useState(null);
  const zoomRef = useRef();

  const handleBubbleClick = useCallback((bubble) => {
    if (currentBubble && bubble.id === currentBubble.id) return;
    const newBubbles = bubbles.map(b => {
      return b.id === bubble.id ? { ...b, size: b.size * 1.5 } : { ...b, size: initialBubbles.find(ib => ib.id === b.id).size };
    });
    setBubbles(newBubbles);
    setCurrentBubble(bubble);
  }, [bubbles, currentBubble]);

  const handleSvgClick = useCallback((event) => {
    if (event.target.tagName === 'svg') {
      setBubbles(initialBubbles.map(b => ({ ...b })));
      setCurrentBubble(null);
    }
  }, []);

  const bubbleScale = scaleLinear({
    domain: [0, Math.max(...bubbles.map(b => b.size))],
    range: [10, 100],
  });

  return (
    <Zoom
      width={800}
      height={600}
      scaleXMin={0.5}
      scaleXMax={10}
      scaleYMin={0.5}
      scaleYMax={10}
      ref={zoomRef}
      wheelDelta={zoom => -zoom.deltaY * 0.01} // Adjust scrolling speed
    >
      {zoom => (
        <svg
          width={800}
          height={600}
          onWheel={zoom.handleWheel}
          onMouseDown={zoom.dragStart}
          onMouseMove={zoom.dragMove}
          onMouseUp={zoom.dragEnd}
          onMouseLeave={zoom.dragEnd}
          onClick={handleSvgClick}
        >
          <Group transform={zoom.toString()}>
            {bubbles.map(bubble => (
              <React.Fragment key={bubble.id}>
                <BubbleStyle
                  cx={bubble.x}
                  cy={bubble.y}
                  className='bubbles-style'
                  r={bubbleScale(bubble.size)}
                  fill={bubble.color}
                  onClick={(e) => {
                    e.stopPropagation();  // Prevent svg click event
                    handleBubbleClick(bubble);
                  }}
                />
                <TextLabel
                  x={bubble.x}
                  y={bubble.y}
                >
                  {bubble.text}
                </TextLabel>
              </React.Fragment>
            ))}
          </Group>
        </svg>
      )}
    </Zoom>
  );
};

export default BubbleChart;
