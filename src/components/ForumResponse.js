import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Checkbox, Radio, Select, Button, message } from "antd";
import axios from "axios";

const { TextArea } = Input;

const ForumResponse = () => {
  const { id } = useParams();
  const [forum, setForum] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForum = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/forum/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForum(response.data.data);
      } catch (error) {
        console.error("Erreur lors du chargement du forum:", error);
        message.error("Erreur lors du chargement du forum.");
      }
    };
    fetchForum();
  }, [id]);

  const onFinish = async (values) => {
    const responses = Object.keys(values).map((key) => ({
      label: forum.fields.find((field) => field.label === key)?.label || key,
      value: values[key],
    }));

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/forum/responses",
        { forumId: id, responses },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Réponse soumise avec succès!");
      navigate("/forums");
    } catch (error) {
      message.error("Erreur lors de la soumission de la réponse.");
    }
  };

  if (!forum) return <div>Chargement...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{forum.title}</h2>
      <p>{forum.description}</p>
      <p><strong>Créé par:</strong> {forum.createdBy.name} ({forum.createdBy.specialty})</p>
      <div style={{ backgroundColor: forum.backgroundColor, padding: "20px", borderRadius: "8px" }}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          {forum.fields.map((field) => {
            let inputComponent;
            switch (field.type) {
              case "text":
                inputComponent = <Input />;
                break;
              case "TextArea":
                inputComponent = <TextArea rows={4} />;
                break;
              case "checkbox":
                inputComponent = <Checkbox.Group />;
                break;
              case "radio":
                inputComponent = <Radio.Group />;
                break;
              case "select":
                inputComponent = (
                  <Select>
                    {field.options?.map((option) => (
                      <Select.Option key={option} value={option}>
                        {option}
                      </Select.Option>
                    ))}
                  </Select>
                );
                break;
              default:
                inputComponent = <Input />;
            }
            return (
              <Form.Item
                key={field.label}
                name={field.label}
                label={
                  <span
                    style={{
                      fontSize: field.labelFontSize,
                      fontWeight: field.labelFontWeight,
                      color: field.labelColor,
                    }}
                  >
                    {field.label}
                  </span>
                }
                rules={[{ required: field.required, message: `Veuillez remplir ${field.label}` }]}
              >
                {inputComponent}
              </Form.Item>
            );
          })}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Soumettre Réponse
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForumResponse;