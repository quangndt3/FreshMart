import { useRef } from "react";
import ChildComponent from "./test/Test";

// Component cha
const ParentComponent = () => {
    const childRef = useRef(null);
  
    const handleChildClick = () => {
      // Call handleClick function in child component from parent component
      childRef?.current?.handleClick;
    };
  
    return (
      <div>
        <h1>Parent Component</h1>
        <ChildComponent ref={childRef} />
        <button onClick={handleChildClick}>Click me (in parent component)</button>
      </div>
    );
  };
  
  export default ParentComponent;