
function Skeleton({ 
  type = 'text', 
  width, 
  height, 
  count = 1, 
  className = '',
  circle = false,
  containerClassName = '' 
}) {
  const elements = [];
  
  for (let i = 0; i < count; i++) {
    let skeletonClass = 'bg-gray-200 rounded animate-pulse';
    
    // Apply specific styles based on type
    switch (type) {
      case 'image':
        skeletonClass += ' w-full h-full';
        break;
      case 'button':
        skeletonClass += ' h-10';
        break;
      case 'title':
        skeletonClass += ' h-6 mb-2';
        break;
      case 'text':
      default:
        skeletonClass += ' h-4';
        break;
    }
    
    // Apply custom width/height if provided
    const style = {};
    if (width) style.width = width;
    if (height) style.height = height;
    
    // Add circle style if requested
    if (circle) skeletonClass += ' rounded-full';
    
    // Combine with custom className
    skeletonClass += ` ${className}`;
    
    elements.push(
      <div
        key={i}
        className={skeletonClass}
        style={Object.keys(style).length > 0 ? style : undefined}
      />
    );
  }
  
  return (
    <div className={containerClassName}>
      {elements}
    </div>
  );
}

export default Skeleton;