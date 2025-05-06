import React, { useState, useEffect } from "react";
import { Drawer, Form, Input, Switch, Slider, Select, Button, ColorPicker, List, Space } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddItemForm = ({ visible, onClose, onAddItem, selectedInputDetails }) => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState(selectedInputDetails?.options || []);

  useEffect(() => {
    if (selectedInputDetails) {
      form.setFieldsValue({
        label: selectedInputDetails.label,
        required: selectedInputDetails.required,
        labelFontSize: selectedInputDetails.labelFontSize,
        labelFontWeight: selectedInputDetails.labelFontWeight,
        labelColor: selectedInputDetails.labelColor,
      });
      setOptions(selectedInputDetails.options || []);
    }
  }, [selectedInputDetails, form]);

  const onFinish = (values) => {
    const updatedItem = {
      ...selectedInputDetails,
      label: values.label,
      required: values.required,
      labelFontSize: values.labelFontSize,
      labelFontWeight: values.labelFontWeight,
      labelColor: values.labelColor?.toHexString ? values.labelColor.toHexString() : values.labelColor,
      options: ["select", "checkbox", "radio"].includes(selectedInputDetails.type) ? options : undefined,
    };
    console.log('Updated item:', updatedItem); // Debug log
    onAddItem(updatedItem);
  };

  const addOption = () => {
    setOptions([...options, `Option ${options.length + 1}`]);
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const deleteOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <Drawer
      title="Modifier l'élément"
      width={400}
      onClose={onClose}
      open={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Annuler
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            Sauvegarder
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="label" label="Label" rules={[{ required: true, message: "Veuillez entrer un label" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="required" label="Requis" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="labelFontSize" label="Taille de police">
          <Slider min={10} max={20} />
        </Form.Item>
        <Form.Item name="labelFontWeight" label="Épaisseur de police">
          <Slider min={100} max={900} step={100} />
        </Form.Item>
        <Form.Item name="labelColor" label="Couleur du label">
          <ColorPicker />
        </Form.Item>

        {["select", "checkbox", "radio"].includes(selectedInputDetails.type) && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span>Options</span>
              <Button type="dashed" onClick={addOption} icon={<PlusOutlined />}>
                Ajouter une option
              </Button>
            </div>
            <List
              dataSource={options}
              renderItem={(option, index) => (
                <List.Item
                  actions={[
                    <DeleteOutlined onClick={() => deleteOption(index)} style={{ color: "#ff4d4f" }} />,
                  ]}
                >
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    style={{ width: "100%" }}
                  />
                </List.Item>
              )}
            />
            {options.length === 0 && (
              <div style={{ color: "#ff4d4f", marginTop: "8px" }}>
                Veuillez ajouter au moins une option.
              </div>
            )}
          </div>
        )}
      </Form>
    </Drawer>
  );
};

export default AddItemForm;