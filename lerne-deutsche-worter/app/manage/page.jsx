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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8 text-black">管理级别和主题</h1>

      {message && (
        <div 
          className={`p-4 mb-6 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 级别管理 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-black">级别管理</h2>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="text"
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value)}
                placeholder="新建级别 (如: A1, B2 等)"
                className="flex-grow p-2 border rounded-md"
              />
              <button
                onClick={handleCreateLevel}
                disabled={!newLevel.trim() || loading}
                className="ml-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                添加
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-96">
            {levels.length === 0 ? (
              <p className="text-gray-500 text-center">暂无级别数据</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {levels.map((level) => (
                  <li key={level.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`level-${level.id}`}
                        name="selectedLevel"
                        checked={selectedLevel === level.id}
                        onChange={() => setSelectedLevel(level.id)}
                        className="mr-2"
                      />
                      <label htmlFor={`level-${level.id}`} className="cursor-pointer">
                        {level.name}
                      </label>
                    </div>
                    <button
                      onClick={() => handleDeleteLevel(level.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      删除
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 主题管理 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-black">
            {selectedLevel 
              ? `主题管理 (${levels.find(l => l.id === selectedLevel)?.name || ''})`
              : '主题管理 (请先选择级别)'}
          </h2>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="新建主题名称"
                disabled={!selectedLevel}
                className="flex-grow p-2 border rounded-md"
              />
              <button
                onClick={handleCreateTopic}
                disabled={!newTopic.trim() || !selectedLevel || loading}
                className="ml-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                添加
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-96">
            {!selectedLevel ? (
              <p className="text-gray-500 text-center">请先选择左侧的级别</p>
            ) : topics.length === 0 ? (
              <p className="text-gray-500 text-center">此级别下暂无主题</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {topics.map((topic) => (
                  <li key={topic.id} className="py-3 flex justify-between items-center">
                    <span>{topic.name}</span>
                    <button
                      onClick={() => handleDeleteTopic(topic.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      删除
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
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