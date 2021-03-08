import React from "react";
import "./FileDisplay.css";

import Form from "react-bootstrap/Form";


export default function TagDisplay ({
    className = "",
    ...props
}) {

  return (
      <Form.Group size="lg">
          <Form.Check
              type="checkbox"
              className="tagCheckbox"
              {...props}
          />
      </Form.Group>
  );
}