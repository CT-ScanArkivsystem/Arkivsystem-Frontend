import React from "react";
import "./TagDisplay.css";
import Form from "react-bootstrap/Form";


export default function TagDisplay (props) {

    // This sets the default properties of the file.
    TagDisplay.defaultProps = {
        customCheckbox: false,
    }

  return (
          <Form.Check
              type="checkbox"
              className={`${props.customCheckbox ? 'customCheckbox' : ''} tagCheckbox`}
              {...props}
          />
  );
}
