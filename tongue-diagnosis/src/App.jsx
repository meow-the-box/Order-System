import { useState, useEffect } from 'react';

// Components
import WelcomePage from './components/WelcomePage';
import HomePage from './components/HomePage';
import GuidePage from './components/GuidePage';
import CameraPage from './components/CameraPage';
import AnalyzingPage from './components/AnalyzingPage';
import ResultPage from './components/ResultPage';
import HistoryPage from './components/HistoryPage';
import InstructionsPage from './components/InstructionsPage';

// Utils
import { compressImage } from './utils/imageCompress';
import { analyzeTongue } from './utils/api';
import {
  isFirstVisit,
  markVisited,
  getHistoryList,
  saveAnalysis,
  getAnalysisDetail,
  deleteAnalysis,
} from './utils/storage';

// Pages enum
const PAGES = {
  WELCOME: 'welcome',
  HOME: 'home',
  GUIDE: 'guide',
  CAMERA: 'camera',
  ANALYZING: 'analyzing',
  RESULT: 'result',
  HISTORY: 'history',
  INSTRUCTIONS: 'instructions',
};

export default function App() {
  // State
  const [currentPage, setCurrentPage] = useState(
    isFirstVisit() ? PAGES.WELCOME : PAGES.HOME
  );
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isFromHistory, setIsFromHistory] = useState(false);
  const [error, setError] = useState(null);

  // Load history on mount
  useEffect(() => {
    setHistoryList(getHistoryList());
  }, []);

  // Handle welcome completion
  const handleWelcomeStart = () => {
    markVisited();
    setCurrentPage(PAGES.HOME);
  };

  // Handle start diagnosis
  const handleStartDiagnosis = () => {
    setCurrentPage(PAGES.GUIDE);
  };

  // Handle camera capture
  const handleCapture = async (file) => {
    try {
      // Compress image
      const compressed = await compressImage(file, 1024, 0.8);
      setCapturedImage(compressed);
      setCurrentPage(PAGES.ANALYZING);
      setIsSaved(false);
      setIsFromHistory(false);
      setError(null);

      // Analyze
      const result = await analyzeTongue(compressed);
      setAnalysisResult(result);
      setCurrentPage(PAGES.RESULT);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || '分析失败，请重试');
      alert(err.message || '分析失败，请重试');
      setCurrentPage(PAGES.CAMERA);
    }
  };

  // Handle save
  const handleSave = () => {
    if (analysisResult && capturedImage) {
      try {
        saveAnalysis(analysisResult, capturedImage);
        setHistoryList(getHistoryList());
        setIsSaved(true);
        alert('保存成功！');
      } catch (err) {
        alert(err.message || '保存失败');
      }
    }
  };

  // Handle view history detail
  const handleViewHistoryDetail = (id) => {
    const detail = getAnalysisDetail(id);
    if (detail) {
      setAnalysisResult(detail);
      setCapturedImage(detail.image);
      setIsFromHistory(true);
      setCurrentPage(PAGES.RESULT);
    } else {
      alert('记录不存在或已损坏');
    }
  };

  // Handle delete history
  const handleDeleteHistory = (id) => {
    deleteAnalysis(id);
    setHistoryList(getHistoryList());
  };

  // Handle retry
  const handleRetry = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setIsSaved(false);
    setIsFromHistory(false);
    setCurrentPage(PAGES.CAMERA);
  };

  // Handle back to home
  const handleBackToHome = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setIsSaved(false);
    setIsFromHistory(false);
    setCurrentPage(PAGES.HOME);
  };

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case PAGES.WELCOME:
        return <WelcomePage onStart={handleWelcomeStart} />;

      case PAGES.HOME:
        return (
          <HomePage
            onStartDiagnosis={handleStartDiagnosis}
            onViewHistory={() => setCurrentPage(PAGES.HISTORY)}
            onViewInstructions={() => setCurrentPage(PAGES.INSTRUCTIONS)}
          />
        );

      case PAGES.GUIDE:
        return (
          <GuidePage
            onBack={handleBackToHome}
            onStartCamera={() => setCurrentPage(PAGES.CAMERA)}
          />
        );

      case PAGES.CAMERA:
        return (
          <CameraPage
            onBack={() => setCurrentPage(PAGES.GUIDE)}
            onCapture={handleCapture}
          />
        );

      case PAGES.ANALYZING:
        return <AnalyzingPage image={capturedImage} />;

      case PAGES.RESULT:
        return (
          <ResultPage
            result={analysisResult}
            image={capturedImage}
            onBack={handleBackToHome}
            onSave={handleSave}
            onRetry={handleRetry}
            isSaved={isSaved}
            isFromHistory={isFromHistory}
          />
        );

      case PAGES.HISTORY:
        return (
          <HistoryPage
            historyList={historyList}
            onBack={handleBackToHome}
            onViewDetail={handleViewHistoryDetail}
            onDelete={handleDeleteHistory}
          />
        );

      case PAGES.INSTRUCTIONS:
        return <InstructionsPage onBack={handleBackToHome} />;

      default:
        return <HomePage onStartDiagnosis={handleStartDiagnosis} />;
    }
  };

  return <div className="min-h-screen bg-gray-50">{renderPage()}</div>;
}
