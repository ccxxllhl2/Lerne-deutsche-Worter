'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';

export default function UploadPage() {
  const [levels, setLevels] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  // 获取所有级别
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch('/api/levels');
        const data = await response.json();
        setLevels(data);
      } catch (error) {
        console.error('获取级别失败:', error);
        setMessage({ type: 'error', text: '获取级别失败' });
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
        setMessage({ type: 'error', text: '获取主题失败' });
      }
    };
    fetchTopics();
  }, [selectedLevel]);

  // 文件上传处理
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setCsvFile(file);

      // 解析CSV文件
      Papa.parse(file, {
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            // 过滤掉空行
            const filteredData = results.data.filter(row => 
              row.length >= 2 && row[0] && row[1]
            );

            if (filteredData.length > 0) {
              setParsedData(filteredData);
              // 仅预览前5行
              setPreviewData(filteredData.slice(0, 5));
            } else {
              setMessage({ type: 'error', text: 'CSV文件格式不正确或没有数据' });
            }
          }
        },
        error: (error) => {
          console.error('解析CSV失败:', error);
          setMessage({ type: 'error', text: '解析CSV失败' });
        }
      });
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
    setSelectedTopic('');
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
    setIsCreatingTopic(e.target.value === 'new');
  };

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
      setSelectedTopic(newTopicData.id);
      setNewTopic('');
      setIsCreatingTopic(false);
      setMessage({ type: 'success', text: '主题创建成功' });
    } catch (error) {
      console.error('创建主题失败:', error);
      setMessage({ type: 'error', text: '创建主题失败' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!csvFile || !selectedLevel || !selectedTopic || parsedData.length === 0) {
      setMessage({ type: 'error', text: '请选择级别、主题和有效的CSV文件' });
      return;
    }

    try {
      setLoading(true);
      // 准备单词数据
      const wordsData = parsedData.map(row => ({
        german: row[0],
        chinese: row[1],
        levelId: selectedLevel,
        topicId: selectedTopic
      }));

      const response = await fetch('/api/words/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: wordsData })
      });

      if (!response.ok) throw new Error('上传单词失败');

      const result = await response.json();
      setMessage({ 
        type: 'success', 
        text: `成功导入 ${result.count} 个单词` 
      });
      
      // 清空表单
      setCsvFile(null);
      setParsedData([]);
      setPreviewData([]);
    } catch (error) {
      console.error('上传单词失败:', error);
      setMessage({ type: 'error', text: '上传单词失败' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">上传单词表</h1>

      {message && (
        <div 
          className={`p-4 mb-6 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
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

        <div>
          <label className="block text-gray-700 mb-2">选择或创建课程主题</label>
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
            <option value="new">+ 创建新主题</option>
          </select>
        </div>
      </div>

      {isCreatingTopic && (
        <div className="mb-6">
          <div className="flex items-center">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="输入新主题名称"
              className="flex-grow p-2 border rounded-md"
            />
            <button
              onClick={handleCreateTopic}
              disabled={!newTopic.trim() || loading}
              className="ml-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              创建
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">上传CSV文件</label>
        <div 
          {...getRootProps()} 
          className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-blue-500"
        >
          <input {...getInputProps()} />
          {csvFile ? (
            <p>已选择文件: {csvFile.name}</p>
          ) : (
            <p>拖放CSV文件到此处，或点击选择文件</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            CSV文件格式: 第一列为德语单词，第二列为中文翻译，无需表头
          </p>
        </div>
      </div>

      {previewData.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">数据预览 (前5行):</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    德语
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    中文
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{row[0]}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            共 {parsedData.length} 行数据将被导入
          </p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!csvFile || !selectedLevel || !selectedTopic || loading || parsedData.length === 0}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? '上传中...' : '上传单词表'}
      </button>

      <div className="mt-8 p-4 bg-blue-50 rounded-md">
        <h3 className="text-lg font-medium mb-2">CSV模板说明</h3>
        <p className="mb-2">您的CSV文件应该包含两列，无需表头：</p>
        <ul className="list-disc list-inside mb-2">
          <li>第一列: 德语单词</li>
          <li>第二列: 中文翻译</li>
        </ul>
        <p className="mb-2">示例:</p>
        <pre className="bg-gray-100 p-2 rounded-md">
          der Hund,狗<br />
          die Katze,猫<br />
          das Haus,房子
        </pre>
      </div>
    </div>
  );
} 