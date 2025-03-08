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
    return <div className="text-center py-10">加载中...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">开始学习德语词汇</h1>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">选择级别 (必选)</label>
        <select
          value={selectedLevel}
          onChange={handleLevelChange}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="">请选择级别</option>
          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">选择课程主题</label>
        <select
          value={selectedTopic}
          onChange={handleTopicChange}
          disabled={!selectedLevel}
          className="w-full p-2 border rounded-md"
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
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        开始学习
      </button>
    </div>
  );
} 