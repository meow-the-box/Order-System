import { useState, useEffect, useCallback } from 'react';

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
  const [isAnalyzing, setIsAnalyzing] = useState(false); // TC-09: 防重复点击
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

  // Handle camera capture - TC-09: 防重复点击
  const handleCapture = useCallback(async (file) => {
    // 防止重复提交
    if (isAnalyzing) {
      console.log('Already analyzing, ignoring...');
      return;
    }

    setIsAnalyzing(true);

    try {
      // TC-05: 更激进的压缩 (800px, 质量0.7)
      const compressed = await compressImage(file, 800, 0.7);
      setCapturedImage(compressed);
      setCurrentPage(PAGES.ANALYZING);
      setIsSaved(false);
      setIsFromHistory(false);
      setError(null);

      // TC-06: 添加超时控制 (25秒)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      try {
        const result = await analyzeTongue(compressed, controller.signal);
        clearTimeout(timeoutId);
        setAnalysisResult(result);
        setCurrentPage(PAGES.RESULT);
      } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          throw new Error('分析超时，请检查网络后重试');
        }
        throw err;
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || '分析失败，请重试');
      alert(err.message || '分析失败，请重试');
      setCurrentPage(PAGES.CAMERA);
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing]);

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
            isAnalyzing={isAnalyzing}
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
