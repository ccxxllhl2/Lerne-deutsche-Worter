'use client';

import { useState, useEffect } from 'react';

export default function ManagePage() {
  const [levels, setLevels] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [newLevel, setNewLevel] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // 获取所有级别
  const fetchLevels = async () => {
    try {
      const response = await fetch('/api/levels');
      const data = await response.json();
      setLevels(data);
      setLoading(false);
    } catch (error) {
      console.error('获取级别失败:', error);
      setMessage({ type: 'error', text: '获取级别失败' });
      setLoading(false);
    }
  };

  // 获取选定级别的主题
  const fetchTopics = async () => {
    if (!selectedLevel) {
      setTopics([]);
      return;
    }

    try {
      const response = await fetch(`/api/topics?levelId=${selectedLevel}`);
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error('获取主题失败:', error);
      setMessage({ type: 'error', text: '获取主题失败' });
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [selectedLevel]);

  // 创建级别
  const handleCreateLevel = async () => {
    if (!newLevel.trim()) return;

    try {
      setLoading(true);
      const response = await fetch('/api/levels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newLevel })
      });

      if (!response.ok) throw new Error('创建级别失败');

      const newLevelData = await response.json();
      setLevels([...levels, newLevelData]);
      setNewLevel('');
      setMessage({ type: 'success', text: '级别创建成功' });
    } catch (error) {
      console.error('创建级别失败:', error);
      setMessage({ type: 'error', text: '创建级别失败' });
    } finally {
      setLoading(false);
    }
  };

  // 创建主题
  const handleCreateTopic = async () => {
    if (!newTopic.trim() || !selectedLevel) return;

    try {
      setLoading(true);
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTopic, levelId: selectedLevel })
      });

      if (!response.ok) throw new Error('创建主题失败');

      const newTopicData = await response.json();
      setTopics([...topics, newTopicData]);
      setNewTopic('');
      setMessage({ type: 'success', text: '主题创建成功' });
    } catch (error) {
      console.error('创建主题失败:', error);
      setMessage({ type: 'error', text: '创建主题失败' });
    } finally {
      setLoading(false);
    }
  };

  // 删除级别
  const handleDeleteLevel = async (levelId) => {
    if (!confirm('确认删除这个级别？这将同时删除该级别下的所有主题和单词！')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/levels/${levelId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('删除级别失败');

      setLevels(levels.filter(level => level.id !== levelId));
      if (selectedLevel === levelId) {
        setSelectedLevel('');
        setTopics([]);
      }
      setMessage({ type: 'success', text: '级别删除成功' });
    } catch (error) {
      console.error('删除级别失败:', error);
      setMessage({ type: 'error', text: '删除级别失败' });
    } finally {
      setLoading(false);
    }
  };

  // 删除主题
  const handleDeleteTopic = async (topicId) => {
    if (!confirm('确认删除这个主题？这将同时删除该主题下的所有单词！')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/topics/${topicId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('删除主题失败');

      setTopics(topics.filter(topic => topic.id !== topicId));
      setMessage({ type: 'success', text: '主题删除成功' });
    } catch (error) {
      console.error('删除主题失败:', error);
      setMessage({ type: 'error', text: '删除主题失败' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">管理级别和主题</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">级别管理</h2>
          
          <div className="mb-4 flex">
            <input
              type="text"
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value)}
              placeholder="输入新级别名称"
              className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            />
            <button
              onClick={handleCreateLevel}
              disabled={!newLevel.trim()}
              className="ml-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-md disabled:bg-gray-400 dark:disabled:bg-gray-600"
            >
              添加
            </button>
          </div>
          
          <ul className="space-y-2">
            {levels.map(level => (
              <li key={level.id} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <span className="text-gray-800 dark:text-gray-200">{level.name}</span>
                <button
                  onClick={() => handleDeleteLevel(level.id)}
                  className="py-1 px-3 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-sm rounded-md"
                >
                  删除
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">主题管理</h2>
          
          <div className="mb-4">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              <option value="">选择级别</option>
              {levels.map(level => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
            
            <div className="flex">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="输入新主题名称"
                disabled={!selectedLevel}
                className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-900"
              />
              <button
                onClick={handleCreateTopic}
                disabled={!newTopic.trim() || !selectedLevel}
                className="ml-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-md disabled:bg-gray-400 dark:disabled:bg-gray-600"
              >
                添加
              </button>
            </div>
          </div>
          
          <ul className="space-y-2">
            {topics.map(topic => (
              <li key={topic.id} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <div>
                  <span className="text-gray-800 dark:text-gray-200">{topic.name}</span>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{levels.find(l => l.id === topic.levelId)?.name}</span>
                  <TopicWordCount topicId={topic.id} topicName={topic.name} />
                </div>
                <button
                  onClick={() => handleDeleteTopic(topic.id)}
                  className="py-1 px-3 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-sm rounded-md"
                >
                  删除
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-black">单词统计</h2>
        {selectedLevel ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <TopicWordCount key={topic.id} topicId={topic.id} topicName={topic.name} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">请先选择左侧的级别</p>
        )}
      </div>
    </div>
  );
}

// 显示某主题的单词数量的组件
function TopicWordCount({ topicId, topicName }) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWordCount = async () => {
      try {
        const response = await fetch(`/api/words/count?topicId=${topicId}`);
        if (!response.ok) throw new Error('获取单词数量失败');
        
        const data = await response.json();
        setCount(data.count);
      } catch (error) {
        console.error('获取单词数量失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWordCount();
  }, [topicId]);

  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-medium mb-1">{topicName}</h3>
      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : (
        <p>{count} 个单词</p>
      )}
    </div>
  );
} 