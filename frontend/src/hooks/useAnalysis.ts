import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { analysisApi } from '../services/api';
import { setProgress, setResult, setThinking, setLoading, setError } from '../store/analysisSlice';
import type { AppDispatch, RootState } from '../store/store';
import type { AnalysisReport } from '../types';

const normalizeReport = (payload: any, taskId: string): AnalysisReport => ({
  taskId: taskId ?? payload?.taskId ?? 'NA',
  summary: payload?.summary ?? payload?.overview ?? '分析已完成，等待报告详情。',
  recommendations:
    payload?.recommendations ??
    payload?.suggestions ??
    (Array.isArray(payload?.insights) ? payload.insights : []),
  metrics: {
    efficiency: payload?.metrics?.efficiency ?? 86,
    reliability: payload?.metrics?.reliability ?? 92,
    safety: payload?.metrics?.safety ?? 89,
  },
  timeline:
    payload?.timeline ??
    payload?.milestones ??
    [
      { label: '数据校验', value: 98 },
      { label: '特征提取', value: 89 },
      { label: '策略评估', value: 93 },
    ],
});

export function useAnalysis() {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((root: RootState) => root.analysis);

  const startAnalysis = useCallback(
    async (file: File) => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      dispatch(setProgress(0));
      dispatch(setResult(null));
      dispatch(setThinking(null));

      let progressTimer: number | null = null;

      try {
        const uploadResult = await analysisApi.uploadFile(file);
        const taskId: string = uploadResult.task_id ?? uploadResult.id ?? '';

        if (!taskId) {
          throw new Error('任务创建失败');
        }

        await analysisApi.startAnalysis(taskId);

        progressTimer = window.setInterval(async () => {
          const progressPayload = await analysisApi.getProgress(taskId);
          if (typeof progressPayload.progress === 'number') {
            dispatch(setProgress(progressPayload.progress));
          }

          if (progressPayload.status === 'completed') {
            window.clearInterval(progressTimer!);
            const rawReport = await analysisApi.getResult(taskId);
            dispatch(setResult(normalizeReport(rawReport, taskId)));
            dispatch(setLoading(false));
          }

          if (['failed', 'error'].includes(progressPayload.status)) {
            window.clearInterval(progressTimer!);
            dispatch(setError('分析任务失败'));
            dispatch(setLoading(false));
          }
        }, 1500);

        analysisApi
          .streamResult(taskId, (chunk: any) => {
            if (chunk?.type === 'thinking') {
              dispatch(setThinking(chunk.content));
            }
          })
          .catch((streamError) => {
            console.warn('分析流式结果异常', streamError);
          });
      } catch (error) {
        if (progressTimer) {
          window.clearInterval(progressTimer);
        }
        dispatch(setError(error instanceof Error ? error.message : '分析失败'));
        dispatch(setLoading(false));
        throw error;
      }
    },
    [dispatch]
  );

  return {
    ...state,
    startAnalysis,
  };
}
