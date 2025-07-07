import { useState, useRef, useEffect, ReactNode } from "react";

const TransformOriginDebugger = ({
  children,
  elementWidth = 120,
  elementHeight = 80,
  showOriginal = true,
}: {
  children?: ReactNode;
  elementWidth?: number;
  elementHeight?: number;
  showOriginal?: boolean;
}) => {
  const [originX, setOriginX] = useState(50);
  const [originY, setOriginY] = useState(50);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const elementRef = useRef<any>(null);
  const containerRef = useRef<any>(null);

  const transformOrigin = `${originX}% ${originY}%`;
  const transform = `rotate(${rotation}deg) scale(${scale})`;

  // Calculate the actual pixel position of the transform origin
  const getOriginPosition = () => {
    if (!elementRef.current || !containerRef.current) return { x: 0, y: 0 };

    const rect = elementRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    return {
      x: rect.left - containerRect.left + (rect.width * originX) / 100,
      y: rect.top - containerRect.top + (rect.height * originY) / 100,
    };
  };

  const [originPosition, setOriginPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateOriginPosition = () => {
      setOriginPosition(getOriginPosition());
    };

    updateOriginPosition();
    window.addEventListener("resize", updateOriginPosition);

    return () => window.removeEventListener("resize", updateOriginPosition);
  }, [originX, originY, rotation, scale]);

  const handleMouseMove = (e: any) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setOriginX(Math.max(0, Math.min(100, x)));
    setOriginY(Math.max(0, Math.min(100, y)));
  };

  const presets = [
    { name: "Center", x: 50, y: 50 },
    { name: "Top Left", x: 0, y: 0 },
    { name: "Top Right", x: 100, y: 0 },
    { name: "Bottom Left", x: 0, y: 100 },
    { name: "Bottom Right", x: 100, y: 100 },
    { name: "Top Center", x: 50, y: 0 },
    { name: "Bottom Center", x: 50, y: 100 },
    { name: "Left Center", x: 0, y: 50 },
    { name: "Right Center", x: 100, y: 50 },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Transform Origin Debugger
        </h1>
        <p className="text-gray-600">
          Interactive tool to visualize and debug CSS transform-origin values
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-800 mb-3">
              Transform Origin
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  X Position: {originX.toFixed(1)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={originX}
                  onChange={(e) => setOriginX(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Y Position: {originY.toFixed(1)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={originY}
                  onChange={(e) => setOriginY(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Presets</h4>
              <div className="grid grid-cols-3 gap-1">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setOriginX(preset.x);
                      setOriginY(preset.y);
                    }}
                    className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-800 mb-3">
              Transform Properties
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rotation: {rotation}°
                </label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scale: {scale}x
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Show grid</span>
              </label>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-800 mb-3">CSS Output</h3>
            <div className="bg-gray-100 p-3 rounded font-mono text-sm">
              <div>transform-origin: {transformOrigin};</div>
              <div>transform: {transform};</div>
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-800 mb-3">
              Visualization
              <span className="text-sm font-normal text-gray-600 ml-2">
                (Click to set origin)
              </span>
            </h3>

            <div
              ref={containerRef}
              className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden cursor-crosshair"
              style={{
                backgroundImage: showGrid
                  ? `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `
                  : "none",
                backgroundSize: showGrid ? "20px 20px" : "auto",
              }}
              onClick={handleMouseMove}
            >
              {/* Reference element (original position) */}
              {showOriginal && (
                <div
                  className="absolute border-2 border-dashed border-gray-400 bg-gray-200 opacity-50"
                  style={{
                    width: `${elementWidth}px`,
                    height: `${elementHeight}px`,
                    left: "50%",
                    top: "50%",
                    marginLeft: `-${elementWidth / 2}px`,
                    marginTop: `-${elementHeight / 2}px`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500">
                    Original
                  </div>
                </div>
              )}

              {/* Transformed element */}
              <div
                ref={elementRef}
                className="absolute transition-all duration-200"
                style={{
                  width: `${elementWidth}px`,
                  height: `${elementHeight}px`,
                  left: "50%",
                  top: "50%",
                  marginLeft: `-${elementWidth / 2}px`,
                  marginTop: `-${elementHeight / 2}px`,
                  transformOrigin,
                  transform,
                }}
              >
                {children || (
                  <div className="w-full h-full bg-blue-500 text-white rounded-lg shadow-lg flex items-center justify-center text-sm font-medium">
                    Element
                  </div>
                )}

                {/* Transform origin indicator */}
                <div
                  className="absolute w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-lg"
                  style={{
                    left: `${originX}%`,
                    top: `${originY}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              {/* Crosshair lines */}
              <div
                className="absolute w-full h-0.5 bg-red-300 opacity-60 pointer-events-none"
                style={{
                  top: `${originPosition.y}px`,
                  left: "0",
                }}
              />
              <div
                className="absolute h-full w-0.5 bg-red-300 opacity-60 pointer-events-none"
                style={{
                  left: `${originPosition.x}px`,
                  top: "0",
                }}
              />

              {/* Origin coordinates */}
              <div
                className="absolute bg-red-500 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none"
                style={{
                  left: `${originPosition.x + 10}px`,
                  top: `${originPosition.y - 30}px`,
                }}
              >
                ({originX.toFixed(1)}%, {originY.toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold text-gray-800 mb-3">Usage Examples</h3>
        <div className="bg-gray-100 p-3 rounded font-mono text-sm mb-4">
          <div className="text-gray-600 mb-2">
            // Basic usage with default element
          </div>
          <div>&lt;TransformOriginDebugger /&gt;</div>

          <div className="text-gray-600 mb-2 mt-4">// With custom SVG</div>
          <div>
            &lt;TransformOriginDebugger elementWidth={100} elementHeight={100}
            &gt;
          </div>
          <div className="ml-4">
            &lt;svg viewBox="0 0 100 100" className="w-full h-full"&gt;
          </div>
          <div className="ml-8">
            &lt;circle cx="50" cy="50" r="40" fill="red" /&gt;
          </div>
          <div className="ml-4">&lt;/svg&gt;</div>
          <div>&lt;/TransformOriginDebugger&gt;</div>

          <div className="text-gray-600 mb-2 mt-4">
            // With custom component
          </div>
          <div>
            &lt;TransformOriginDebugger elementWidth={150} elementHeight={60}
            &gt;
          </div>
          <div className="ml-4">
            &lt;div className="w-full h-full bg-gradient-to-r from-purple-500
            to-pink-500 rounded-full flex items-center justify-center text-white
            font-bold"&gt;
          </div>
          <div className="ml-8">Custom Element</div>
          <div className="ml-4">&lt;/div&gt;</div>
          <div>&lt;/TransformOriginDebugger&gt;</div>
        </div>

        <h4 className="font-medium text-gray-700 mb-2">Props</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            • <strong>children</strong>: Your custom element/component (JSX)
          </li>
          <li>
            • <strong>elementWidth</strong>: Width of the element in pixels
            (default: 120)
          </li>
          <li>
            • <strong>elementHeight</strong>: Height of the element in pixels
            (default: 80)
          </li>
          <li>
            • <strong>showOriginal</strong>: Show the original position outline
            (default: true)
          </li>
        </ul>
      </div>

      <div className="mt-4 bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold text-gray-800 mb-3">How to Use</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            • Use the sliders to adjust transform origin X and Y positions
          </li>
          <li>
            • Click anywhere in the visualization area to set the origin point
          </li>
          <li>• Use preset buttons for common transform origin values</li>
          <li>
            • Adjust rotation and scale to see how transforms work around the
            origin
          </li>
          <li>• The red dot shows the exact transform origin point</li>
          <li>• Copy the CSS output to use in your own projects</li>
        </ul>
      </div>
    </div>
  );
};

export default TransformOriginDebugger;
