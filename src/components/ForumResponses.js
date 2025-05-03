// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { List, Card, message } from "antd";
// import axios from "axios";

// const ForumResponses = () => {
//   const { forumId } = useParams();
//   const [responses, setResponses] = useState([]);
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   useEffect(() => {
//     if (!['internaute', 'admin'].includes(user.role)) {
//       message.error("Accès refusé. Seuls les médecins et administrateurs peuvent voir les réponses.");
//       navigate('/forums');
//       return;
//     }

//     const fetchResponses = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(`http://localhost:5000/api/forum/responses/${forumId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setResponses(response.data.data);
//       } catch (error) {
//         console.error("Erreur lors du chargement des réponses:", error);
//         message.error("Erreur lors du chargement des réponses.");
//       }
//     };
//     fetchResponses();
//   }, [forumId, navigate, user.role]);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Réponses au Forum</h2>
//       <List
//         dataSource={responses}
//         renderItem={(response) => (
//           <List.Item>
//             <Card>
//               <p><strong>Soumis par:</strong> {response.submittedBy.nom} {response.submittedBy.prenom}</p>
//               {response.responses.map((res, index) => (
//                 <p key={index}>
//                   <strong>{res.label}:</strong> {res.value.toString()}
//                 </p>
//               ))}
//             </Card>
//           </List.Item>
//         )}
//       />
//     </div>
//   );
// };

// export default ForumResponses;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Table, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const ForumResponses = () => {
  const { forumId } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!['internaute', 'admin'].includes(user.role)) {
      Swal.fire({
        icon: "error",
        title: "Accès refusé",
        text: "Seuls les médecins et administrateurs peuvent voir les réponses.",
        toast: true,
        position: "top-end",
        timer: 3000,
        timerProgressBar: true,
      });
      navigate('/admin-dashboard');
      return;
    }

    const fetchResponses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/forum/responses/${forumId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResponses(response.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des réponses:", error);
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Erreur lors du chargement des réponses.",
          toast: true,
          position: "top-end",
          timer: 3000,
          timerProgressBar: true,
        });
        navigate('/admin-dashboard');
      }
    };
    fetchResponses();
  }, [forumId, navigate, user.role]);

  if (loading) return <div className="text-center mt-5">Chargement des réponses...</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4">Réponses au Forum</h2>
      <Button variant="secondary" className="mb-4" onClick={() => navigate('/admin-dashboard')}>
        Retour à la liste des forums
      </Button>
      <Card className="shadow-sm">
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Soumis par</th>
                <th>Réponses</th>
              </tr>
            </thead>
            <tbody>
              {responses.length > 0 ? (
                responses.map((response, index) => (
                  <tr key={index}>
                    <td>{response.submittedBy.nom} {response.submittedBy.prenom}</td>
                    <td>
                      {response.responses.map((res, idx) => (
                        <p key={idx} className="mb-1">
                          <strong>{res.label}:</strong> {res.value.toString()}
                        </p>
                      ))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center">
                    Aucune réponse disponible.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ForumResponses;