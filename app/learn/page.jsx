'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function LearnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const levelId = searchParams.get('levelId');
  const topicId = searchParams.get('topicId');
  
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);
  const [isChineseToGerman, setIsChineseToGerman] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // 获取单词列表
  useEffect(() => {
    if (!levelId || !topicId) {
      router.push('/');
      return;
    }
    
    const fetchWords = async () => {
      try {
        const response = await fetch(`/api/words?levelId=${levelId}&topicId=${topicId}`);
        if (!response.ok) throw new Error('获取单词失败');
        
        const data = await response.json();
        if (data.length < 3) {
          alert('单词数量不足，请至少添加3个单词');
          router.push('/');
          return;
        }
        
        // 洗牌算法打乱顺序
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setWords(shuffled);
        setLoading(false);
      } catch (error) {
        console.error('获取单词失败:', error);
        setLoading(false);
        router.push('/');
      }
    };
    
    fetchWords();
  }, [levelId, topicId, router]);
  
  // 准备当前问题和选项
  useEffect(() => {
    if (words.length === 0 || completed) return;
    
    const currentWord = words[currentIndex];
    if (!currentWord) {
      // 如果中德学习已完成，切换到德中学习
      if (isChineseToGerman) {
        setIsChineseToGerman(false);
        setCurrentIndex(0);
        return;
      } else {
        // 如果德中学习也完成，标记整个学习已完成
        setCompleted(true);
        return;
      }
    }
    
    // 生成两个错误选项
    const otherWords = words.filter((_, index) => index !== currentIndex);
    const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5);
    const wrongOptions = shuffledOthers.slice(0, 2);
    
    // 根据当前学习模式设置问题和选项
    if (isChineseToGerman) {
      // 中文 -> 德语模式
      setCurrentQuestion(currentWord.chinese);
      const allOptions = [
        { id: 1, text: currentWord.german, correct: true },
        { id: 2, text: wrongOptions[0].german, correct: false },
        { id: 3, text: wrongOptions[1].german, correct: false }
      ].sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    } else {
      // 德语 -> 中文模式
      setCurrentQuestion(currentWord.german);
      const allOptions = [
        { id: 1, text: currentWord.chinese, correct: true },
        { id: 2, text: wrongOptions[0].chinese, correct: false },
        { id: 3, text: wrongOptions[1].chinese, correct: false }
      ].sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    }
    
    setSelectedOption(null);
    setResult(null);
  }, [currentIndex, words, isChineseToGerman, completed]);
  
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setResult({
      correct: option.correct,
      message: option.correct ? '正确!' : '错误!'
    });
    
    // 1.5秒后自动前进到下一个问题
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
    }, 1500);
  };
  
  const handleRestart = () => {
    setIsChineseToGerman(true);
    setCurrentIndex(0);
    setCompleted(false);
    // 重新洗牌单词顺序
    setWords([...words].sort(() => Math.random() - 0.5));
  };
  
  if (loading) {
    return <div className="text-center py-10">加载中...</div>;
  }
  
  if (completed) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">学习完成!</h2>
        <p className="mb-6">您已成功完成本组单词的学习。</p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleRestart}
            className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            重新学习此组单词
          </button>
          <button
            onClick={() => router.push('/')}
            className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            返回主页
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {isChineseToGerman ? '中 → 德' : '德 → 中'} 学习
        </div>
        <div className="text-sm text-gray-500">
          进度: {currentIndex + 1}/{words.length}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">选择正确的{isChineseToGerman ? '德语' : '中文'}:</h2>
        <div className="p-4 bg-gray-100 rounded-md text-center text-xl">
          {currentQuestion}
        </div>
      </div>
      
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option)}
            disabled={selectedOption !== null}
            className={`w-full p-3 text-left rounded-md border ${
              selectedOption === option
                ? option.correct
                  ? 'bg-green-100 border-green-500'
                  : 'bg-red-100 border-red-500'
                : 'hover:bg-gray-100 border-gray-300'
            }`}
          >
            {option.text}
          </button>
        ))}
      </div>
      
      {result && (
        <div
          className={`mt-4 p-3 rounded-md text-center ${
            result.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  );
} 