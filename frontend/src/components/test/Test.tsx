import React from "react";

const ChildComponent = React.forwardRef((props, ref) => {
    const handleClick = () => {
      alert('Button clicked in child component!');
      // Do something else if needed
    };
  
    // Expose handleClick function to parent component
    React.useImperativeHandle(ref, () => ({
      handleClick
    }));
  
    return (
      <button onClick={handleClick}>Click me (in child component)</button>
    );
  });
export default ChildComponent