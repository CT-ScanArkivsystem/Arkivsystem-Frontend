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
              id={props.id}
              type="checkbox"
              className={`${props.customCheckbox ? 'customCheckbox' : ''} tagCheckbox`}
              label={props.label}
              value={props.value}
              disabled={props.disabled}
              defaultChecked={props.defaultChecked}
              onChange={props.onChange}
          />
  );
}
