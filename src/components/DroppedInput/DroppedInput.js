import React from "react";
import {
  Col,
  Button,
  Form,
  DatePicker,
  Select,
  Input,
  Slider,
  Upload,
  InputNumber,
  Checkbox,
  Radio,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
const { TextArea } = Input;
const { Dragger } = Upload;

const DroppedInput = ({
  id,
  label,
  type,
  options,
  required,
  showDrawer,
  labelColor,
  labelFontSize,
  labelFontWeight,
}) => {
  let inputComponent;
  switch (type) {
    case "text":
    case "text_category":
    case "text_topic":
      inputComponent = (
        <Form.Item
          label={
            <span
              style={{
                fontSize: labelFontSize,
                fontWeight: labelFontWeight,
                color: labelColor,
              }}
            >
              {label}
            </span>
          }
          name={id}
        >
          <Input placeholder={label} />
        </Form.Item>
      );
      break;
    case "TextArea":
    case "TextArea_category":
    case "TextArea_topic":
    case "TextArea_post":
      inputComponent = (
        <Form.Item
          label={
            <span
              style={{
                fontSize: labelFontSize,
                fontWeight: labelFontWeight,
                color: labelColor,
              }}
            >
              {label}
            </span>
          }
          name={id}
        >
          <TextArea placeholder={label} />
        </Form.Item>
      );
      break;
    case "checkbox":
      inputComponent = (
        <Form.Item
          label={
            <span
              style={{
                fontSize: labelFontSize,
                fontWeight: labelFontWeight,
                color: labelColor,
              }}
            >
              {label}
            </span>
          }
          name={id}
          valuePropName="checked"
        >
          <Checkbox.Group>
            {options && options.map((option) => (
              <Checkbox key={option} value={option}>{option}</Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      );
      break;
    case "radio":
      inputComponent = (
        <Form.Item
          label={
            <span
              style={{
                fontSize: labelFontSize,
                fontWeight: labelFontWeight,
                color: labelColor,
              }}
            >
              {label}
            </span>
          }
          name={id}
          valuePropName="checked"
        >
          <Radio.Group>
            {options && options.map((option) => (
              <Radio key={option} value={option}>{option}</Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      );
      break;
    case "select":
      inputComponent = (
        <Form.Item
          label={
            <span
              style={{
                fontSize: labelFontSize,
                fontWeight: labelFontWeight,
                color: labelColor,
              }}
            >
              {label}
            </span>
          }
          name={id}
        >
          <Select>
            {options && options.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      );
      break;
    case "date":
      inputComponent = (
        <Form.Item
          label={
            <span
              style={{
                fontSize: labelFontSize,
                fontWeight: labelFontWeight,
                color: labelColor,
              }}
            >
              {label}
            </span>
          }
          name={id}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      );
      break;
    case "number":
      inputComponent = (
        <Form.Item
          label={
            <span
              style={{
                fontSize: labelFontSize,
                fontWeight: labelFontWeight,
                color: labelColor,
              }}
            >
              {label}
            </span>
          }
          name={id}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      );
      break;
    default:
      inputComponent = (
        <Form.Item
          label={
            <span
              style={{
                fontSize: labelFontSize,
                fontWeight: labelFontWeight,
                color: labelColor,
              }}
            >
              {label}
            </span>
          }
          name={id}
        >
          <Input placeholder={label} />
        </Form.Item>
      );
  }
  return (
    <Col style={{ marginBottom: "8px" }} lg={22}>
      {inputComponent}
      <EditOutlined onClick={showDrawer} />
    </Col>
  );
};

export default DroppedInput;