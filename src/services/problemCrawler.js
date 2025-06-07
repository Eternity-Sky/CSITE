import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = '/api/luogu';

export const fetchProblemList = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/problem/list?page=${page}&_contentOnly=1`);
    const data = response.data;
    
    if (!data.currentData || !data.currentData.problems) {
      throw new Error('获取题目列表失败');
    }

    return data.currentData.problems.result.map(problem => ({
      id: problem.pid,
      title: problem.title,
      difficulty: getDifficultyText(problem.difficulty),
      category: problem.tags.join(', '),
      url: `https://www.luogu.com.cn/problem/${problem.pid}`
    }));
  } catch (error) {
    console.error('获取题目列表失败:', error);
    throw error;
  }
};

export const fetchProblemDetail = async (problemId) => {
  try {
    const response = await axios.get(`${BASE_URL}/problem/${problemId}?_contentOnly=1`);
    const data = response.data;
    
    if (!data.currentData || !data.currentData.problem) {
      throw new Error('获取题目详情失败');
    }

    const problem = data.currentData.problem;
    return {
      id: problemId,
      title: problem.title,
      description: problem.description,
      inputFormat: problem.inputFormat,
      outputFormat: problem.outputFormat,
      sampleInput: problem.samples.map(sample => sample.input).join('\n'),
      sampleOutput: problem.samples.map(sample => sample.output).join('\n'),
      hint: problem.hint,
      difficulty: getDifficultyText(problem.difficulty),
      tags: problem.tags
    };
  } catch (error) {
    console.error('获取题目详情失败:', error);
    throw error;
  }
};

const getDifficultyText = (difficulty) => {
  const difficultyMap = {
    0: '入门',
    1: '普及-',
    2: '普及/提高-',
    3: '普及+/提高',
    4: '提高+/省选-',
    5: '省选/NOI-',
    6: 'NOI/NOI+/CTSC'
  };
  return difficultyMap[difficulty] || '未知';
}; 