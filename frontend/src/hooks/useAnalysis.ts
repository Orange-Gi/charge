import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setProgress, setResult, setThinking, setLoading } from '../store/analysisSlice';
import { analysisApi } from '../services/api';

export function useAnalysis() {
  const dispatch = useDispatch();
  const { progress, result, thinking, loading } = useSelector(
    (state: RootState) => state.analysis
  );

  const startAnalysis = async (file: File) => {
    dispatch(setLoading(true));
    dispatch(setProgress(0));
    dispatch(setThinking(null));
    dispatch(setResult(null));

    try {
      // 上传文件
      const uploadResult = await analysisApi.uploadFile(file);
      const taskId = uploadResult.task_id;

      // 开始分析
      await analysisApi.startAnalysis(taskId);

      // 轮询进度
      const progressInterval = setInterval(async () => {
        const progressData = await analysisApi.getProgress(taskId);
        dispatch(setProgress(progressData.progress));

        if (progressData.status === 'completed') {
          clearInterval(progressInterval);
          const resultData = await analysisApi.getResult(taskId);
          dispatch(setResult(resultData));
          dispatch(setLoading(false));
        }
      }, 1000);

      // 流式获取结果
      analysisApi.streamResult(taskId, (chunk: any) => {
        if (chunk.type === 'thinking') {
          dispatch(setThinking(chunk.content));
        } else if (chunk.type === 'response') {
          // 处理响应
        }
      });
    } catch (error) {
      console.error('分析失败:', error);
      dispatch(setLoading(false));
    }
  };

  return {
    progress,
    result,
    thinking,
    loading,
    startAnalysis,
  };
}

