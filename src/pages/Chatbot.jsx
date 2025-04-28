import React, { useState } from 'react';
import { Button, Input, Spin, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './Chatbot.css';

const Chatbot = () => {
  const API_KEY = 'AIzaSyCJ9KkhMy8FKIBic-cSr8yFjmnGvt27p6I'; 

  const [symptomInput, setSymptomInput] = useState('');
  const [responseData, setResponseData] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { Dragger } = Upload;

  // Function to convert File object to GoogleGenerativeAI part
  const fileToGenerativePart = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        resolve({
          inlineData: { data: base64Data, mimeType: file.type },
        });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Main function to fetch diagnosis from Gemini API
  const fetchDiagnosis = async (modelType = 'gemini-1.5-flash', imageParts = null) => {
    if (!symptomInput.trim() && !imageParts) {
      Swal.fire({
        icon: 'warning',
        title: 'Entrée vide',
        text: 'Veuillez entrer un symptôme ou uploader une image.',
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    setLoading(true);
    setResponseData('');

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: modelType });

      let prompt = '';
      if (imageParts) {
        prompt = `Je suis un patient. Voici une image de mes symptômes (par exemple, une éruption cutanée ou une blessure). Quelle pourrait être la maladie probable ? Répondez en français et incluez un avertissement clair et visible que ceci ne remplace pas un diagnostic médical professionnel et que je dois consulter un médecin.`;
      } else {
        prompt = `Je suis un patient. J'ai les symptômes suivants : ${symptomInput}. Quelle pourrait être la maladie probable ? Répondez en français et incluez un avertissement clair et visible que ceci ne remplace pas un diagnostic médical professionnel et que je dois consulter un médecin.`;
      }

      const content = imageParts ? [prompt, ...imageParts] : prompt;
      const result = await model.generateContent(content);
      const text = result.response.text();
      setResponseData(text);
    } catch (error) {
      console.error('Erreur lors de la récupération du diagnostic:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur API',
        text: `Une erreur s’est produite lors de l’analyse. Veuillez vérifier votre clé API et l'accès au modèle (erreur: ${error.message || error}). Réessayez.`,
        toast: true,
        position: 'top-end',
        timer: 5000,
        timerProgressBar: true,
      });
      setResponseData('Une erreur est survenue lors de la communication avec l\'IA. Veuillez réessayer ou vérifier la configuration de votre clé API.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextDiagnosis = () => {
    fetchDiagnosis('gemini-1.5-flash', null);
  };

  const handleVisionDiagnosis = async (file) => {
    setSymptomInput('');
    const imageParts = await fileToGenerativePart(file);
    fetchDiagnosis('gemini-1.5-flash', [imageParts]);
  };

  const openModal = () => {
    setModalVisible(true);
    setSymptomInput('');
    setResponseData('');
    setLoading(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSymptomInput('');
    setResponseData('');
    setLoading(false);
  };

  return (
    <>
      {/* Chatbot Icon */}
      <div
        className="custumer_chatbot_icon_button"
        onClick={openModal}
        aria-label="Ouvrir le chatbot pour un pré-diagnostic"
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') openModal();
        }}
      >
        <img
          src="/chatbot-icon.png"
          alt="Chatbot icon"
          className="cusumer_img img-fluid"
        />
      </div>

      {/* Main Modal */}
      <Modal
        style={{ top: 20 }}
        open={modalVisible}
        title="Commencez vos questions médicales"
        onCancel={closeModal}
        footer={null}
        destroyOnClose={true}
      >
        <div className="gemini-container">
          <p className="text-justify my-2">
            <strong>Nous sommes là pour fournir des informations préliminaires...</strong>
          </p>
          <div className="gemini-card">
            {/* Image Upload (Dragger) */}
            <Dragger
              className="my-3"
              accept=".jpg,.jpeg,.png"
              multiple={false}
              beforeUpload={() => false}
              showUploadList={false}
              onChange={(info) => {
                const file = info.fileList[0]?.originFileObj;
                if (file && file.size / 1024 / 1024 < 5) {
                  handleVisionDiagnosis(file);
                } else if (file && file.size / 1024 / 1024 >= 5) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Fichier trop volumineux',
                    text: 'Veuillez uploader une image de moins de 5 Mo.',
                    toast: true,
                    position: 'top-end',
                    timer: 3000,
                    timerProgressBar: true,
                  });
                }
              }}
              disabled={loading}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Cliquez ou glissez une image ici</p>
              <p className="ant-upload-hint">Supporte .jpg, .jpeg, .png. Max 5MB.</p>
            </Dragger>

            {/* Text Input */}
            <Input
              className="text-input my-3"
              placeholder="Entrez vos symptômes (ex: fièvre, toux)"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onPressEnter={handleTextDiagnosis}
              disabled={loading}
            />

            {/* Submit Button (for text input) */}
            <div className="text-center">
              <Button
                className="pro-button mt-3"
                type="primary"
                onClick={handleTextDiagnosis}
                disabled={loading || !symptomInput.trim()}
              >
                {loading ? 'Analyse en cours...' : 'Analyser les symptômes'}
              </Button>
            </div>

            {/* AI Response Display */}
            <div className="response-container mt-4">
              {loading ? (
                <div className="text-center">
                  <Spin size="large" tip="Analyse en cours..." />
                </div>
              ) : (
                responseData && (
                  <>
                    <p className="diagnosis-result">{responseData}</p>
                    <p className="warning-text">
                      ⚠️ Résultat IA, non médical. Prenez RDV avec nos médecins pour un diagnostic précis.
                    </p>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Chatbot;