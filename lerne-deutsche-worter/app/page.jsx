'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [levels, setLevels] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 获取所有级别
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch('/api/levels');
        const data = await response.json();
        setLevels(data);
        setLoading(false);
      } catch (error) {
        console.error('获取级别失败:', error);
        setLoading(false);
      }
    };
    fetchLevels();
  }, []);

  // 当级别改变时获取对应主题
  useEffect(() => {
    if (!selectedLevel) {
      setTopics([]);
      return;
    }

    const fetchTopics = async () => {
      try {
        const response = await fetch(`/api/topics?levelId=${selectedLevel}`);
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error('获取主题失败:', error);
      }
    };
    fetchTopics();
  }, [selectedLevel]);

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
    setSelectedTopic('');
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  const startLearning = () => {
    if (selectedLevel && selectedTopic) {
      router.push(`/learn?levelId=${selectedLevel}&topicId=${selectedTopic}`);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-black">加载中...</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">德语词汇学习</h1>

      <div className="mb-3 sm:mb-4">
        <label className="block text-slate-700 dark:text-gray-300 mb-1 sm:mb-2">选择级别</label>
        <select
          value={selectedLevel}
          onChange={handleLevelChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
          <option value="">请选择级别</option>
          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 sm:mb-6">
        <label className="block text-slate-700 dark:text-gray-300 mb-1 sm:mb-2">选择主题</label>
        <select
          value={selectedTopic}
          onChange={handleTopicChange}
          disabled={!selectedLevel}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500"
        >
          <option value="">请选择主题</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={startLearning}
        disabled={!selectedLevel || !selectedTopic}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-md disabled:bg-gray-400 dark:disabled:bg-gray-600"
      >
        开始学习
      </button>
    </div>
  );
} 