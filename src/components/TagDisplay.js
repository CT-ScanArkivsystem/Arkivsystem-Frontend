import React from "react";

import Form from "react-bootstrap/Form";


export default function TagDisplay ({
    className = "",
    ...props
}) {

  return (
          <Form.Check
              type="checkbox"
              className="tagCheckbox"
              {...props}
          />
  );
}
