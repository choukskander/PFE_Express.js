import React, { useState, useEffect } from "react";
import { List, Card, Button } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForumList = () => {
  const [forums, setForums] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/forum", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForums(response.data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des forums:", error);
      }
    };
    fetchForums();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Liste des Forums Médicaux</h2>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={forums}
        renderItem={(forum) => (
          <List.Item>
            <Card
              title={forum.title}
              style={{ backgroundColor: forum.backgroundColor }}
            >
              <p>{forum.description}</p>
              <p><strong>Créé par:</strong> {forum.createdBy.name} ({forum.createdBy.specialty})</p>
              <div style={{ display: "flex", gap: "10px" }}>
                <Button type="primary" onClick={() => navigate(`/forum/${forum._id}`)}>
                  Voir et Répondre
                </Button>
                {user.role === "internaute" && (
                  <Button onClick={() => navigate(`/forum-responses/${forum._id}`)}>
                    Voir les Réponses
                  </Button>
                )}
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ForumList;
