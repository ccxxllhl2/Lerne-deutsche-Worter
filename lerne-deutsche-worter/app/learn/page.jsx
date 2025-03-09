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
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-lg shadow-md m-4 sm:m-0">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-white">学习完成!</h2>
        <p className="mb-4 sm:mb-6 text-gray-600 dark:text-gray-300">您已成功完成本组单词的学习。</p>
        <div className="flex flex-col space-y-3 sm:space-y-4">
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
    <div className="w-full max-w-2xl mx-auto mt-4 sm:mt-8 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md m-4 sm:m-0">
      {!completed ? (
        <>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">
              {isChineseToGerman ? '中文→德文' : '德文→中文'}
            </h1>
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              进度: {currentIndex + 1}/{words.length}
            </div>
          </div>
          
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="text-lg sm:text-xl font-bold text-center mb-2 sm:mb-4 text-gray-800 dark:text-white">
              {currentQuestion}
            </h2>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-3 sm:p-4 rounded-lg text-center text-base sm:text-lg font-medium transition-colors 
                  ${selectedOption === option 
                    ? (option.correct 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white')
                    : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600'
                  }`}
                disabled={selectedOption !== null}
              >
                {option.text}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-white">学习完成！</h1>
          <p className="text-base sm:text-lg mb-4 sm:mb-6 text-gray-600 dark:text-gray-300">
            你的得分: {currentIndex}/{words.length}
          </p>
          <button
            onClick={handleRestart}
            className="py-2 px-4 sm:px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-md"
          >
            重新开始
          </button>
        </div>
      )}
    </div>
  );
} 