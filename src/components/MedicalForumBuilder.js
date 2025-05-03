// import React, { useState, useEffect } from "react";
// import { Row, Col, Input, Form, Button, ColorPicker } from "antd";
// import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
// import classes from "./Forms.module.css";
// import DraggableInput from "./DraggableInput/DraggableInput";
// import DroppedInput from "./DroppedInput/DroppedInput";
// import AddItemForm from "./AddItemForm/AddItemForm";
// import axios from "axios";
// import Navbar from "../pages/Navbar";
// import { useNavigate } from "react-router-dom";

// const { TextArea } = Input;

// const MedicalForumBuilder = () => {
//   const [form] = Form.useForm();
//   const [droppedItems, setDroppedItems] = useState([]);
//   const [drawerVisible, setDrawerVisible] = useState(false);
//   const [selectedInputDetails, setSelectedInputDetails] = useState({});
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const token = localStorage.getItem("token");
//     console.log("Stored User:", storedUser); // Debug: Check stored user
//     console.log("Stored Token:", token); // Debug: Check stored token
//     if (storedUser && token) {
//       setUser(JSON.parse(storedUser));
//     } else {
//       console.log("No user or token found, redirecting to login");
//       navigate("/login");
//     }
//   }, [navigate]);

//   const onDragStart = (e, id, label, type, options) => {
//     e.dataTransfer.setData("text/plain", JSON.stringify({ id, label, type, options }));
//   };

//   const onDrop = (e) => {
//     e.preventDefault();
//     const data = JSON.parse(e.dataTransfer.getData("text/plain"));
//     setDroppedItems([...droppedItems, { ...data, id: Date.now().toString(), required: false, labelColor: "#000000", labelFontSize: 14, labelFontWeight: 400 }]);
//   };

//   const onDragOver = (e) => {
//     e.preventDefault();
//   };

//   const showDrawer = (id, label, type, options, required, labelColor, labelFontSize, labelFontWeight) => {
//     setSelectedInputDetails({
//       id,
//       label,
//       type,
//       options,
//       required,
//       labelColor,
//       labelFontSize,
//       labelFontWeight,
//     });
//     setDrawerVisible(true);
//   };

//   const closeDrawer = () => {
//     setDrawerVisible(false);
//   };

//   const updateItem = (updatedItem) => {
//     setDroppedItems(droppedItems.map(item =>
//       item.id === updatedItem.id ? { ...item, ...updatedItem } : item
//     ));
//     closeDrawer();
//   };

//   const deleteItem = (id) => {
//     setDroppedItems(droppedItems.filter(item => item.id !== id));
//   };

//   const onFinish = async (values) => {
//     if (!user) {
//       console.log("No user available, redirecting to login");
//       alert("Utilisateur non connecté. Veuillez vous reconnecter.");
//       navigate("/login");
//       return;
//     }

//     if (user.role !== "internaute") {
//       console.log("User role is not internaute:", user.role);
//       alert("Accès refusé. Seuls les médecins peuvent créer un forum.");
//       return;
//     }

//     const forumData = {
//       title: values.title,
//       description: values.description,
//       backgroundColor: values.backgroundColor.toHexString ? values.backgroundColor.toHexString() : values.backgroundColor,
//       createdBy: {
//         id: user._id,
//         name: user.nom + " " + user.prenom,
//         specialty: values.specialty || "Non spécifié",
//       },
//       fields: droppedItems.map(item => ({
//         label: item.label,
//         type: item.type,
//         required: item.required,
//         labelColor: item.labelColor.toHexString ? item.labelColor.toHexString() : item.labelColor,
//         labelFontSize: item.labelFontSize,
//         labelFontWeight: item.labelFontWeight,
//       })),
//     };

//     try {
//       const token = localStorage.getItem("token");
//       console.log("Sending forum data:", forumData); // Debug: Check data being sent
//       console.log("Authorization Header:", `Bearer ${token}`); // Debug: Check header
//       const response = await axios.post("http://localhost:5000/api/forum", forumData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("Response:", response.data); // Debug: Check response
//       alert("Forum créé avec succès!");
//       navigate("/forums");
//     } catch (error) {
//       console.error("Error:", error.response ? error.response.data : error.message); // Debug: Log error details
//       if (error.response && error.response.status === 401) {
//         alert("Session expirée ou token invalide. Veuillez vous reconnecter.");
//         localStorage.removeItem("user");
//         localStorage.removeItem("token");
//         navigate("/login");
//       } else {
//         alert("Erreur lors de la création du forum: " + (error.response ? error.response.data.message : error.message));
//       }
//     }
//   };

//   if (!user) {
//     return <div>Chargement...</div>;
//   }

//   return (
//     <>
//       <Navbar />
//       <div style={{ paddingTop: "64px" }}>
//         <div className="container vstack gap-4 mb-5 mt-10" >
//           <div className="row mb-5 card rounded-3 border p-4 pb-2">
//             <div className="col-12 mb-5 mt-3">
//               <h1 className="fs-4 mb-0">
//                 <PlusOutlined className="mx-3" />
//                 Créer un Forum Médical
//               </h1>
//             </div>

//             <Row gutter={[16, 16]} style={{ width: "90vw", margin: "0 auto" }}>
//               {/* Left Sidebar - Éléments de formulaire */}
//               <Col lg={6} className={classes.availableFields}style={{ paddingTop: "100px" }}>
//                 <h5>Éléments de formulaire</h5>
//                 <Row gutter={[8, 8]} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", width: "100%" }}>
//                   <DraggableInput id="1" label="Text Input" type="text" options={undefined} prefix={<PlusOutlined />} />
//                   <DraggableInput id="2" label="Number" type="number" options={undefined} prefix={<PlusOutlined />} />
//                   <DraggableInput id="3" label="Date Picker" type="date" options={undefined} prefix={<PlusOutlined />} />
//                   <DraggableInput id="4" label="Checkbox" type="checkbox" options={undefined} prefix={<PlusOutlined />} />
//                   <DraggableInput id="5" label="Radio Group" type="radio" options={undefined} prefix={<PlusOutlined />} />
//                   <DraggableInput id="6" label="Select" type="select" options={undefined} prefix={<PlusOutlined />} />
//                   <DraggableInput id="7" label="Password" type="password" options={undefined} prefix={<PlusOutlined />} />
//                   <DraggableInput id="8" label="Email" type="email" options={undefined} prefix={<PlusOutlined />} />
//                   <DraggableInput id="9" label="Phone" type="phone" options={undefined} prefix={<PlusOutlined />} />
//                   <DraggableInput id="10" label="Upload" type="upload" options={undefined} prefix={<PlusOutlined />} />
//                 </Row>
//               </Col>

//               {/* Right Section - Informations du Formulaire Médicale */}
//               <Col lg={18} className={classes.formSection}>
//                 <div className={classes.infoHeader}>ⓘ Informations du Formulaire Médicale</div>
//                 <Form form={form} onFinish={onFinish} layout="vertical">
//                   <div className={classes.formCard}>
//                     <p>À remplir :</p>
//                     <Form.Item name="title" label="Titre :" rules={[{ required: true, message: "Veuillez entrer le titre" }]}>
//                       <Input placeholder="Entrez le titre" />
//                     </Form.Item>
//                     <Form.Item name="description" label="Description :" rules={[{ required: true, message: "Veuillez entrer la description" }]}>
//                       <TextArea placeholder="Entrez la description" rows={4} />
//                     </Form.Item>
//                     <Form.Item name="specialty" label="Spécialité :" rules={[{ required: true, message: "Veuillez entrer votre spécialité" }]}>
//                       <Input placeholder="Entrez votre spécialité" />
//                     </Form.Item>
//                     <Form.Item name="backgroundColor" label="Couleur Arrière-plan :">
//                       <ColorPicker defaultValue="#ffffff" />
//                     </Form.Item>
//                     <div
//                       className={classes.dropArea}
//                       onDrop={onDrop}
//                       onDragOver={onDragOver}
//                     >
//                       <p>+ Glissez les éléments ici</p>
//                       {droppedItems.map((item, index) => (
//                         <div key={item.id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
//                           <DroppedInput
//                             id={item.id}
//                             label={item.label}
//                             type={item.type}
//                             options={item.options}
//                             required={item.required}
//                             labelColor={item.labelColor}
//                             labelFontSize={item.labelFontSize}
//                             labelFontWeight={item.labelFontWeight}
//                           />
//                           <Button
//                             icon={<EditOutlined />}
//                             onClick={() => showDrawer(
//                               item.id,
//                               item.label,
//                               item.type,
//                               item.options,
//                               item.required,
//                               item.labelColor,
//                               item.labelFontSize,
//                               item.labelFontWeight
//                             )}
//                             style={{ marginLeft: "10px" }}
//                           />
//                           <Button
//                             icon={<DeleteOutlined />}
//                             onClick={() => deleteItem(item.id)}
//                             style={{ marginLeft: "10px" }}
//                             danger
//                           />
//                         </div>
//                       ))}
//                     </div>
//                     <Form.Item>
//                       <Button type="primary" htmlType="submit">
//                         Enregistrer
//                       </Button>
//                     </Form.Item>
//                   </div>
//                 </Form>
//               </Col>

//               {/* Drawer for editing dropped items */}
//               <AddItemForm
//                 visible={drawerVisible}
//                 onClose={closeDrawer}
//                 onAddItem={updateItem}
//                 selectedInputDetails={selectedInputDetails}
//               />
//             </Row>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default MedicalForumBuilder;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";

const MedicalForumBuilder = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [fields, setFields] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Restrict access to admins only
  if (user.role !== "admin") {
    Swal.fire({
      icon: "error",
      title: "Accès refusé",
      text: "Seuls les administrateurs peuvent créer des forums.",
      toast: true,
      position: "top-end",
      timer: 3000,
      timerProgressBar: true,
    });
    navigate("/admin-dashboard");
    return null;
  }

  const addField = () => {
    setFields([
      ...fields,
      {
        label: "",
        type: "text",
        required: false,
        options: [],
        labelFontSize: "16px",
        labelFontWeight: "normal",
        labelColor: "#000000",
      },
    ]);
  };

  const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const addOption = (fieldIndex) => {
    const newFields = [...fields];
    newFields[fieldIndex].options.push("");
    setFields(newFields);
  };

  const updateOption = (fieldIndex, optionIndex, value) => {
    const newFields = [...fields];
    newFields[fieldIndex].options[optionIndex] = value;
    setFields(newFields);
  };

  const removeOption = (fieldIndex, optionIndex) => {
    const newFields = [...fields];
    newFields[fieldIndex].options.splice(optionIndex, 1);
    setFields(newFields);
  };

  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const forumData = {
      title,
      description,
      backgroundColor,
      fields,
      createdBy: user._id,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/forum", forumData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Forum créé avec succès!",
        toast: true,
        position: "top-end",
        timer: 3000,
        timerProgressBar: true,
      });
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Erreur lors de la création du forum:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de la création du forum.",
        toast: true,
        position: "top-end",
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Créer un Nouveau Forum Médical</h2>
      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Titre du Forum</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Couleur de Fond</Form.Label>
              <Form.Control
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
              />
            </Form.Group>

            <h5 className="mt-4 mb-3">Champs du Formulaire</h5>
            {fields.map((field, index) => (
              <Card key={index} className="mb-3 p-3 border">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Étiquette</Form.Label>
                      <Form.Control
                        type="text"
                        value={field.label}
                        onChange={(e) =>
                          updateField(index, "label", e.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Type</Form.Label>
                      <Form.Select
                        value={field.type}
                        onChange={(e) => updateField(index, "type", e.target.value)}
                      >
                        <option value="text">Texte</option>
                        <option value="TextArea">Zone de Texte</option>
                        <option value="checkbox">Case à Cocher</option>
                        <option value="radio">Bouton Radio</option>
                        <option value="select">Liste Déroulante</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      label="Requis"
                      checked={field.required}
                      onChange={(e) =>
                        updateField(index, "required", e.target.checked)
                      }
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Taille de la Police de l'Étiquette</Form.Label>
                      <Form.Control
                        type="text"
                        value={field.labelFontSize}
                        onChange={(e) =>
                          updateField(index, "labelFontSize", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Poids de la Police</Form.Label>
                      <Form.Select
                        value={field.labelFontWeight}
                        onChange={(e) =>
                          updateField(index, "labelFontWeight", e.target.value)
                        }
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Gras</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Couleur de l'Étiquette</Form.Label>
                      <Form.Control
                        type="color"
                        value={field.labelColor}
                        onChange={(e) =>
                          updateField(index, "labelColor", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {(field.type === "select" || field.type === "radio") && (
                  <div>
                    <h6>Options</h6>
                    {field.options.map((option, optionIndex) => (
                      <InputGroup key={optionIndex} className="mb-2">
                        <Form.Control
                          type="text"
                          value={option}
                          onChange={(e) =>
                            updateOption(index, optionIndex, e.target.value)
                          }
                        />
                        <Button
                          variant="danger"
                          onClick={() => removeOption(index, optionIndex)}
                        >
                          Supprimer
                        </Button>
                      </InputGroup>
                    ))}
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => addOption(index)}
                    >
                      Ajouter une Option
                    </Button>
                  </div>
                )}

                <Button
                  variant="danger"
                  size="sm"
                  className="mt-3"
                  onClick={() => removeField(index)}
                >
                  Supprimer le Champ
                </Button>
              </Card>
            ))}

            <Button
              variant="outline-primary"
              className="mt-3"
              onClick={addField}
            >
              Ajouter un Champ
            </Button>

            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" onClick={() => navigate("/admin-dashboard")} className="me-2">
                Annuler
              </Button>
              <Button type="submit" variant="primary">
                Créer le Forum
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MedicalForumBuilder;