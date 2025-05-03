import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { List, Card, message } from "antd";
import axios from "axios";

const ForumResponses = () => {
  const { forumId } = useParams();
  const [responses, setResponses] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!['internaute', 'admin'].includes(user.role)) {
      message.error("Accès refusé. Seuls les médecins et administrateurs peuvent voir les réponses.");
      navigate('/forums');
      return;
    }

    const fetchResponses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/forum/responses/${forumId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResponses(response.data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des réponses:", error);
        message.error("Erreur lors du chargement des réponses.");
      }
    };
    fetchResponses();
  }, [forumId, navigate, user.role]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Réponses au Forum</h2>
      <List
        dataSource={responses}
        renderItem={(response) => (
          <List.Item>
            <Card>
              <p><strong>Soumis par:</strong> {response.submittedBy.nom} {response.submittedBy.prenom}</p>
              {response.responses.map((res, index) => (
                <p key={index}>
                  <strong>{res.label}:</strong> {res.value.toString()}
                </p>
              ))}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ForumResponses;