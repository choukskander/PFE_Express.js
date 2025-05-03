import { Col, Space } from "antd";
import React from "react";
import classes from "../Forms.module.css";

const DraggableInput = ({ id, label, type, options, onClick, prefix }) => {
  return (
    <Col
      className={classes.draggableInput}
      style={{ cursor: "grab" }}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({ id, label, type, options })
        );
      }}
    >
      <Space>
        {prefix && <span className="ant-input-group-addon">{prefix}</span>}
        {label}
      </Space>
    </Col>
  );
};

export default DraggableInput;