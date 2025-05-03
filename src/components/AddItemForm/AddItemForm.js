import React, { useState, useEffect } from "react";
import { Drawer, Form, Input, Switch, Slider, Select, Button, ColorPicker } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddItemForm = ({ visible, onClose, onAddItem, selectedInputDetails }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedInputDetails) {
      form.setFieldsValue({
        label: selectedInputDetails.label,
        required: selectedInputDetails.required,
        labelFontSize: selectedInputDetails.labelFontSize,
        labelFontWeight: selectedInputDetails.labelFontWeight,
        labelColor: selectedInputDetails.labelColor,
      });
    }
  }, [selectedInputDetails, form]);

  const onFinish = (values) => {
    const updatedItem = {
      ...selectedInputDetails,
      label: values.label,
      required: values.required,
      labelFontSize: values.labelFontSize,
      labelFontWeight: values.labelFontWeight,
      labelColor: values.labelColor.toHexString ? values.labelColor.toHexString() : values.labelColor,
    };
    onAddItem(updatedItem);
  };

  return (
    <Drawer
      title="Modifier l'élément"
      width={400}
      onClose={onClose}
      open={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
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
        <Form.Item name="label" label="Label" rules={[{ required: true, message: 'Veuillez entrer un label' }]}>
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
      </Form>
    </Drawer>
  );
};

export default AddItemForm;